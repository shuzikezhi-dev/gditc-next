#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 DITC 网站项目初始化脚本');
console.log('============================\n');

// 检查是否已存在 node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ 依赖已存在，跳过安装');
} else {
  console.log('📦 安装项目依赖...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ 依赖安装完成\n');
  } catch (error) {
    console.error('❌ 依赖安装失败:', error.message);
    process.exit(1);
  }
}

// 检查环境变量文件
if (fs.existsSync('.env.local')) {
  console.log('✅ 环境变量文件已存在');
} else {
  console.log('📝 创建环境变量文件...');
  try {
    fs.copyFileSync('env.example', '.env.local');
    console.log('✅ 已创建 .env.local 文件');
    console.log('⚠️  请编辑 .env.local 文件，配置您的 Strapi API 信息\n');
  } catch (error) {
    console.error('❌ 创建环境变量文件失败:', error.message);
  }
}

// 创建 public 目录及必要文件
const publicDir = 'public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ 创建 public 目录');
}

// 创建 robots.txt
const robotsPath = path.join(publicDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://gditc.org/sitemap.xml`;
  
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('✅ 创建 robots.txt 文件');
}

// 显示下一步说明
console.log('\n🎉 项目初始化完成！');
console.log('\n📋 下一步操作：');
console.log('1. 编辑 .env.local 文件，配置 Strapi API 信息');
console.log('2. 确保 Strapi CMS 已正确设置内容类型和权限');
console.log('3. 运行 npm run dev 启动开发服务器');
console.log('4. 访问 http://localhost:3000 查看网站');
console.log('\n📚 文档：');
console.log('- 查看 README.md 了解项目详情');
console.log('- 查看 DEPLOYMENT.md 了解部署流程');
console.log('\n🆘 如果遇到问题：');
console.log('- 检查 .env.local 中的 API 配置');
console.log('- 确保 Strapi 服务正常运行');
console.log('- 查看控制台错误信息');

console.log('\n✨ 祝您使用愉快！'); 