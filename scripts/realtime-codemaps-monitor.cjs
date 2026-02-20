#!/usr/bin/env node

/**
 * Real-time CodeMaps Monitor
 * Monitors codebase changes and updates CodeMaps automatically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RealTimeCodeMapsMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.outputDir = path.join(this.projectRoot, '.next/codemaps');
    this.watchedDirs = [
      'app',
      'components',
      'lib',
      'hooks',
      'utils'
    ];
    this.watchers = [];
    this.debounceTime = 1000; // 1 second debounce
    this.pendingUpdates = new Map();
    this.isUpdating = false;
  }

  /**
   * Start real-time monitoring
   */
  async start() {
    console.log('👁️  Starting Real-time CodeMaps Monitor...\n');

    try {
      // Ensure output directory exists
      this.ensureOutputDir();

      // Load existing CodeMaps
      await this.loadExistingCodeMaps();

      // Setup file watchers
      this.setupWatchers();

      // Setup monitoring dashboard
      this.setupMonitoringDashboard();

      // Start monitoring loop
      this.startMonitoringLoop();

      console.log('✅ Real-time CodeMaps Monitor started!');
      console.log('📁 Watching directories:', this.watchedDirs.join(', '));
      console.log('🔄 Auto-update enabled with 1s debounce');

    } catch (error) {
      console.error('❌ Failed to start monitor:', error.message);
      process.exit(1);
    }
  }

  /**
   * Ensure output directory exists
   */
  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Load existing CodeMaps
   */
  async loadExistingCodeMaps() {
    console.log('📋 Loading existing CodeMaps...');

    const indexPath = path.join(this.outputDir, 'index.json');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      this.existingCodeMaps = JSON.parse(content);
      console.log('✅ Existing CodeMaps loaded');
    } else {
      this.existingCodeMaps = { components: [], api: [], utilities: [] };
      console.log('⚠️  No existing CodeMaps found, will create new ones');
    }
  }

  /**
   * Setup file watchers
   */
  setupWatchers() {
    console.log('👀 Setting up file watchers...');

    for (const dir of this.watchedDirs) {
      const dirPath = path.join(this.projectRoot, dir);

      if (fs.existsSync(dirPath)) {
        const watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
          this.handleFileChange(dir, eventType, filename);
        });

        this.watchers.push(watcher);
        console.log(`✅ Watching: ${dir}`);
      } else {
        console.log(`⚠️  Directory not found: ${dir}`);
      }
    }
  }

  /**
   * Handle file changes
   */
  handleFileChange(dir, eventType, filename) {
    if (!filename) return;

    const fullPath = path.join(dir, filename);
    const fileExt = path.extname(filename);

    // Only watch relevant file types
    if (!['.ts', '.tsx', '.js', 'jsx'].includes(fileExt)) {
      return;
    }

    console.log(`📝 File changed: ${fullPath} (${eventType})`);

    // Debounce updates
    const key = fullPath;
    if (this.pendingUpdates.has(key)) {
      clearTimeout(this.pendingUpdates.get(key));
    }

    const timeout = setTimeout(() => {
      this.queueUpdate(dir, fullPath, eventType);
      this.pendingUpdates.delete(key);
    }, this.debounceTime);

    this.pendingUpdates.set(key, timeout);
  }

  /**
   * Queue update for CodeMaps
   */
  queueUpdate(dir, fullPath, eventType) {
    const update = {
      dir,
      fullPath,
      eventType,
      timestamp: Date.now()
    };

    // Add to pending updates
    if (!this.pendingCodeMapUpdates) {
      this.pendingCodeMapUpdates = [];
    }
    this.pendingCodeMapUpdates.push(update);
  }

  /**
   * Start monitoring loop
   */
  startMonitoringLoop() {
    console.log('🔄 Starting monitoring loop...');

    setInterval(() => {
      this.processPendingUpdates();
    }, 2000); // Process every 2 seconds

    // Generate initial report
    setTimeout(() => {
      this.generateMonitoringReport();
    }, 5000);
  }

  /**
   * Process pending updates
   */
  async processPendingUpdates() {
    if (!this.pendingCodeMapUpdates || this.pendingCodeMapUpdates.length === 0) {
      return;
    }

    if (this.isUpdating) {
      console.log('⏳ Update in progress, skipping...');
      return;
    }

    this.isUpdating = true;
    const updates = [...this.pendingCodeMapUpdates];
    this.pendingCodeMapUpdates = [];

    try {
      console.log(`🔄 Processing ${updates.length} file changes...`);

      // Update relevant CodeMaps
      await this.updateCodeMaps(updates);

      // Generate updated report
      await this.generateMonitoringReport();

      console.log('✅ CodeMaps updated successfully');

    } catch (error) {
      console.error('❌ Failed to update CodeMaps:', error.message);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Update CodeMaps based on file changes
   */
  async updateCodeMaps(updates) {
    const changedDirs = new Set(updates.map(u => u.dir));

    for (const dir of changedDirs) {
      if (dir === 'components') {
        await this.updateComponentsMap();
      } else if (dir === 'app') {
        await this.updateApiMap();
      } else if (dir === 'lib' || dir === 'utils' || dir === 'hooks') {
        await this.updateUtilitiesMap();
      }
    }

    // Update main index
    await this.updateMainIndex();
  }

  /**
   * Update components map
   */
  async updateComponentsMap() {
    const componentsDir = path.join(this.projectRoot, 'components');
    const componentFiles = this.findComponentFiles(componentsDir);

    const componentsMap = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      components: []
    };

    componentFiles.forEach(file => {
      const relativePath = path.relative(this.projectRoot, file);
      const componentName = path.basename(file, path.extname(file));

      componentsMap.components.push({
        name: componentName,
        path: relativePath,
        type: this.getComponentType(file),
        size: fs.statSync(file).size,
        lastModified: fs.statSync(file).mtime.toISOString(),
        lastAnalyzed: new Date().toISOString()
      });
    });

    const componentsPath = path.join(this.outputDir, 'components.json');
    fs.writeFileSync(componentsPath, JSON.stringify(componentsMap, null, 2));

    console.log(`🧩 Updated components map: ${componentFiles.length} components`);
  }

  /**
   * Update API routes map
   */
  async updateApiMap() {
    const apiDir = path.join(this.projectRoot, 'app', 'api');
    const apiFiles = this.findApiFiles(apiDir);

    const apiMap = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      routes: []
    };

    apiFiles.forEach(file => {
      const relativePath = path.relative(this.projectRoot, file);
      const routePath = this.extractRoutePath(file);

      apiMap.routes.push({
        path: routePath,
        file: relativePath,
        method: this.extractHttpMethod(file),
        size: fs.statSync(file).size,
        lastModified: fs.statSync(file).mtime.toISOString(),
        lastAnalyzed: new Date().toISOString()
      });
    });

    const apiPath = path.join(this.outputDir, 'api-routes.json');
    fs.writeFileSync(apiPath, JSON.stringify(apiMap, null, 2));

    console.log(`🔌 Updated API routes map: ${apiFiles.length} routes`);
  }

  /**
   * Update utilities map
   */
  async updateUtilitiesMap() {
    const utilDirs = ['lib', 'utils', 'hooks'].map(dir => path.join(this.projectRoot, dir));
    const utilFiles = [];

    utilDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        utilFiles.push(...this.findUtilFiles(dir));
      }
    });

    const utilMap = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      utilities: []
    };

    utilFiles.forEach(file => {
      const relativePath = path.relative(this.projectRoot, file);
      const utilName = path.basename(file, path.extname(file));

      utilMap.utilities.push({
        name: utilName,
        path: relativePath,
        type: this.getUtilType(file),
        size: fs.statSync(file).size,
        lastModified: fs.statSync(file).mtime.toISOString(),
        lastAnalyzed: new Date().toISOString()
      });
    });

    const utilPath = path.join(this.outputDir, 'utilities.json');
    fs.writeFileSync(utilPath, JSON.stringify(utilMap, null, 2));

    console.log(`🛠️  Updated utilities map: ${utilFiles.length} utilities`);
  }

  /**
   * Update main index
   */
  async updateMainIndex() {
    const index = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      project: 'airbear-pwa',
      monitoring: {
        enabled: true,
        autoUpdate: true,
        debounceTime: this.debounceTime,
        watchedDirs: this.watchedDirs
      },
      maps: {
        components: 'components.json',
        api: 'api-routes.json',
        utilities: 'utilities.json'
      },
      stats: this.calculateStats()
    };

    const indexPath = path.join(this.outputDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }

  /**
   * Calculate current stats
   */
  calculateStats() {
    const componentsPath = path.join(this.outputDir, 'components.json');
    const apiPath = path.join(this.outputDir, 'api-routes.json');
    const utilPath = path.join(this.outputDir, 'utilities.json');

    let stats = {
      totalFiles: 0,
      totalSize: 0,
      lastUpdated: new Date().toISOString()
    };

    try {
      [componentsPath, apiPath, utilPath].forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          stats.totalFiles++;
          stats.totalSize += stat.size;
        }
      });
    } catch (error) {
      // Ignore errors
    }

    return stats;
  }

  /**
   * Setup monitoring dashboard
   */
  setupMonitoringDashboard() {
    console.log('📊 Setting up monitoring dashboard...');

    const dashboardPath = path.join(this.outputDir, 'dashboard.html');
    const dashboard = this.generateDashboardHTML();

    fs.writeFileSync(dashboardPath, dashboard);
    console.log(`✅ Dashboard created: ${dashboardPath}`);
  }

  /**
   * Generate dashboard HTML
   */
  generateDashboardHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMaps Monitor - AirBear PWA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>
