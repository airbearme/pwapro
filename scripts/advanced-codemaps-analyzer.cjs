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
      dependencies: {},
      performance: {},
      security: {},
      coverage: {}
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

      console.log('✅ Advanced CodeMaps Analysis Complete!');
      console.log(`📁 Reports generated in: ${this.outputDir}`);

    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
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
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        if (file === 'components.json') {
          this.metrics.components = data.components || [];
        } else if (file === 'api-routes.json') {
          this.metrics.api = data.routes || [];
        } else if (file === 'utilities.json') {
          this.metrics.utilities = data.utilities || [];
        }
      }
    }

    console.log(`✅ Loaded ${this.metrics.components.length} components, ${this.metrics.api.length} API routes, ${this.metrics.utilities.length} utilities`);
  }

  /**
   * Analyze component complexity
   */
  async analyzeComponentComplexity() {
    console.log('🧩 Analyzing component complexity...');

    const complexityReport = {
      total: 0,
      average: 0,
      high: [],
      medium: [],
      low: [],
      byType: {
        ui: { count: 0, complexity: [] },
        form: { count: 0, complexity: [] },
        layout: { count: 0, complexity: [] },
        map: { count: 0, complexity: [] }
      }
    };

    for (const component of this.metrics.components) {
      const complexity = await this.calculateComponentComplexity(component);
      
      complexityReport.total += complexity;
      
      const type = component.type || 'component';
      if (complexityReport.byType[type]) {
        complexityReport.byType[type].count++;
        complexityReport.byType[type].complexity.push(complexity);
      }

      if (complexity > 20) {
        complexityReport.high.push({ ...component, complexity });
      } else if (complexity > 10) {
        complexityReport.medium.push({ ...component, complexity });
      } else {
        complexityReport.low.push({ ...component, complexity });
      }
    }

    complexityReport.average = complexityReport.total / this.metrics.components.length;

    // Calculate averages by type
    for (const [type, data] of Object.entries(complexityReport.byType)) {
      if (data.complexity.length > 0) {
        data.average = data.complexity.reduce((a, b) => a + b, 0) / data.complexity.length;
      }
    }

    this.metrics.complexity = complexityReport;
    console.log(`✅ Complexity analysis complete - Average: ${complexityReport.average.toFixed(2)}`);
  }

  /**
   * Calculate component complexity
   */
  async calculateComponentComplexity(component) {
    try {
      const filePath = path.join(this.projectRoot, component.path);
      if (!fs.existsSync(filePath)) return 1;

      const content = fs.readFileSync(filePath, 'utf8');
      
      let complexity = 1;
      
      // Count React hooks
      const hooks = content.match(/use[A-Z][a-zA-Z]*/g) || [];
      complexity += hooks.length * 2;
      
      // Count conditionals
      const conditionals = content.match(/\b(if|else|switch|case|ternary|\?|\:)/g) || [];
      complexity += conditionals.length;
      
      // Count loops
      const loops = content.match(/\b(for|while|do|map|filter|reduce|forEach)/g) || [];
      complexity += loops.length * 2;
      
      // Count function definitions
      const functions = content.match(/function\s+\w+|=>\s*{|\w+\s*:\s*\([^)]*\)\s*=>/g) || [];
      complexity += functions.length;
      
      // File size factor
      const sizeKB = component.size / 1024;
      complexity += Math.min(sizeKB / 10, 5);
      
      return Math.round(complexity);
    } catch (error) {
      return 1;
    }
  }

  /**
   * Analyze API performance
   */
  async analyzeApiPerformance() {
    console.log('🔌 Analyzing API performance...');

    const performanceReport = {
      total: this.metrics.api.length,
      byMethod: {
        GET: 0,
        POST: 0,
        PUT: 0,
        DELETE: 0,
        PATCH: 0
      },
      complex: [],
      simple: [],
      byPath: {}
    };

    for (const route of this.metrics.api) {
      const method = route.method || 'UNKNOWN';
      if (performanceReport.byMethod[method]) {
        performanceReport.byMethod[method]++;
      }

      const complexity = await this.calculateApiComplexity(route);
      
      if (complexity > 15) {
        performanceReport.complex.push({ ...route, complexity });
      } else {
        performanceReport.simple.push({ ...route, complexity });
      }

      // Group by path pattern
      const pathPattern = this.extractPathPattern(route.path);
      if (!performanceReport.byPath[pathPattern]) {
        performanceReport.byPath[pathPattern] = { count: 0, routes: [] };
      }
      performanceReport.byPath[pathPattern].count++;
      performanceReport.byPath[pathPattern].routes.push({ ...route, complexity });
    }

    this.metrics.performance.api = performanceReport;
    console.log(`✅ API performance analysis complete`);
  }

  /**
   * Calculate API complexity
   */
  async calculateApiComplexity(route) {
    try {
      const filePath = path.join(this.projectRoot, route.file);
      if (!fs.existsSync(filePath)) return 1;

      const content = fs.readFileSync(filePath, 'utf8');
      
      let complexity = 1;
      
      // Count database operations
      const dbOps = content.match(/\b(select|insert|update|delete|create|find|query)/gi) || [];
      complexity += dbOps.length * 3;
      
      // Count error handling
      const errorHandling = content.match(/\b(try|catch|throw|error)/gi) || [];
      complexity += errorHandling.length;
      
      // Count validation
      const validation = content.match(/\b(validate|check|verify|ensure)/gi) || [];
      complexity += validation.length * 2;
      
      // Count async operations
      const asyncOps = content.match(/\b(await|async|Promise)/g) || [];
      complexity += asyncOps.length;
      
      return Math.round(complexity);
    } catch (error) {
      return 1;
    }
  }

  /**
   * Extract path pattern
   */
  extractPathPattern(path) {
    if (path.includes('/auth/')) return 'auth';
    if (path.includes('/rides/')) return 'rides';
    if (path.includes('/spots/')) return 'spots';
    if (path.includes('/stripe/')) return 'payments';
    if (path.includes('/bodega')) return 'bodega';
    return 'other';
  }

  /**
   * Analyze dependencies
   */
  async analyzeDependencies() {
    console.log('📦 Analyzing dependencies...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = {
      total: 0,
      production: Object.keys(packageJson.dependencies || {}).length,
      development: Object.keys(packageJson.devDependencies || {}).length,
      categories: {
        ui: [],
        database: [],
        auth: [],
        payment: [],
        testing: [],
        build: [],
        other: []
      },
      outdated: [],
      security: []
    };

    dependencies.total = dependencies.production + dependencies.development;

    // Categorize dependencies
    for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
      const category = this.categorizeDependency(name);
      dependencies.categories[category].push({ name, version });
    }

    // Check for security issues (simplified)
    const securityIssues = await this.checkDependencySecurity(packageJson.dependencies || {});
    dependencies.security = securityIssues;

    this.metrics.dependencies = dependencies;
    console.log(`✅ Dependency analysis complete - ${dependencies.total} total dependencies`);
  }

  /**
   * Categorize dependency
   */
  categorizeDependency(name) {
    const uiLibs = ['react', 'next', '@radix-ui', 'lucide-react', 'framer-motion', 'tailwindcss'];
    const dbLibs = ['@supabase', 'drizzle-orm'];
    const authLibs = ['next-auth', '@supabase/auth-helpers'];
    const paymentLibs = ['stripe'];
    const testingLibs = ['jest', 'playwright', '@testing-library'];
    const buildLibs = ['typescript', 'eslint', 'prettier', 'webpack'];

    if (uiLibs.some(lib => name.includes(lib))) return 'ui';
    if (dbLibs.some(lib => name.includes(lib))) return 'database';
    if (authLibs.some(lib => name.includes(lib))) return 'auth';
    if (paymentLibs.some(lib => name.includes(lib))) return 'payment';
    if (testingLibs.some(lib => name.includes(lib))) return 'testing';
    if (buildLibs.some(lib => name.includes(lib))) return 'build';
    return 'other';
  }

  /**
   * Check dependency security (simplified)
   */
  async checkDependencySecurity(dependencies) {
    const issues = [];
    
    // Known vulnerable packages (simplified example)
    const knownVulnerable = {
      'lodash': '<4.17.21',
      'axios': '<0.21.1'
    };

    for (const [name, version] of Object.entries(dependencies)) {
      if (knownVulnerable[name]) {
        issues.push({
          name,
          currentVersion: version,
          safeVersion: knownVulnerable[name],
          severity: 'high'
        });
      }
    }

    return issues;
  }

  /**
   * Analyze security patterns
   */
  async analyzeSecurityPatterns() {
    console.log('🔒 Analyzing security patterns...');

    const securityReport = {
      score: 0,
      issues: [],
      bestPractices: [],
      byFile: {}
    };

    // Analyze API routes for security
    for (const route of this.metrics.api) {
      const filePath = path.join(this.projectRoot, route.file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileSecurity = await this.analyzeFileSecurity(content, route.path);
        
        securityReport.byFile[route.path] = fileSecurity;
        securityReport.issues.push(...fileSecurity.issues);
        securityReport.bestPractices.push(...fileSecurity.bestPractices);
      }
    }

    // Calculate security score
    const maxScore = 100;
    const deductions = securityReport.issues.length * 10;
    securityReport.score = Math.max(0, maxScore - deductions);

    this.metrics.security = securityReport;
    console.log(`✅ Security analysis complete - Score: ${securityReport.score}/100`);
  }

  /**
   * Analyze file security
   */
  async analyzeFileSecurity(content, filePath) {
    const issues = [];
    const bestPractices = [];

    // Check for authentication
    if (filePath.includes('/api/') && !content.includes('getSupabaseServer') && !content.includes('auth')) {
      issues.push({
        type: 'missing-auth',
        severity: 'high',
        description: 'API route missing authentication'
      });
    }

    // Check for input validation
    if (content.includes('req.body') && !content.includes('zod') && !content.includes('validate')) {
      issues.push({
        type: 'missing-validation',
        severity: 'medium',
        description: 'Missing input validation'
      });
    }

    // Check for error handling
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

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

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
