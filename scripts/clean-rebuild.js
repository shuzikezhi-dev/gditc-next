#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CleanRebuilder {
  constructor() {
    this.projectRoot = process.cwd();
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  async cleanAll() {
    this.log('🧹 Starting complete cleanup...');
    
    try {
      // 停止 PM2 服务
      this.log('🛑 Stopping PM2 services...');
      try {
        execSync('pm2 stop all', { stdio: 'pipe' });
        execSync('pm2 delete all', { stdio: 'pipe' });
      } catch (error) {
        this.log('No PM2 services to stop', 'WARN');
      }

      // 清理构建文件
      this.log('🗑️ Removing build files...');
      const filesToRemove = [
        '.next',
        'out',
        'node_modules',
        'package-lock.json',
        'logs',
        '.cache',
        '.turbo'
      ];

      filesToRemove.forEach(file => {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
            this.log(`✅ Removed directory: ${file}`);
          } else {
            fs.unlinkSync(filePath);
            this.log(`✅ Removed file: ${file}`);
          }
        }
      });

      // 清理 npm 缓存
      this.log('🧽 Cleaning npm cache...');
      execSync('npm cache clean --force', { stdio: 'inherit' });

      // 清理 PM2 日志
      this.log('📝 Cleaning PM2 logs...');
      try {
        execSync('pm2 flush', { stdio: 'pipe' });
      } catch (error) {
        this.log('No PM2 logs to clean', 'WARN');
      }

      this.log('✅ Cleanup completed successfully');
      return true;
    } catch (error) {
      this.log(`❌ Cleanup failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async reinstall() {
    this.log('📦 Reinstalling dependencies...');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      this.log('✅ Dependencies installed successfully');
      return true;
    } catch (error) {
      this.log(`❌ Installation failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async generateSitemap() {
    this.log('🗺️ Generating sitemap...');
    
    try {
      execSync('npm run sitemap:enhanced', { stdio: 'inherit' });
      this.log('✅ Sitemap generated successfully');
      return true;
    } catch (error) {
      this.log(`❌ Sitemap generation failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async build() {
    this.log('🔨 Building project...');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      this.log('✅ Build completed successfully');
      return true;
    } catch (error) {
      this.log(`❌ Build failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async startServices() {
    this.log('🚀 Starting services...');
    
    try {
      execSync('npm run pm2:start', { stdio: 'inherit' });
      
      // 等待服务启动
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 检查服务状态
      const status = execSync('pm2 status', { encoding: 'utf8' });
      this.log('📊 PM2 Status:');
      console.log(status);
      
      this.log('✅ Services started successfully');
      return true;
    } catch (error) {
      this.log(`❌ Service startup failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async verifyBuild() {
    this.log('🔍 Verifying build...');
    
    try {
      const outDir = path.join(this.projectRoot, 'out');
      
      if (!fs.existsSync(outDir)) {
        throw new Error('out directory does not exist');
      }

      const requiredFiles = ['index.html', 'sitemap.xml', 'robots.txt'];
      const missingFiles = [];

      requiredFiles.forEach(file => {
        const filePath = path.join(outDir, file);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(file);
        }
      });

      if (missingFiles.length > 0) {
        throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
      }

      // 检查文件大小
      const indexHtmlPath = path.join(outDir, 'index.html');
      const stats = fs.statSync(indexHtmlPath);
      
      if (stats.size < 1000) {
        throw new Error('index.html seems too small, build might have failed');
      }

      this.log('✅ Build verification passed');
      this.log(`📄 index.html size: ${(stats.size / 1024).toFixed(2)} KB`);
      return true;
    } catch (error) {
      this.log(`❌ Build verification failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async run() {
    this.log('🚀 Starting complete clean rebuild process...');
    
    const steps = [
      { name: 'Clean', fn: () => this.cleanAll() },
      { name: 'Reinstall', fn: () => this.reinstall() },
      { name: 'Generate Sitemap', fn: () => this.generateSitemap() },
      { name: 'Build', fn: () => this.build() },
      { name: 'Verify Build', fn: () => this.verifyBuild() },
      { name: 'Start Services', fn: () => this.startServices() }
    ];

    for (const step of steps) {
      this.log(`\n📋 Step: ${step.name}`);
      const success = await step.fn();
      
      if (!success) {
        this.log(`💥 Process failed at step: ${step.name}`, 'ERROR');
        process.exit(1);
      }
    }

    this.log('\n🎉 Complete clean rebuild process finished successfully!');
    this.log('🌐 Your site should now be available at: http://localhost:6001');
    this.log('📊 Check PM2 status with: pm2 status');
    this.log('📝 View logs with: pm2 logs');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const rebuilder = new CleanRebuilder();
  rebuilder.run().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = CleanRebuilder;
