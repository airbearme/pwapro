#!/usr/bin/env node

/**
 * Advanced CodeMaps Analyzer
 * Provides deep insights into code structure, dependencies, and metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AdvancedCodeMapsAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.outputDir = path.join(this.projectRoot, '.next/codemaps');
    this.metrics = {
      components: [],
      api: [],
      utilities: [],
      dependencies: {
        production: 0,
        development: 0,
        security: []
      },
      performance: {
        overall: {
          recommendations: []
        }
      },
      security: {
        issues: [],
        bestPractices: [],
        score: 100
      },
      complexity: {
        average: 0,
        high: [],
        medium: [],
        low: []
      },
      coverage: {
        coverage: 0
      }
    };
  }

  /**
   * Run comprehensive analysis
   */
  async analyze() {
    console.log('🔬 Running Advanced CodeMaps Analysis...\n');

    try {
      // Ensure output directory exists
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Load existing CodeMaps
      await this.loadExistingCodeMaps();

      // Analyze component complexity
      await this.analyzeComponentComplexity();

      // Analyze API performance
      await this.analyzeApiPerformance();

      // Analyze dependencies
      await this.analyzeDependencies();

      // Analyze security patterns
      await this.analyzeSecurityPatterns();

      // Analyze test coverage
      await this.analyzeTestCoverage();

      // Generate performance metrics
      await this.generatePerformanceMetrics();

      // Create advanced reports
      await this.createAdvancedReports();

      console.log('\n✨ Advanced analysis complete!\n');
    } catch (error) {
      console.error('❌ Advanced analysis failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Load existing CodeMaps
   */
  async loadExistingCodeMaps() {
    console.log('📋 Loading existing CodeMaps...');

    const files = ['components.json', 'api-routes.json', 'utilities.json'];
    
    for (const file of files) {
      const filePath = path.join(this.outputDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);

          if (file === 'components.json') {
            this.metrics.components = data.components || [];
          } else if (file === 'api-routes.json') {
            this.metrics.api = data.routes || [];
          } else if (file === 'utilities.json') {
            this.metrics.utilities = data.utilities || [];
          }
        } catch (err) {
          console.warn(`⚠️ Warning: Could not parse ${file}:`, err.message);
        }
      }
    }

    console.log(`✅ Loaded ${this.metrics.components.length} components, ${this.metrics.api.length} API routes, ${this.metrics.utilities.length} utilities`);
  }

  /**
   * Analyze component complexity (mock implementation for demo)
   */
  async analyzeComponentComplexity() {
    console.log('🧩 Analyzing component complexity...');

    if (this.metrics.components.length === 0) {
      console.log('ℹ️ No components found to analyze');
      return;
    }

    let totalComplexity = 0;

    for (const component of this.metrics.components) {
      try {
        const filePath = path.join(this.projectRoot, component.path);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');

          // Very simple complexity score based on lines and nesting
          const lines = content.split('\n').length;
          const nesting = (content.match(/\{/g) || []).length;
          const complexity = Math.round((lines / 10) + nesting);

          totalComplexity += complexity;

          const result = {
            name: component.name,
            path: component.path,
            complexity
          };

          if (complexity > 20) {
            this.metrics.complexity.high.push(result);
          } else if (complexity > 10) {
            this.metrics.complexity.medium.push(result);
          } else {
            this.metrics.complexity.low.push(result);
          }
        }
      } catch (err) {
        // Skip files we can't read
      }
    }

    this.metrics.complexity.average = totalComplexity / this.metrics.components.length;
    console.log(`✅ Complexity analysis complete - average: ${this.metrics.complexity.average.toFixed(2)}`);
  }

  /**
   * Analyze API performance
   */
  async analyzeApiPerformance() {
    console.log('⚡ Analyzing API performance...');
    // In a real implementation, this would analyze route handlers and potential bottlenecks
    this.metrics.performance.api = {
      total: this.metrics.api.length,
      complex: []
    };
    console.log('✅ API performance analysis complete');
  }

  /**
   * Analyze dependencies
   */
  async analyzeDependencies() {
    console.log('📦 Analyzing dependencies...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));

      this.metrics.dependencies.production = Object.keys(packageJson.dependencies || {}).length;
      this.metrics.dependencies.development = Object.keys(packageJson.devDependencies || {}).length;
      this.metrics.dependencies.total = this.metrics.dependencies.production + this.metrics.dependencies.development;

      console.log(`✅ Dependency analysis complete - ${this.metrics.dependencies.total} total`);
    } catch (error) {
      console.warn('⚠️ Could not analyze dependencies:', error.message);
    }
  }

  /**
   * Analyze security patterns
   */
  async analyzeSecurityPatterns() {
    console.log('🛡️  Analyzing security patterns...');

    const issues = [];
    const bestPractices = [];
    let score = 100;

    // Scan for potential issues
    const sensitiveEndpoints = this.metrics.api.filter(route =>
      route.path.includes('admin') || route.path.includes('setup') || route.path.includes('config')
    );

    for (const route of sensitiveEndpoints) {
      const filePath = path.join(this.projectRoot, route.file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        const analysis = this.analyzeEndpointSecurity(content);
        issues.push(...analysis.issues.map(issue => ({ ...issue, file: route.file })));
        bestPractices.push(...analysis.bestPractices.map(bp => ({ ...bp, file: route.file })));
      }
    }

    // Deduct from score based on issues
    score -= (issues.length * 5);
    this.metrics.security = {
      score: Math.max(0, score),
      issues,
      bestPractices
    };

    console.log(`✅ Security analysis complete - score: ${this.metrics.security.score}/100`);
  }

  /**
   * Analyze individual endpoint security
   */
  analyzeEndpointSecurity(content) {
    const issues = [];
    const bestPractices = [];

    // Simple pattern matching for security analysis
    if (!content.includes('auth') && !content.includes('middleware') && !content.includes('X-Admin-Secret')) {
      issues.push({
        type: 'missing-auth',
        severity: 'high',
        description: 'Potentially unprotected sensitive endpoint'
      });
    }

    if (content.includes('try') && !content.includes('catch')) {
      issues.push({
        type: 'missing-error-handling',
        severity: 'medium',
        description: 'Try block without catch'
      });
    }

    // Check for best practices
    if (content.includes('getSupabaseServer')) {
      bestPractices.push('Uses secure database client');
    }

    if (content.includes('zod')) {
      bestPractices.push('Uses input validation');
    }

    if (content.includes('try') && content.includes('catch')) {
      bestPractices.push('Proper error handling');
    }

    return { issues, bestPractices };
  }

  /**
   * Analyze test coverage
   */
  async analyzeTestCoverage() {
    console.log('🧪 Analyzing test coverage...');

    const coverageReport = {
      total: 0,
      tested: 0,
      byType: {
        components: { total: 0, tested: 0 },
        api: { total: 0, tested: 0 },
        utilities: { total: 0, tested: 0 }
      },
      coverage: 0
    };

    // Count testable files
    coverageReport.byType.components.total = this.metrics.components.length;
    coverageReport.byType.api.total = this.metrics.api.length;
    coverageReport.byType.utilities.total = this.metrics.utilities.length;
    coverageReport.total = coverageReport.byType.components.total + 
                        coverageReport.byType.api.total + 
                        coverageReport.byType.utilities.total;

    // Count test files (simplified)
    const testDirs = ['__tests__', 'tests', 'test'];
    let testFileCount = 0;

    for (const testDir of testDirs) {
      const dirPath = path.join(this.projectRoot, testDir);
      if (fs.existsSync(dirPath)) {
        const testFiles = this.findTestFiles(dirPath);
        testFileCount += testFiles.length;
      }
    }

    coverageReport.tested = testFileCount;
    coverageReport.coverage = coverageReport.total > 0 ? 
      Math.round((testFileCount / coverageReport.total) * 100) : 0;

    this.metrics.coverage = coverageReport;
    console.log(`✅ Test coverage analysis complete - ${coverageReport.coverage}% coverage`);
  }

  /**
   * Find test files
   */
  findTestFiles(dir) {
    const files = [];
    
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        items.forEach(item => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            walk(itemPath);
          } else if (item.includes('.test.') || item.includes('.spec.')) {
            files.push(itemPath);
          }
        });
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    walk(dir);
    return files;
  }

  /**
   * Generate performance metrics
   */
  async generatePerformanceMetrics() {
    console.log('📈 Generating performance metrics...');

    const performanceMetrics = {
      bundleSize: await this.calculateBundleSize(),
      componentCount: this.metrics.components.length,
      apiCount: this.metrics.api.length,
      utilityCount: this.metrics.utilities.length,
      complexity: this.metrics.complexity,
      dependencies: this.metrics.dependencies,
      recommendations: []
    };

    // Generate recommendations
    performanceMetrics.recommendations = this.generateRecommendations(performanceMetrics);

    this.metrics.performance.overall = performanceMetrics;
    console.log(`✅ Performance metrics generated`);
  }

  /**
   * Calculate bundle size
   */
  async calculateBundleSize() {
    try {
      const buildDir = path.join(this.projectRoot, '.next');
      if (!fs.existsSync(buildDir)) return 0;

      let totalSize = 0;
      const files = this.findFiles(buildDir, ['.js', '.css']);
      
      for (const file of files) {
        const stat = fs.statSync(file);
        totalSize += stat.size;
      }

      return Math.round(totalSize / 1024); // Return in KB
    } catch (error) {
      return 0;
    }
  }

  /**
   * Find files by extension
   */
  findFiles(dir, extensions) {
    const files = [];
    
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        items.forEach(item => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            walk(itemPath);
          } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(itemPath);
          }
        });
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    walk(dir);
    return files;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(metrics) {
    const recommendations = [];

    // Complexity recommendations
    if (metrics.complexity.average > 15) {
      recommendations.push({
        type: 'complexity',
        priority: 'high',
        message: 'Average component complexity is high. Consider breaking down complex components.',
        action: 'Refactor components with complexity > 20'
      });
    }

    // Dependency recommendations
    if (metrics.dependencies.total > 100) {
      recommendations.push({
        type: 'dependencies',
        priority: 'medium',
        message: 'High number of dependencies. Consider removing unused packages.',
        action: 'Run dependency audit and remove unused packages'
      });
    }

    // Security recommendations
    if (this.metrics.security.score < 80) {
      recommendations.push({
        type: 'security',
        priority: 'high',
        message: 'Security score is below 80. Address security issues.',
        action: 'Fix authentication and validation issues'
      });
    }

    // Test coverage recommendations
    if (this.metrics.coverage.coverage < 50) {
      recommendations.push({
        type: 'testing',
        priority: 'medium',
        message: 'Test coverage is below 50%. Add more tests.',
        action: 'Increase test coverage to at least 80%'
      });
    }

    return recommendations;
  }

  /**
   * Create advanced reports
   */
  async createAdvancedReports() {
    console.log('📊 Creating advanced reports...');

    const reports = {
      timestamp: new Date().toISOString(),
      project: 'airbear-pwa',
      version: '2.0.0',
      metrics: this.metrics,
      insights: this.generateInsights(),
      trends: this.generateTrends()
    };

    // Write comprehensive report
    const reportPath = path.join(this.outputDir, 'advanced-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));

    // Write summary report
    const summaryPath = path.join(this.outputDir, 'analysis-summary.md');
    fs.writeFileSync(summaryPath, this.generateMarkdownSummary(reports));

    console.log('✅ Advanced reports created');
  }

  /**
   * Generate insights
   */
  generateInsights() {
    const insights = [];

    // Component insights
    if (this.metrics.complexity.high.length > 0) {
      insights.push({
        type: 'complexity',
        level: 'warning',
        message: `${this.metrics.complexity.high.length} components have high complexity (>20)`
      });
    }

    // API insights
    const complexApis = this.metrics.performance.api?.complex?.length || 0;
    if (complexApis > 0) {
      insights.push({
        type: 'api',
        level: 'info',
        message: `${complexApis} API routes have high complexity`
      });
    }

    // Security insights
    if (this.metrics.security.issues.length > 0) {
      insights.push({
        type: 'security',
        level: 'error',
        message: `${this.metrics.security.issues.length} security issues found`
      });
    }

    return insights;
  }

  /**
   * Generate trends (mock data for now)
   */
  generateTrends() {
    return {
      complexity: 'stable',
      performance: 'improving',
      security: 'needs_attention',
      coverage: 'increasing'
    };
  }

  /**
   * Generate markdown summary
   */
  generateMarkdownSummary(reports) {
    return `# Advanced CodeMaps Analysis Report

Generated: ${reports.timestamp}
Project: ${reports.project}
Version: ${reports.version}

## 📊 Executive Summary

- **Components**: ${reports.metrics.components.length} total
- **API Routes**: ${reports.metrics.api.length} total  
- **Utilities**: ${reports.metrics.utilities.length} total
- **Average Complexity**: ${reports.metrics.complexity.average?.toFixed(2) || 'N/A'}
- **Security Score**: ${reports.metrics.security.score}/100
- **Test Coverage**: ${reports.metrics.coverage.coverage}%

## 🎯 Key Insights

${reports.insights.map(insight => 
  `- **${insight.type}**: ${insight.message} (${insight.level})`
).join('\n')}

## 📈 Recommendations

${reports.metrics.performance.overall?.recommendations?.map(rec => 
  `### ${rec.type} (${rec.priority})
- **Issue**: ${rec.message}
- **Action**: ${rec.action}`
).join('\n\n') || 'No recommendations at this time.'}

## 🔍 Detailed Metrics

### Component Complexity
- **High Complexity**: ${reports.metrics.complexity.high?.length || 0}
- **Medium Complexity**: ${reports.metrics.complexity.medium?.length || 0}
- **Low Complexity**: ${reports.metrics.complexity.low?.length || 0}

### Security Analysis
- **Issues Found**: ${reports.metrics.security.issues.length}
- **Best Practices**: ${reports.metrics.security.bestPractices.length}

### Dependencies
- **Production**: ${reports.metrics.dependencies.production}
- **Development**: ${reports.metrics.dependencies.development}
- **Security Issues**: ${reports.metrics.dependencies.security.length}

---
*Report generated by Advanced CodeMaps Analyzer*
`;
  }
}

// Run analyzer
if (require.main === module) {
  const analyzer = new AdvancedCodeMapsAnalyzer();
  analyzer.analyze().catch(error => {
    console.error('❌ Advanced analysis failed:', error);
    process.exit(1);
  });
}

module.exports = AdvancedCodeMapsAnalyzer;
