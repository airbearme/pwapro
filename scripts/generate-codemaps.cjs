#!/usr/bin/env node

/**
 * CodeMaps Generation Script
 * Generates comprehensive source maps for better debugging and development experience
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const CODEMAPS_CONFIG = {
  enabled: true,
  sourceMaps: true,
  inlineSources: true,
  exclude: ["node_modules/**", ".next/**", "out/**", "coverage/**", "dist/**"],
  include: [
    "app/**/*.{ts,tsx,js,jsx}",
    "components/**/*.{ts,tsx,js,jsx}",
    "lib/**/*.{ts,tsx,js,jsx}",
    "hooks/**/*.{ts,tsx,js,jsx}",
    "utils/**/*.{ts,tsx,js,jsx}",
  ],
  outputDir: ".next/codemaps",
  publicPath: "/_next/codemaps",
  devtool: "source-map",
};

class CodeMapsGenerator {
  constructor() {
    this.config = CODEMAPS_CONFIG;
    this.projectRoot = process.cwd();
    this.outputDir = path.join(this.projectRoot, this.config.outputDir);
  }

  /**
   * Generate comprehensive code maps
   */
  async generate() {
    console.log("🗺️  Generating CodeMaps...\n");

    try {
      // Ensure output directory exists
      this.ensureOutputDir();

      // Clean previous codemaps
      await this.cleanPreviousMaps();

      // Generate source maps for Next.js build
      await this.generateNextSourceMaps();

      // Generate component maps
      await this.generateComponentMaps();

      // Generate API route maps
      await this.generateApiMaps();

      // Generate utility maps
      await this.generateUtilityMaps();

      // Create code map index
      await this.createCodeMapIndex();

      // Validate generated maps
      await this.validateCodeMaps();

      console.log("✅ CodeMaps generated successfully!");
      console.log(`📁 Output directory: ${this.outputDir}`);
      console.log(`🌐 Public path: ${this.config.publicPath}`);
    } catch (error) {
      console.error("❌ Error generating CodeMaps:", error.message);
      process.exit(1);
    }
  }

  /**
   * Ensure output directory exists
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDir}`);
    }
  }

  /**
   * Clean previous code maps
   */
  async cleanPreviousMaps() {
    try {
      if (fs.existsSync(this.outputDir)) {
        fs.rmSync(this.outputDir, { recursive: true, force: true });
        fs.mkdirSync(this.outputDir, { recursive: true });
        console.log("🧹 Cleaned previous CodeMaps");
      }
    } catch (error) {
      console.warn(
        "⚠️  Warning: Could not clean previous maps:",
        error.message
      );
    }
  }

  /**
   * Generate Next.js source maps
   */
  async generateNextSourceMaps() {
    console.log("📦 Generating Next.js source maps...");

    try {
      // Build with source maps enabled
      console.log("🔨 Running: NODE_ENV=production npm run build");
      execSync("NODE_ENV=production npm run build", {
        stdio: "inherit",
        cwd: this.projectRoot,
        env: {
          ...process.env,
          NODE_ENV: "production",
          NEXT_SOURCEMAPS: "true",
          GENERATE_SOURCEMAP: "true",
        },
      });

      // Copy source maps to codemaps directory
      const nextBuildDir = path.join(this.projectRoot, ".next");
      if (fs.existsSync(nextBuildDir)) {
        this.copySourceMaps(nextBuildDir);
      }

      console.log("✅ Next.js source maps generated");
    } catch (error) {
      console.error("❌ Error generating Next.js source maps:", error.message);
      throw error;
    }
  }

  /**
   * Copy source maps to codemaps directory
   */
  copySourceMaps(buildDir) {
    const sourceMapFiles = this.findSourceMapFiles(buildDir);

    sourceMapFiles.forEach((file) => {
      const relativePath = path.relative(buildDir, file);
      const targetPath = path.join(this.outputDir, relativePath);

      // Ensure target directory exists
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Copy file
      fs.copyFileSync(file, targetPath);
    });

    console.log(`📋 Copied ${sourceMapFiles.length} source map files`);
  }

