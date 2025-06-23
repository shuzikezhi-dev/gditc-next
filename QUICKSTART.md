# DITC 网站快速开始指南

本指南帮助您在 5 分钟内启动 DITC 官网项目。

## 🚀 快速开始

### 1. 项目初始化

```bash
# 运行初始化脚本
npm run setup
```

这个脚本会自动：
- 安装所有依赖
- 创建环境变量文件
- 设置必要的目录结构
- 创建基础配置文件

### 2. 配置环境变量

编辑 `.env.local` 文件：

```env
# Strapi CMS 配置
NEXT_PUBLIC_STRAPI_API_URL=https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN=your_api_token_here

# 站点配置
NEXT_PUBLIC_SITE_URL=https://gditc.org
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 📋 Strapi CMS 设置检查清单

在启动项目前，确保 Strapi CMS 已正确配置：

### 内容类型创建

- [ ] **Page (页面)** - 用于静态页面内容
- [ ] **Article (文章)** - 用于新闻和博客文章  
- [ ] **Category (分类)** - 用于文章分类

### API 权限设置

- [ ] 创建 API Token (Read-only)
- [ ] 设置 Public 角色权限：
  - Page: find, findOne
  - Article: find, findOne
  - Category: find, findOne

## 🎯 核心功能

### 🏠 首页 (/)
- Hero 区域展示协会使命
- 服务特色介绍
- 最新新闻动态

### 📄 动态页面 (/[slug])
- 从 Strapi 获取页面内容
- 支持富文本编辑
- SEO 优化

### 📰 新闻功能 (/news)
- 文章列表页面
- 文章详情页面 (/news/[slug])
- 分类筛选

### 🔧 管理功能
- 静态站点生成 (SSG)
- 自动站点地图生成
- SEO 优化
- 响应式设计

## 🛠️ 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 生成站点地图
npm run sitemap

# 项目初始化
npm run setup
```

## 📱 测试检查清单

在部署前，请确保以下功能正常：

### 功能测试
- [ ] 首页加载正常
- [ ] 导航菜单工作
- [ ] 动态页面显示正确内容
- [ ] 新闻列表加载文章
- [ ] 新闻详情页面正常
- [ ] 404 页面显示正确

### 响应式测试
- [ ] 移动设备 (< 768px)
- [ ] 平板设备 (768px - 1024px)
- [ ] 桌面设备 (> 1024px)

### 性能测试
- [ ] 首页加载时间 < 3 秒
- [ ] 图片正确优化
- [ ] CSS/JS 文件正确压缩

## 🚨 常见问题

### Q: 页面显示空白或加载失败
**A:** 检查以下项目：
1. 环境变量是否正确配置
2. Strapi API 是否可访问
3. API Token 是否有效
4. 浏览器控制台是否有错误信息

### Q: 样式显示不正确
**A:** 确保：
1. Tailwind CSS 配置正确
2. CSS 文件正确导入
3. 清除浏览器缓存

### Q: 图片无法显示
**A:** 检查：
1. next.config.js 中的 images 配置
2. Strapi 图片 URL 是否可访问
3. 图片路径是否正确

### Q: 构建失败
**A:** 常见原因：
1. 依赖包版本冲突
2. TypeScript 类型错误
3. 环境变量未正确设置

## 📞 获取帮助

如果遇到问题：

1. 查看 [README.md](./README.md) 详细文档
2. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署指南
3. 检查 GitHub Issues
4. 联系技术团队：tech@gditc.org

## 🎉 部署准备

当您完成开发和测试后：

1. 提交代码到 Git 仓库
2. 按照 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署到 Cloudflare Pages
3. 配置自定义域名
4. 设置 Webhook 自动部署

---

**开始构建精彩的 DITC 官网吧！** 🚀 