</head>
<body class="bg-gray-900 text-white p-6">
    <div class="max-w-6xl mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-emerald-400 mb-2">🗺️ CodeMaps Monitor</h1>
            <p class="text-gray-400">Real-time monitoring of AirBear PWA codebase</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-emerald-400 mb-4">📁 Status</h2>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Monitor:</span>
                        <span class="text-green-400 animate-pulse">Active</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Auto-update:</span>
                        <span class="text-green-400">Enabled</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Debounce:</span>
                        <span>${this.debounceTime}ms</span>
                    </div>
                </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-blue-400 mb-4">📊 Statistics</h2>
                <div id="stats" class="space-y-2">
                    <div class="animate-pulse">Loading...</div>
                </div>
            </div>

            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-purple-400 mb-4">🔄 Recent Changes</h2>
                <div id="changes" class="space-y-2 text-sm">
                    <div class="animate-pulse">Monitoring...</div>
                </div>
            </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-orange-400 mb-4">📁 Watched Directories</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                ${this.watchedDirs.map(dir =>
                    `<div class="bg-gray-700 rounded p-3 text-center">
                        <div class="text-2xl mb-2">📁</div>
                        <div class="text-sm">${dir}</div>
                    </div>`
                ).join('')}
            </div>
        </div>
    </div>

    <script>
        let lastUpdate = Date.now();
        
        function updateStats() {
            fetch('/_next/codemaps/index.json')
                .then(response => response.json())
                .then(data => {
                    const statsDiv = document.getElementById('stats');
                    statsDiv.innerHTML = \`
                        <div class="flex justify-between">
                            <span>Components:</span>
                            <span class="text-blue-400">\${data.stats?.totalFiles || 0}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Last Updated:</span>
                            <span class="text-green-400">\${new Date(data.lastUpdated).toLocaleTimeString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Monitor Uptime:</span>
                            <span class="text-yellow-400">\${Math.floor((Date.now() - lastUpdate) / 1000 / 60)}m</span>
                        </div>
                    \`;
                })
                .catch(error => {
                    console.error('Failed to fetch stats:', error);
                });
        }

        function updateChanges() {
            const changesDiv = document.getElementById('changes');
            const now = new Date().toLocaleTimeString();
            changesDiv.innerHTML = \`
                <div class="text-gray-400">Last check: \${now}</div>
                <div class="text-green-400">✅ Monitoring active</div>
                <div class="text-blue-400">🔄 Auto-updates enabled</div>
            \`;
        }

        // Initial update
        updateStats();
        updateChanges();

        // Update every 5 seconds
        setInterval(() => {
            updateStats();
            updateChanges();
        }, 5000);
    </script>
</body>
</html>`;
  }

  /**
   * Generate monitoring report
   */
  async generateMonitoringReport() {
    const report = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      watchers: this.watchers.length,
      watchedDirs: this.watchedDirs,
      pendingUpdates: this.pendingCodeMapUpdates?.length || 0,
      lastUpdate: new Date().toISOString(),
      status: this.isUpdating ? 'updating' : 'idle'
    };

    const reportPath = path.join(this.outputDir, 'monitoring-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  }

  /**
   * Helper methods (reused from previous scripts)
   */
  findComponentFiles(dir) {
    const files = [];
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            walk(itemPath);
          } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
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

  findApiFiles(dir) {
    const files = [];
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            walk(itemPath);
          } else if (item === 'route.ts' || item === 'route.js') {
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

  findUtilFiles(dir) {
    const files = [];
    const walk = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const itemPath = path.join(currentDir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            walk(itemPath);
          } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
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

  getComponentType(filePath) {
    if (filePath.includes('ui/')) return 'ui';
    if (filePath.includes('forms/')) return 'form';
    if (filePath.includes('layout/')) return 'layout';
    if (filePath.includes('map/')) return 'map';
    return 'component';
  }

  extractRoutePath(filePath) {
    const relativePath = path.relative(path.join(this.projectRoot, 'app', 'api'), filePath);
    const dirPath = path.dirname(relativePath);
    return `/api/${dirPath.replace(/\\/g, '/')}`;
  }

  extractHttpMethod(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('export async function GET')) return 'GET';
      if (content.includes('export async function POST')) return 'POST';
      if (content.includes('export async function PUT')) return 'PUT';
      if (content.includes('export async function DELETE')) return 'DELETE';
      if (content.includes('export async function PATCH')) return 'PATCH';
      return 'UNKNOWN';
    } catch {
      return 'UNKNOWN';
    }
  }

  getUtilType(filePath) {
    if (filePath.includes('supabase')) return 'database';
    if (filePath.includes('auth')) return 'authentication';
    if (filePath.includes('stripe')) return 'payment';
    if (filePath.includes('utils')) return 'utility';
    return 'library';
  }

  /**
   * Stop monitoring
   */
  stop() {
    console.log('🛑 Stopping CodeMaps Monitor...');

    // Close all watchers
    this.watchers.forEach(watcher => {
      watcher.close();
    });

    // Clear pending updates
    this.pendingUpdates.forEach(timeout => {
      clearTimeout(timeout);
    });

    console.log('✅ CodeMaps Monitor stopped');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, stopping monitor...');
  if (global.monitor) {
    global.monitor.stop();
    process.exit(0);
  }
});

// Start monitor
if (require.main === module) {
  const monitor = new RealTimeCodeMapsMonitor();
  global.monitor = monitor;
  monitor.startTime = Date.now();
  monitor.start().catch(error => {
    console.error('❌ Failed to start monitor:', error);
    process.exit(1);
  });
}

module.exports = RealTimeCodeMapsMonitor;
