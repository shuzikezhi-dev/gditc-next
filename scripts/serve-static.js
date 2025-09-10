#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

class StaticServer {
  constructor(port = 6001) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // 静态文件服务
    this.app.use(express.static(path.join(process.cwd(), 'out')));
    
    // 日志中间件
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });
  }

  setupRoutes() {
    // 添加缓存控制头
    this.app.use((req, res, next) => {
      // 对于静态资源，设置较长的缓存时间
      if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      } else {
        // 对于 HTML 文件，设置较短的缓存时间，确保更新及时
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      next();
    });

    // 处理 SPA 路由
    this.app.get('*', (req, res) => {
      const filePath = path.join(process.cwd(), 'out', req.path);
      
      // 检查文件是否存在
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
      } else {
        // 对于不存在的文件，返回 index.html（SPA 路由）
        res.sendFile(path.join(process.cwd(), 'out', 'index.html'));
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Static server running on http://localhost:${this.port}`);
      console.log(`📁 Serving files from: ${path.join(process.cwd(), 'out')}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
    });
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const port = process.argv[2] || 6001;
  const server = new StaticServer(parseInt(port));
  server.start();
}

module.exports = StaticServer;
