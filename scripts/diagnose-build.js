#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildDiagnostic {
  constructor() {
    this.projectRoot = process.cwd();
    this.outDir = path.join(this.projectRoot, 'out');
    this.nextDir = path.join(this.projectRoot, '.next');
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // 检查配置文件
  checkConfig() {
    this.log('🔍 检查配置文件...');
    
    // 检查 next.config.js
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const config = fs.readFileSync(nextConfigPath, 'utf8');
      if (config.includes("output: 'export'")) {
        this.log('✅ next.config.js 配置正确 - 已启用静态导出');
      } else {
        this.log('❌ next.config.js 配置错误 - 未启用静态导出', 'ERROR');
        return false;
      }
      
      if (config.includes("distDir: 'out'")) {
        this.log('✅ next.config.js 配置正确 - 输出目录设置为 out');
      } else {
        this.log('❌ next.config.js 配置错误 - 输出目录未设置为 out', 'ERROR');
        return false;
      }
    } else {
      this.log('❌ next.config.js 文件不存在', 'ERROR');
      return false;
    }

    // 检查 package.json
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.scripts && packageJson.scripts.build) {
        this.log(`✅ package.json 构建脚本: ${packageJson.scripts.build}`);
      } else {
        this.log('❌ package.json 中缺少构建脚本', 'ERROR');
        return false;
      }
    }

    return true;
  }

  // 检查目录结构
  checkDirectories() {
    this.log('🔍 检查目录结构...');
    
    const dirs = [
      { path: this.projectRoot, name: '项目根目录' },
      { path: path.join(this.projectRoot, 'pages'), name: 'pages 目录' },
      { path: path.join(this.projectRoot, 'components'), name: 'components 目录' },
      { path: path.join(this.projectRoot, 'lib'), name: 'lib 目录' },
      { path: path.join(this.projectRoot, 'public'), name: 'public 目录' }
    ];

    for (const dir of dirs) {
      if (fs.existsSync(dir.path)) {
        this.log(`✅ ${dir.name} 存在`);
      } else {
        this.log(`❌ ${dir.name} 不存在: ${dir.path}`, 'ERROR');
        return false;
      }
    }

    return true;
  }

  // 检查环境变量
  checkEnvironment() {
    this.log('🔍 检查环境变量...');
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_STRAPI_API_URL',
      'STRAPI_API_TOKEN'
    ];

    let allPresent = true;
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        this.log(`✅ ${envVar} 已设置`);
      } else {
        this.log(`❌ ${envVar} 未设置`, 'ERROR');
        allPresent = false;
      }
    }

    return allPresent;
  }

  // 清理构建目录
  cleanBuildDirs() {
    this.log('🧹 清理构建目录...');
    
    const dirsToClean = [this.outDir, this.nextDir];
    
    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          this.log(`✅ 已清理目录: ${path.basename(dir)}`);
        } catch (error) {
          this.log(`❌ 清理目录失败: ${dir} - ${error.message}`, 'ERROR');
        }
      } else {
        this.log(`ℹ️ 目录不存在，无需清理: ${path.basename(dir)}`);
      }
    }
  }

  // 执行构建
  async performBuild() {
    this.log('🔨 开始构建...');
    
    try {
      // 设置环境变量
      process.env.NODE_ENV = 'production';
      
      // 执行构建
      this.log('执行: npm run build');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: this.projectRoot,
        env: { ...process.env }
      });
      
      this.log('✅ 构建完成');
      return true;
    } catch (error) {
      this.log(`❌ 构建失败: ${error.message}`, 'ERROR');
      return false;
    }
  }

  // 验证构建结果
  verifyBuild() {
    this.log('🔍 验证构建结果...');
    
    if (fs.existsSync(this.outDir)) {
      this.log('✅ out 目录已生成');
      
      // 检查关键文件
      const keyFiles = [
        'index.html',
        '_next/static',
        'favicon.ico'
      ];
      
      for (const file of keyFiles) {
        const filePath = path.join(this.outDir, file);
        if (fs.existsSync(filePath)) {
          this.log(`✅ 关键文件存在: ${file}`);
        } else {
          this.log(`❌ 关键文件缺失: ${file}`, 'ERROR');
        }
      }
      
      // 统计文件数量
      const files = this.getAllFiles(this.outDir);
      this.log(`📊 构建结果统计: ${files.length} 个文件`);
      
      return true;
    } else {
      this.log('❌ out 目录未生成', 'ERROR');
      return false;
    }
  }

  // 获取目录下所有文件
  getAllFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // 生成修复建议
  generateFixSuggestions() {
    this.log('💡 修复建议:');
    console.log('');
    console.log('1. 确保使用正确的构建命令:');
    console.log('   npm run build');
    console.log('');
    console.log('2. 检查 next.config.js 配置:');
    console.log('   - output: "export"');
    console.log('   - distDir: "out"');
    console.log('   - trailingSlash: true');
    console.log('');
    console.log('3. 确保环境变量正确设置:');
    console.log('   - NEXT_PUBLIC_STRAPI_API_URL');
    console.log('   - STRAPI_API_TOKEN');
    console.log('');
    console.log('4. 如果问题持续，尝试完全清理重建:');
    console.log('   npm run clean:all');
    console.log('');
  }

  // 主诊断流程
  async diagnose() {
    this.log('🚀 开始构建诊断...');
    console.log('');
    
    // 1. 检查配置
    if (!this.checkConfig()) {
      this.generateFixSuggestions();
      return false;
    }
    console.log('');
    
    // 2. 检查目录结构
    if (!this.checkDirectories()) {
      this.generateFixSuggestions();
      return false;
    }
    console.log('');
    
    // 3. 检查环境变量
    if (!this.checkEnvironment()) {
      this.log('⚠️ 环境变量检查失败，但继续构建...', 'WARN');
    }
    console.log('');
    
    // 4. 清理构建目录
    this.cleanBuildDirs();
    console.log('');
    
    // 5. 执行构建
    if (!await this.performBuild()) {
      this.generateFixSuggestions();
      return false;
    }
    console.log('');
    
    // 6. 验证构建结果
    if (!this.verifyBuild()) {
      this.generateFixSuggestions();
      return false;
    }
    
    this.log('🎉 构建诊断完成 - 所有检查通过！');
    return true;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const diagnostic = new BuildDiagnostic();
  diagnostic.diagnose().catch(console.error);
}

module.exports = BuildDiagnostic;
