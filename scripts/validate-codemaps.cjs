#!/usr/bin/env node

/**
 * CodeMaps Validation Script
 * Validates generated source maps and code mappings for integrity
 */

const fs = require("fs");
const path = require("path");

// Configuration
const VALIDATION_CONFIG = {
  outputDir: ".next/codemaps",
  requiredMaps: [
    "index.json",
    "components.json",
    "api-routes.json",
    "utilities.json",
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedExtensions: [".json", ".map"],
  checkSourceMapIntegrity: true,
  checkFileReferences: true,
};

class CodeMapsValidator {
  constructor() {
    this.config = VALIDATION_CONFIG;
    this.projectRoot = process.cwd();
    this.outputDir = path.join(this.projectRoot, this.config.outputDir);
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate all CodeMaps
   */
  async validate() {
    console.log("🔍 Validating CodeMaps...\n");

    try {
      // Check if output directory exists
      await this.checkOutputDirectory();

      // Validate required files exist
      await this.validateRequiredFiles();

      // Validate JSON structure
      await this.validateJsonStructure();

      // Validate source map integrity
      if (this.config.checkSourceMapIntegrity) {
        await this.validateSourceMapIntegrity();
      }

      // Validate file references
      if (this.config.checkFileReferences) {
        await this.validateFileReferences();
      }

      // Validate file sizes
      await this.validateFileSizes();

      // Generate validation report
      await this.generateValidationReport();

      // Output results
      this.outputResults();
    } catch (error) {
      console.error("❌ CodeMaps validation failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Check if output directory exists
   */
  async checkOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      this.errors.push("CodeMaps output directory does not exist");
      return;
    }

    const stats = fs.statSync(this.outputDir);
    if (!stats.isDirectory()) {
      this.errors.push("CodeMaps output path is not a directory");
    }

    console.log("✅ Output directory exists");
  }

  /**
   * Validate required files exist
   */
  async validateRequiredFiles() {
    for (const requiredFile of this.config.requiredMaps) {
      const filePath = path.join(this.outputDir, requiredFile);

      if (!fs.existsSync(filePath)) {
        this.errors.push(`Required file missing: ${requiredFile}`);
      } else {
        console.log(`✅ Required file exists: ${requiredFile}`);
      }
    }
  }

  /**
   * Validate JSON structure
   */
  async validateJsonStructure() {
    const jsonFiles = this.findJsonFiles();

    for (const jsonFile of jsonFiles) {
      try {
        const filePath = path.join(this.outputDir, jsonFile);
        const content = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(content);

        // Validate basic structure
        if (jsonFile === "index.json") {
          this.validateIndexStructure(parsed);
        } else if (jsonFile === "components.json") {
          this.validateComponentsStructure(parsed);
        } else if (jsonFile === "api-routes.json") {
          this.validateApiRoutesStructure(parsed);
        } else if (jsonFile === "utilities.json") {
          this.validateUtilitiesStructure(parsed);
        }

        console.log(`✅ Valid JSON structure: ${jsonFile}`);
      } catch (error) {
        this.errors.push(`Invalid JSON in ${jsonFile}: ${error.message}`);
      }
    }
  }

  /**
   * Find all JSON files
   */
  findJsonFiles() {
    const files = [];

    try {
      const items = fs.readdirSync(this.outputDir);
      items.forEach((item) => {
        if (item.endsWith(".json")) {
          files.push(item);
        }
      });
    } catch (error) {
      this.errors.push(`Could not read output directory: ${error.message}`);
    }

    return files;
  }

  /**
   * Validate index.json structure
   */
  validateIndexStructure(index) {
    const required = ["version", "generated", "project", "maps", "stats"];

    for (const field of required) {
      if (!index[field]) {
        this.errors.push(`Index missing required field: ${field}`);
      }
    }

    if (index.maps && typeof index.maps !== "object") {
      this.errors.push("Index maps field must be an object");
    }

    if (index.stats && typeof index.stats !== "object") {
      this.errors.push("Index stats field must be an object");
    }
  }

  /**
   * Validate components.json structure
   */
  validateComponentsStructure(components) {
    const required = ["version", "generated", "components"];

    for (const field of required) {
      if (!components[field]) {
        this.errors.push(`Components missing required field: ${field}`);
      }
    }

    if (components.components && Array.isArray(components.components)) {
      components.components.forEach((component, index) => {
        if (!component.name) {
          this.errors.push(`Component ${index} missing name`);
        }
        if (!component.path) {
          this.errors.push(`Component ${index} missing path`);
        }
      });
    }
  }

  /**
   * Validate api-routes.json structure
   */
  validateApiRoutesStructure(apiRoutes) {
    const required = ["version", "generated", "routes"];

    for (const field of required) {
      if (!apiRoutes[field]) {
        this.errors.push(`API routes missing required field: ${field}`);
      }
    }

    if (apiRoutes.routes && Array.isArray(apiRoutes.routes)) {
      apiRoutes.routes.forEach((route, index) => {
        if (!route.path) {
          this.errors.push(`API route ${index} missing path`);
        }
        if (!route.file) {
          this.errors.push(`API route ${index} missing file`);
        }
      });
    }
  }

  /**
   * Validate utilities.json structure
   */
  validateUtilitiesStructure(utilities) {
    const required = ["version", "generated", "utilities"];

    for (const field of required) {
      if (!utilities[field]) {
        this.errors.push(`Utilities missing required field: ${field}`);
      }
    }

    if (utilities.utilities && Array.isArray(utilities.utilities)) {
      utilities.utilities.forEach((utility, index) => {
        if (!utility.name) {
          this.errors.push(`Utility ${index} missing name`);
        }
        if (!utility.path) {
          this.errors.push(`Utility ${index} missing path`);
        }
      });
    }
  }

  /**
   * Validate source map integrity
   */
  async validateSourceMapIntegrity() {
    const sourceMapFiles = this.findSourceMapFiles();
    const ignoredPrefixes = ["webpack://", "node:", "external "];

    for (const sourceMapFile of sourceMapFiles) {
      try {
        const filePath = path.join(this.outputDir, sourceMapFile);
        const content = fs.readFileSync(filePath, "utf8");
        const sourceMap = JSON.parse(content);

        // Validate source map structure
        if (!sourceMap.version) {
          this.warnings.push(`Source map ${sourceMapFile} missing version`);
        }

        if (!sourceMap.sources || !Array.isArray(sourceMap.sources)) {
          this.errors.push(`Source map ${sourceMapFile} has invalid sources`);
        }

        if (!sourceMap.mappings) {
          this.warnings.push(`Source map ${sourceMapFile} missing mappings`);
        }

        // Check if sources exist
        if (sourceMap.sources) {
          for (const source of sourceMap.sources) {
            if (
              source &&
              !source.startsWith("http") &&
              !ignoredPrefixes.some((prefix) => source.startsWith(prefix))
            ) {
              const sourcePath = path.resolve(this.projectRoot, source);
              if (!fs.existsSync(sourcePath)) {
                this.warnings.push(`Source file not found: ${source}`);
              }
            }
          }
        }

        console.log(`✅ Validated source map: ${sourceMapFile}`);
      } catch (error) {
        this.errors.push(
          `Invalid source map ${sourceMapFile}: ${error.message}`
        );
      }
    }
  }

  /**
   * Find all source map files
   */
  findSourceMapFiles() {
    const files = [];

    try {
      const walk = (currentDir) => {
        const items = fs.readdirSync(currentDir);

        items.forEach((item) => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);

          if (stat.isDirectory()) {
            walk(itemPath);
          } else if (item.endsWith(".map")) {
            files.push(path.relative(this.outputDir, itemPath));
          }
        });
      };

      walk(this.outputDir);
    } catch (error) {
      this.errors.push(`Could not find source map files: ${error.message}`);
    }

    return files;
  }

  /**
   * Validate file references
   */
  async validateFileReferences() {
    const indexPath = path.join(this.outputDir, "index.json");

    if (!fs.existsSync(indexPath)) {
      return;
    }

    try {
      const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

      // Validate component references
      if (index.maps.components) {
        const componentsPath = path.join(this.outputDir, index.maps.components);
        if (!fs.existsSync(componentsPath)) {
          this.errors.push(
            `Components map not found: ${index.maps.components}`
          );
        }
      }

      // Validate API references
      if (index.maps.api) {
        const apiPath = path.join(this.outputDir, index.maps.api);
        if (!fs.existsSync(apiPath)) {
          this.errors.push(`API map not found: ${index.maps.api}`);
        }
      }

      // Validate utility references
      if (index.maps.utilities) {
        const utilitiesPath = path.join(this.outputDir, index.maps.utilities);
        if (!fs.existsSync(utilitiesPath)) {
          this.errors.push(`Utilities map not found: ${index.maps.utilities}`);
        }
      }

      console.log("✅ File references validated");
    } catch (error) {
      this.errors.push(`Could not validate file references: ${error.message}`);
    }
  }

  /**
   * Validate file sizes
   */
  async validateFileSizes() {
    try {
      const files = fs.readdirSync(this.outputDir, { withFileTypes: true });

      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(this.outputDir, file.name);
          const stats = fs.statSync(filePath);

          if (stats.size > this.config.maxFileSize) {
            this.warnings.push(
              `File ${file.name} is large: ${this.formatBytes(stats.size)}`
            );
          }
        }
      });

      console.log("✅ File sizes validated");
    } catch (error) {
      this.errors.push(`Could not validate file sizes: ${error.message}`);
    }
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Generate validation report
   */
  async generateValidationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: "airbear-pwa",
      validation: {
        errors: this.errors,
        warnings: this.warnings,
        status: this.errors.length === 0 ? "PASSED" : "FAILED",
      },
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        filesChecked: this.countFiles(),
      },
    };

    // Ensure output directory exists before writing
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Write validation report
    const reportPath = path.join(this.outputDir, "validation-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("✅ Validation report generated");
  }

  /**
   * Count files in output directory
   */
  countFiles() {
    try {
      const files = fs.readdirSync(this.outputDir, { withFileTypes: true });
      return files.filter((file) => file.isFile()).length;
    } catch {
      return 0;
    }
  }

  /**
   * Output validation results
   */
  outputResults() {
    console.log("\n📊 Validation Results:");
    console.log("=====================\n");

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log("🎉 All CodeMaps validations passed!\n");
    } else {
      if (this.errors.length > 0) {
        console.log(`❌ Errors (${this.errors.length}):`);
        this.errors.forEach((error) => console.log(`   • ${error}`));
        console.log("");
      }

      if (this.warnings.length > 0) {
        console.log(`⚠️  Warnings (${this.warnings.length}):`);
        this.warnings.forEach((warning) => console.log(`   • ${warning}`));
        console.log("");
      }
    }

    console.log(`📋 Summary:`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Status: ${this.errors.length === 0 ? "PASSED" : "FAILED"}`);

    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// Run the validator
if (require.main === module) {
  const validator = new CodeMapsValidator();
  validator.validate().catch((error) => {
    console.error("❌ CodeMaps validation failed:", error);
    process.exit(1);
  });
}

module.exports = CodeMapsValidator;
