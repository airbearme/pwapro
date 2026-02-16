#!/usr/bin/env node

/**
 * Comprehensive Validation Script
 * Runs thorough validation until everything passes without warnings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ComprehensiveValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      retries: 0
    };
    this.maxRetries = 3;
  }

  /**
   * Run comprehensive validation
   */
  async validate() {
    console.log('🔍 Starting Comprehensive Validation...\n');

    try {
      // Run validation in a loop until everything passes
      let allPassed = false;
      let attempt = 1;

      while (!allPassed && attempt <= this.maxRetries) {
        console.log(`\n📋 Validation Attempt ${attempt}/${this.maxRetries}`);
        console.log('='.repeat(50));

        // Clear previous results
        this.results.failed = [];
        this.results.warnings = [];

        // Run all validation steps
        await this.runTypeCheck();
        await this.runLinting();
        await this.runCodeMapsValidation();
        await this.runBuild();
        await this.runUnitTests();
        await this.runE2ETests();
        await this.runPerformanceTests();
        await this.runSecurityTests();
        await this.runAccessibilityTests();
        await this.runDatabaseTests();
        await this.runStripeTests();
        await this.runPWATests();
        await this.runComponentTests();
        await this.runRealtimeTests();
        await this.runBundleSizeTests();
        await this.runProductionTests();

        // Check if everything passed
        allPassed = this.results.failed.length === 0 && this.results.warnings.length === 0;

        if (allPassed) {
          console.log('\n🎉 All validations passed!');
          break;
        } else {
          console.log(`\n⚠️  Validation failed with ${this.results.failed.length} errors and ${this.results.warnings.length} warnings`);

          if (attempt < this.maxRetries) {
            console.log(`🔄 Retrying... (${attempt + 1}/${this.maxRetries})`);
            await this.sleep(2000); // Wait 2 seconds before retry
          }
        }

        attempt++;
      }

      // Generate final report
      this.generateFinalReport();

      if (!allPassed) {
        console.log('\n❌ Validation failed after maximum retries');
        process.exit(1);
      }

    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Run TypeScript type checking
   */
  async runTypeCheck() {
    console.log('\n🔷 Running TypeScript Type Check...');

    try {
      execSync('npm run type-check', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('TypeScript Type Check');
      console.log('✅ TypeScript Type Check passed');
    } catch (error) {
      this.results.failed.push('TypeScript Type Check');
      console.log('❌ TypeScript Type Check failed');
    }
  }

  /**
   * Run ESLint
   */
  async runLinting() {
    console.log('\n🔍 Running ESLint...');

    try {
      execSync('npm run lint', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('ESLint');
      console.log('✅ ESLint passed');
    } catch (error) {
      this.results.failed.push('ESLint');
      console.log('❌ ESLint failed');
    }
  }

  /**
   * Run CodeMaps validation
   */
  async runCodeMapsValidation() {
    console.log('\n🗺️  Running CodeMaps Validation...');

    try {
      execSync('npm run codemaps:validate', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('CodeMaps Validation');
      console.log('✅ CodeMaps Validation passed');
    } catch (error) {
      this.results.failed.push('CodeMaps Validation');
      console.log('❌ CodeMaps Validation failed');
    }
  }

  /**
   * Run build
   */
  async runBuild() {
    console.log('\n🔨 Running Build...');

    try {
      execSync('npm run build', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Build');
      console.log('✅ Build passed');
    } catch (error) {
      this.results.failed.push('Build');
      console.log('❌ Build failed');
    }
  }

  /**
   * Run unit tests
   */
  async runUnitTests() {
    console.log('\n🧪 Running Unit Tests...');

    try {
      execSync('npm run test:unit', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Unit Tests');
      console.log('✅ Unit Tests passed');
    } catch (error) {
      this.results.failed.push('Unit Tests');
      console.log('❌ Unit Tests failed');
    }
  }

  /**
   * Run E2E tests
   */
  async runE2ETests() {
    console.log('\n🎭 Running E2E Tests...');

    try {
      execSync('npm run test:e2e', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('E2E Tests');
      console.log('✅ E2E Tests passed');
    } catch (error) {
      this.results.failed.push('E2E Tests');
      console.log('❌ E2E Tests failed');
    }
  }

  /**
   * Run performance tests
   */
  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');

    try {
      execSync('npm run test:performance', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Performance Tests');
      console.log('✅ Performance Tests passed');
    } catch (error) {
      this.results.failed.push('Performance Tests');
      console.log('❌ Performance Tests failed');
    }
  }

  /**
   * Run security tests
   */
  async runSecurityTests() {
    console.log('\n🔒 Running Security Tests...');

    try {
      execSync('npm run test:security', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Security Tests');
      console.log('✅ Security Tests passed');
    } catch (error) {
      this.results.failed.push('Security Tests');
      console.log('❌ Security Tests failed');
    }
  }

  /**
   * Run accessibility tests
   */
  async runAccessibilityTests() {
    console.log('\n♿ Running Accessibility Tests...');

    try {
      execSync('npm run test:accessibility', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Accessibility Tests');
      console.log('✅ Accessibility Tests passed');
    } catch (error) {
      this.results.failed.push('Accessibility Tests');
      console.log('❌ Accessibility Tests failed');
    }
  }

  /**
   * Run database tests
   */
  async runDatabaseTests() {
    console.log('\n🗄️  Running Database Tests...');

    try {
      execSync('npm run test:database', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Database Tests');
      console.log('✅ Database Tests passed');
    } catch (error) {
      this.results.failed.push('Database Tests');
      console.log('❌ Database Tests failed');
    }
  }

  /**
   * Run Stripe tests
   */
  async runStripeTests() {
    console.log('\n💳 Running Stripe Tests...');

    try {
      execSync('npm run test:stripe', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Stripe Tests');
      console.log('✅ Stripe Tests passed');
    } catch (error) {
      this.results.failed.push('Stripe Tests');
      console.log('❌ Stripe Tests failed');
    }
  }

  /**
   * Run PWA tests
   */
  async runPWATests() {
    console.log('\n📱 Running PWA Tests...');

    try {
      execSync('npm run test:pwa', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('PWA Tests');
      console.log('✅ PWA Tests passed');
    } catch (error) {
      this.results.failed.push('PWA Tests');
      console.log('❌ PWA Tests failed');
    }
  }

  /**
   * Run component tests
   */
  async runComponentTests() {
    console.log('\n🧩 Running Component Tests...');

    try {
      execSync('npm run test:components', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Component Tests');
      console.log('✅ Component Tests passed');
    } catch (error) {
      this.results.failed.push('Component Tests');
      console.log('❌ Component Tests failed');
    }
  }

  /**
   * Run realtime tests
   */
  async runRealtimeTests() {
    console.log('\n⚡ Running Realtime Tests...');

    try {
      execSync('npm run test:realtime', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Realtime Tests');
      console.log('✅ Realtime Tests passed');
    } catch (error) {
      this.results.failed.push('Realtime Tests');
      console.log('❌ Realtime Tests failed');
    }
  }

  /**
   * Run bundle size tests
   */
  async runBundleSizeTests() {
    console.log('\n📦 Running Bundle Size Tests...');

    try {
      execSync('npm run test:bundle', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Bundle Size Tests');
      console.log('✅ Bundle Size Tests passed');
    } catch (error) {
      this.results.failed.push('Bundle Size Tests');
      console.log('❌ Bundle Size Tests failed');
    }
  }

  /**
   * Run production tests
   */
  async runProductionTests() {
    console.log('\n🚀 Running Production Tests...');

    try {
      execSync('npm run test:production', { stdio: 'pipe', cwd: this.projectRoot });
      this.results.passed.push('Production Tests');
      console.log('✅ Production Tests passed');
    } catch (error) {
      this.results.failed.push('Production Tests');
      console.log('❌ Production Tests failed');
    }
  }

  /**
   * Generate final report
   */
  generateFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE VALIDATION REPORT');
    console.log('='.repeat(60));

    console.log(`\n✅ Passed: ${this.results.passed.length}`);
    this.results.passed.forEach(test => console.log(`   ✓ ${test}`));

    if (this.results.failed.length > 0) {
      console.log(`\n❌ Failed: ${this.results.failed.length}`);
      this.results.failed.forEach(test => console.log(`   ❌ ${test}`));
    }

    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  Warnings: ${this.results.warnings.length}`);
      this.results.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
    }

    const totalTests = this.results.passed.length + this.results.failed.length;
    const successRate = totalTests > 0 ? (this.results.passed.length / totalTests * 100).toFixed(1) : 0;

    console.log(`\n📈 Success Rate: ${successRate}%`);
    console.log(`🔄 Total Attempts: ${this.results.retries + 1}`);

    // Save report to file
    const reportPath = path.join(this.projectRoot, '.next/codemaps', 'validation-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      successRate: parseFloat(successRate),
      totalTests,
      status: this.results.failed.length === 0 ? 'PASSED' : 'FAILED'
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📁 Report saved to: ${reportPath}`);
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run validator
if (require.main === module) {
  const validator = new ComprehensiveValidator();
  validator.validate().catch(error => {
    console.error('❌ Comprehensive validation failed:', error);
    process.exit(1);
  });
}

module.exports = ComprehensiveValidator;