  /**
   * Find all source map files recursively
   */
  findSourceMapFiles(dir) {
    const files = [];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          walk(itemPath);
        } else if (item.endsWith(".map")) {
          files.push(itemPath);
        }
      });
    };

    walk(dir);
    return files;
  }

  /**
   * Generate component maps
   */
  async generateComponentMaps() {
    console.log("🧩 Generating component maps...");

    const componentsDir = path.join(this.projectRoot, "components");
    if (!fs.existsSync(componentsDir)) {
      console.log("⚠️  Components directory not found, skipping...");
      return;
    }

    const componentFiles = this.findComponentFiles(componentsDir);
    const componentMap = {
      version: "1.0.0",
      generated: new Date().toISOString(),
      components: [],
    };

    componentFiles.forEach((file) => {
      const relativePath = path.relative(this.projectRoot, file);
      const componentName = path.basename(file, path.extname(file));

      componentMap.components.push({
        name: componentName,
        path: relativePath,
        type: this.getComponentType(file),
        size: fs.statSync(file).size,
        lastModified: fs.statSync(file).mtime.toISOString(),
      });
    });

    // Write component map
    const componentMapPath = path.join(this.outputDir, "components.json");
    fs.writeFileSync(componentMapPath, JSON.stringify(componentMap, null, 2));

    console.log(`✅ Generated map for ${componentFiles.length} components`);
  }

  /**
   * Find all component files
   */
  findComponentFiles(dir) {
    const files = [];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          walk(itemPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          files.push(itemPath);
        }
      });
    };

    walk(dir);
    return files;
  }

  /**
   * Get component type based on file path
   */
  getComponentType(filePath) {
    if (filePath.includes("ui/")) return "ui";
    if (filePath.includes("forms/")) return "form";
    if (filePath.includes("layout/")) return "layout";
    if (filePath.includes("map/")) return "map";
    return "component";
  }

  /**
   * Generate API route maps
   */
  async generateApiMaps() {
    console.log("🔌 Generating API route maps...");

    const apiDir = path.join(this.projectRoot, "app", "api");
    if (!fs.existsSync(apiDir)) {
      console.log("⚠️  API directory not found, skipping...");
      return;
    }

    const apiFiles = this.findApiFiles(apiDir);
    const apiMap = {
      version: "1.0.0",
      generated: new Date().toISOString(),
      routes: [],
    };

    apiFiles.forEach((file) => {
      const relativePath = path.relative(this.projectRoot, file);
      const routePath = this.extractRoutePath(file);

      apiMap.routes.push({
        path: routePath,
        file: relativePath,
        method: this.extractHttpMethod(file),
        size: fs.statSync(file).size,
        lastModified: fs.statSync(file).mtime.toISOString(),
      });
    });

    // Write API map
    const apiMapPath = path.join(this.outputDir, "api-routes.json");
    fs.writeFileSync(apiMapPath, JSON.stringify(apiMap, null, 2));

    console.log(`✅ Generated map for ${apiFiles.length} API routes`);
  }

  /**
   * Find all API files
   */
  findApiFiles(dir) {
    const files = [];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          walk(itemPath);
        } else if (item === "route.ts" || item === "route.js") {
          files.push(itemPath);
        }
      });
    };

    walk(dir);
    return files;
  }

  /**
   * Extract route path from file path
   */
  extractRoutePath(filePath) {
    const relativePath = path.relative(
      path.join(this.projectRoot, "app", "api"),
      filePath
    );
    const dirPath = path.dirname(relativePath);
    return `/api/${dirPath.replace(/\\/g, "/")}`;
  }

  /**
   * Extract HTTP method from file content
   */
  extractHttpMethod(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      if (content.includes("export async function GET")) return "GET";
      if (content.includes("export async function POST")) return "POST";
      if (content.includes("export async function PUT")) return "PUT";
      if (content.includes("export async function DELETE")) return "DELETE";
      if (content.includes("export async function PATCH")) return "PATCH";
      return "UNKNOWN";
    } catch {
      return "UNKNOWN";
    }
  }

  /**
   * Generate utility maps
   */
  async generateUtilityMaps() {
    console.log("🛠️  Generating utility maps...");

    const utilsDir = path.join(this.projectRoot, "lib");
    if (!fs.existsSync(utilsDir)) {
      console.log("⚠️  Lib directory not found, skipping...");
      return;
    }

    const utilFiles = this.findUtilFiles(utilsDir);
    const utilMap = {
      version: "1.0.0",
      generated: new Date().toISOString(),
      utilities: [],
    };

    utilFiles.forEach((file) => {
      const relativePath = path.relative(this.projectRoot, file);
      const utilName = path.basename(file, path.extname(file));

      utilMap.utilities.push({
        name: utilName,
        path: relativePath,
        type: this.getUtilType(file),
        size: fs.statSync(file).size,
        lastModified: fs.statSync(file).mtime.toISOString(),
      });
    });

    // Write utility map
    const utilMapPath = path.join(this.outputDir, "utilities.json");
    fs.writeFileSync(utilMapPath, JSON.stringify(utilMap, null, 2));

    console.log(`✅ Generated map for ${utilFiles.length} utilities`);
  }

  /**
   * Find all utility files
   */
  findUtilFiles(dir) {
    const files = [];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      items.forEach((item) => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          walk(itemPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          files.push(itemPath);
        }
      });
    };

    walk(dir);
    return files;
  }

  /**
   * Get utility type based on file path
   */
  getUtilType(filePath) {
    if (filePath.includes("supabase")) return "database";
    if (filePath.includes("auth")) return "authentication";
    if (filePath.includes("stripe")) return "payment";
    if (filePath.includes("utils")) return "utility";
    return "library";
  }

  /**
   * Create comprehensive code map index
   */
  async createCodeMapIndex() {
    console.log("📋 Creating code map index...");

    const index = {
      version: "1.0.0",
      generated: new Date().toISOString(),
      project: "airbear-pwa",
      config: this.config,
      maps: {
        components: "components.json",
        api: "api-routes.json",
        utilities: "utilities.json",
        sourceMaps: "sourcemaps/",
      },
      stats: {
        totalFiles: 0,
        totalSize: 0,
        lastGenerated: new Date().toISOString(),
      },
    };

    // Calculate stats
    try {
      const files = fs.readdirSync(this.outputDir, { withFileTypes: true });
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(this.outputDir, file.name);
          const stat = fs.statSync(filePath);
          index.stats.totalFiles++;
          index.stats.totalSize += stat.size;
        }
      });
    } catch (error) {
      console.warn("⚠️  Could not calculate stats:", error.message);
    }

    // Write index
    const indexPath = path.join(this.outputDir, "index.json");
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    console.log("✅ Code map index created");
  }

  /**
   * Validate generated code maps
   */
  async validateCodeMaps() {
    console.log("✅ Validating generated CodeMaps...");

    const indexPath = path.join(this.outputDir, "index.json");
    if (!fs.existsSync(indexPath)) {
      throw new Error("Code map index not found");
    }

    try {
      const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

      // Validate structure
      if (!index.version || !index.maps) {
        throw new Error("Invalid code map structure");
      }

      // Validate individual maps
      for (const [mapType, mapFile] of Object.entries(index.maps)) {
        const mapPath = path.join(this.outputDir, mapFile);
        if (typeof mapFile === "string" && !fs.existsSync(mapPath)) {
          console.warn(`⚠️  Map file not found: ${mapFile}`);
        }
      }

      console.log("✅ CodeMaps validation passed");
    } catch (error) {
      throw new Error(`CodeMaps validation failed: ${error.message}`);
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new CodeMapsGenerator();
  generator.generate().catch((error) => {
    console.error("❌ CodeMaps generation failed:", error);
    process.exit(1);
  });
}

module.exports = CodeMapsGenerator;
