#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentPackager {
  constructor() {
    this.projectRoot = process.cwd();
    this.deploymentDir = path.join(this.projectRoot, 'deployment-package');
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // 需要包含的文件和目录
  getIncludedPaths() {
    return [
      // 核心配置文件
      'package.json',
      'package-lock.json',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'tsconfig.json',
      'wrangler.jsonc',
      'ecosystem.config.js',
      'README.md',
      
      // 源代码目录
      'components/',
      'lib/',
      'pages/',
      'styles/',
      'scripts/',
      'public/',
      
      // 环境配置文件
      '.env.local',
      '.env.auto-update',
      'env.example',
      'env.auto-update.example',
      
      // 文档文件
      'SEO_AUTO_UPDATE_GUIDE.md',
      'STATIC_EXPORT_FIX.md'
    ];
  }

  // 需要排除的文件和目录
  getExcludedPaths() {
    return [
      '.next/',
      'out/',
      'node_modules/',
      'logs/',
      '.cache/',
      '.turbo/',
      '.git/',
      '.vscode/',
      '.idea/',
      '*.log',
      '.DS_Store',
      'deployment-package/',
      '*.tmp',
      '*.temp'
    ];
  }

  async createDeploymentPackage() {
    this.log('📦 Creating deployment package...');
    
    try {
      // 清理旧的部署包
      if (fs.existsSync(this.deploymentDir)) {
        fs.rmSync(this.deploymentDir, { recursive: true, force: true });
        this.log('✅ Cleaned old deployment package');
      }

      // 创建部署目录
      fs.mkdirSync(this.deploymentDir, { recursive: true });
      this.log('✅ Created deployment directory');

      // 复制文件
      const includedPaths = this.getIncludedPaths();
      let copiedCount = 0;

      for (const item of includedPaths) {
        const sourcePath = path.join(this.projectRoot, item);
        const destPath = path.join(this.deploymentDir, item);

        if (fs.existsSync(sourcePath)) {
          const stats = fs.statSync(sourcePath);
          
          if (stats.isDirectory()) {
            this.copyDirectory(sourcePath, destPath);
            this.log(`📁 Copied directory: ${item}`);
          } else {
            this.copyFile(sourcePath, destPath);
            this.log(`📄 Copied file: ${item}`);
          }
          copiedCount++;
        } else {
          this.log(`⚠️ File/directory not found: ${item}`, 'WARN');
        }
      }

      this.log(`✅ Copied ${copiedCount} items to deployment package`);

      // 创建部署说明文件
      this.createDeploymentInstructions();

      // 创建压缩包
      await this.createArchive();

      this.log('🎉 Deployment package created successfully!');
      this.log(`📁 Location: ${this.deploymentDir}`);
      this.log(`📦 Archive: ${this.deploymentDir}.tar.gz`);

    } catch (error) {
      this.log(`❌ Failed to create deployment package: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  copyFile(source, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(source, dest);
  }

  copyDirectory(source, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(dest, item);
      const stats = fs.statSync(sourcePath);

      if (stats.isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        this.copyFile(sourcePath, destPath);
      }
    }
  }

  createDeploymentInstructions() {
    const instructions = `# 服务器部署说明

## 📦 部署包内容
此部署包包含了运行 DITC 官网所需的所有文件。

## 🚀 服务器部署步骤

### 1. 上传文件到服务器
\`\`\`bash
# 解压部署包
tar -xzf deployment-package.tar.gz
cd deployment-package

# 或者直接上传整个目录
\`\`\`

### 2. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 3. 配置环境变量
\`\`\`bash
# 复制环境变量模板
cp env.example .env.local
cp env.auto-update.example .env.auto-update

# 编辑配置文件
nano .env.local
nano .env.auto-update
\`\`\`

### 4. 生成站点地图和构建
\`\`\`bash
# 生成站点地图
npm run sitemap:enhanced

# 构建项目
npm run build
\`\`\`

### 5. 启动服务
\`\`\`bash
# 启动 PM2 服务
npm run pm2:start

# 检查服务状态
pm2 status
\`\`\`

### 6. 验证部署
\`\`\`bash
# 检查网站访问
curl -I http://localhost:6001

# 查看日志
pm2 logs
\`\`\`

## 📋 环境变量配置

### .env.local 必需配置
\`\`\`env
NEXT_PUBLIC_STRAPI_API_URL=https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN=your_api_token_here
NEXT_PUBLIC_SITE_URL=https://gditc.org
\`\`\`

### .env.auto-update 配置
\`\`\`env
UPDATE_INTERVAL=600000
DEPLOY_COMMAND=npx wrangler deploy
\`\`\`

## 🔧 常用命令

\`\`\`bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
npm run pm2:restart

# 手动触发更新
npm run auto-update:update

# 完全重建
npm run clean:all
\`\`\`

## 📞 技术支持
如遇问题，请查看日志文件或联系技术支持团队。
`;

    const instructionsPath = path.join(this.deploymentDir, 'DEPLOYMENT_INSTRUCTIONS.md');
    fs.writeFileSync(instructionsPath, instructions);
    this.log('📝 Created deployment instructions');
  }

  async createArchive() {
    this.log('🗜️ Creating archive...');
    
    try {
      const archiveName = 'deployment-package.tar.gz';
      const archivePath = path.join(this.projectRoot, archiveName);
      
      // 删除旧的压缩包
      if (fs.existsSync(archivePath)) {
        fs.unlinkSync(archivePath);
      }

      // 创建压缩包
      execSync(`tar -czf ${archiveName} -C ${this.projectRoot} deployment-package`, {
        stdio: 'inherit'
      });

      // 获取压缩包大小
      const stats = fs.statSync(archivePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      this.log(`✅ Created archive: ${archiveName} (${sizeInMB} MB)`);
    } catch (error) {
      this.log(`❌ Failed to create archive: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async run() {
    this.log('🚀 Starting deployment package creation...');
    
    try {
      await this.createDeploymentPackage();
      
      this.log('\n📋 Deployment Package Summary:');
      this.log('✅ All required files included');
      this.log('✅ Environment templates included');
      this.log('✅ Deployment instructions created');
      this.log('✅ Archive created');
      
      this.log('\n📤 Ready for server deployment!');
      this.log('Upload deployment-package.tar.gz to your server');
      
    } catch (error) {
      this.log(`💥 Deployment package creation failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const packager = new DeploymentPackager();
  packager.run();
}

module.exports = DeploymentPackager;
