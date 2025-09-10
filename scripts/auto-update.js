#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 加载环境变量
const { setEnvVars } = require('./load-env');
setEnvVars();

class AutoUpdater {
  constructor() {
    this.updateInterval = 10 * 60 * 1000; // 10分钟
    this.isRunning = false;
    this.lastUpdate = null;
    this.logFile = path.join(process.cwd(), 'logs', 'auto-update.log');
    
    // 确保日志目录存在
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logMessage);
    
    // 写入日志文件
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async checkForUpdates() {
    try {
      this.log('🔍 Checking for content updates...');
      
      // 检查 Strapi 内容是否有更新
      const hasUpdates = await this.checkStrapiUpdates();
      
      if (hasUpdates) {
        this.log('📝 Content updates detected, rebuilding site...');
        await this.rebuildSite();
        this.lastUpdate = new Date();
        this.log('✅ Site rebuild completed successfully');
      } else {
        this.log('ℹ️ No content updates found');
      }
      
    } catch (error) {
      this.log(`❌ Error during update check: ${error.message}`, 'ERROR');
    }
  }

  async checkStrapiUpdates() {
    const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const apiToken = process.env.STRAPI_API_TOKEN;
    
    if (!strapiURL) {
      throw new Error('NEXT_PUBLIC_STRAPI_API_URL not configured');
    }

    const headers = {};
    if (apiToken) {
      headers.Authorization = `Bearer ${apiToken}`;
    }

    try {
      // 检查所有内容类型的更新
      const contentTypes = ['pages', 'articles', 'sectors', 'events', 'resources'];
      const checkTime = this.lastUpdate ? this.lastUpdate.toISOString() : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      for (const contentType of contentTypes) {
        try {
          const response = await axios.get(`${strapiURL}/${contentType}`, {
            headers,
            params: {
              'filters[updatedAt][$gte]': checkTime,
              'pagination[pageSize]': 1
            }
          });

          if (response.data.data && response.data.data.length > 0) {
            this.log(`📝 Found updates in ${contentType}`, 'INFO');
            return true;
          }
        } catch (error) {
          this.log(`Warning: Could not check ${contentType}: ${error.message}`, 'WARN');
        }
      }

      return false;
    } catch (error) {
      this.log(`Warning: Could not check Strapi updates: ${error.message}`, 'WARN');
      return false;
    }
  }

  async rebuildSite() {
    try {
      // 1. 生成新的站点地图
      this.log('🗺️ Generating sitemap...');
      execSync('node scripts/enhanced-sitemap.js', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });

      // 2. 构建项目
      this.log('🔨 Building project...');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });

      // 3. 如果配置了部署命令，执行部署
      if (process.env.DEPLOY_COMMAND) {
        this.log('🚀 Deploying site...');
        execSync(process.env.DEPLOY_COMMAND, { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
      }

      // 4. 发送通知（如果配置了）
      await this.sendNotification('Site updated successfully');

    } catch (error) {
      this.log(`❌ Rebuild failed: ${error.message}`, 'ERROR');
      await this.sendNotification(`Site update failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async sendNotification(message, type = 'success') {
    // 发送到 Slack（如果配置了）
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const color = type === 'success' ? 'good' : 'danger';
        const payload = {
          text: `DITC Site Update`,
          attachments: [{
            color,
            fields: [{
              title: 'Status',
              value: message,
              short: false
            }, {
              title: 'Time',
              value: new Date().toISOString(),
              short: true
            }]
          }]
        };

        await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
        this.log('📢 Notification sent to Slack');
      } catch (error) {
        this.log(`Failed to send Slack notification: ${error.message}`, 'WARN');
      }
    }

    // 发送邮件通知（如果配置了）
    if (process.env.EMAIL_NOTIFICATION && process.env.SMTP_CONFIG) {
      // 这里可以集成邮件发送功能
      this.log('📧 Email notification would be sent here');
    }
  }

  start() {
    if (this.isRunning) {
      this.log('⚠️ Auto-updater is already running');
      return;
    }

    this.isRunning = true;
    this.log('🚀 Starting auto-updater...');
    this.log(`⏰ Update interval: ${this.updateInterval / 1000 / 60} minutes`);

    // 立即执行一次检查
    this.checkForUpdates();

    // 设置定时器
    this.intervalId = setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);

    // 优雅关闭处理
    process.on('SIGINT', () => {
      this.log('🛑 Received SIGINT, shutting down gracefully...');
      this.stop();
    });

    process.on('SIGTERM', () => {
      this.log('🛑 Received SIGTERM, shutting down gracefully...');
      this.stop();
    });
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.log('✅ Auto-updater stopped');
    process.exit(0);
  }

  // 手动触发更新
  async forceUpdate() {
    this.log('🔄 Force update triggered');
    await this.rebuildSite();
  }

  // 获取状态
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      nextUpdate: this.lastUpdate ? new Date(this.lastUpdate.getTime() + this.updateInterval) : null,
      updateInterval: this.updateInterval
    };
  }
}

// 命令行接口
if (require.main === module) {
  const updater = new AutoUpdater();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      updater.start();
      break;
    case 'stop':
      updater.stop();
      break;
    case 'update':
      updater.forceUpdate()
        .then(() => {
          console.log('✅ Force update completed');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Force update failed:', error);
          process.exit(1);
        });
      break;
    case 'status':
      console.log(JSON.stringify(updater.getStatus(), null, 2));
      break;
    default:
      console.log(`
Usage: node scripts/auto-update.js <command>

Commands:
  start   - Start the auto-updater
  stop    - Stop the auto-updater
  update  - Force an immediate update
  status  - Show current status

Environment Variables:
  DEPLOY_COMMAND     - Command to run after build (e.g., "npx wrangler deploy")
  SLACK_WEBHOOK_URL  - Slack webhook for notifications
  EMAIL_NOTIFICATION - Enable email notifications
  SMTP_CONFIG        - SMTP configuration for emails
      `);
  }
}

module.exports = AutoUpdater;
