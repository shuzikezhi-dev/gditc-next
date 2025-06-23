# DITC 网站部署指南

本指南将帮助您将 DITC 官网项目部署到 Cloudflare Pages。

## 📋 部署前准备

### 1. 确保项目完整性

请确保以下文件已正确配置：

- [ ] `package.json` - 项目依赖和脚本
- [ ] `next.config.js` - Next.js 配置
- [ ] `tailwind.config.js` - Tailwind CSS 配置
- [ ] `tsconfig.json` - TypeScript 配置
- [ ] `env.example` - 环境变量模板
- [ ] `.gitignore` - Git 忽略文件

### 2. Strapi CMS 配置

在部署前，请确保 Strapi CMS 已正确配置：

#### 创建内容类型

1. **Page (页面)**
   ```json
   {
     "title": "Text (必填)",
     "slug": "UID (必填)",
     "content": "Rich Text",
     "seo_title": "Text",
     "seo_description": "Text",
     "featured_image": "Media"
   }
   ```

2. **Article (文章)**
   ```json
   {
     "title": "Text (必填)",
     "slug": "UID (必填)",
     "content": "Rich Text",
     "excerpt": "Text",
     "featured_image": "Media",
     "published_at": "DateTime",
     "category": "Relation to Category"
   }
   ```

3. **Category (分类)**
   ```json
   {
     "name": "Text (必填)",
     "slug": "UID (必填)",
     "description": "Text"
   }
   ```

#### 设置 API 权限

1. 进入 Strapi 后台 → **Settings** → **API Tokens**
2. 创建新的 API Token，类型选择 "Read-only"
3. 设置以下权限：
   - `Page`: `find`, `findOne`
   - `Article`: `find`, `findOne`
   - `Category`: `find`, `findOne`
4. 保存并复制生成的 Token

## 🚀 Cloudflare Pages 部署

### 1. 准备 Git 仓库

1. 将项目代码推送到 GitHub/GitLab 仓库
   ```bash
   git add .
   git commit -m "Initial commit: DITC website"
   git push origin main
   ```

### 2. 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击左侧菜单 **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 授权并选择包含项目的仓库
6. 点击 **Begin setup**

### 3. 配置构建设置

在项目设置页面配置：

- **Project name**: `ditc-website`
- **Production branch**: `main`
- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/` (留空)

### 4. 设置环境变量

在 **Settings** → **Environment variables** 中添加：

```
NEXT_PUBLIC_STRAPI_API_URL = https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN = 你的API令牌
NEXT_PUBLIC_SITE_URL = https://gditc.org
```

**注意**: 将 `你的API令牌` 替换为从 Strapi 获取的实际 API Token。

### 5. 部署项目

1. 点击 **Save and Deploy**
2. 等待构建完成（通常需要 2-5 分钟）
3. 构建成功后，您将获得一个 `*.pages.dev` 的预览域名

## 🌐 自定义域名配置

### 1. 添加自定义域名

1. 在 Cloudflare Pages 项目中点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入 `gditc.org`
4. 点击 **Continue**

### 2. 配置 DNS 记录

如果您的域名不在 Cloudflare：

1. 在您的 DNS 提供商处添加 CNAME 记录：
   ```
   Name: @
   Type: CNAME
   Value: 你的项目.pages.dev
   ```

如果您的域名在 Cloudflare：

1. DNS 记录会自动创建
2. 确保记录状态为 "Proxied" (橙色云朵图标)

### 3. 添加 www 子域名

重复上述步骤，添加 `www.gditc.org` 作为自定义域名。

## 🔧 Webhook 配置 (可选)

设置 Webhook 以实现内容更新时自动重新部署：

### 1. 获取 Deploy Hook

1. 在 Cloudflare Pages 项目中点击 **Settings**
2. 滚动到 **Builds & deployments**
3. 点击 **Add deploy hook**
4. 输入名称: `Strapi Content Update`
5. 选择分支: `main`
6. 点击 **Save**
7. 复制生成的 Webhook URL

### 2. 在 Strapi 中配置 Webhook

1. 进入 Strapi 后台 → **Settings** → **Webhooks**
2. 点击 **Create new webhook**
3. 配置：
   - **Name**: `Cloudflare Pages Deploy`
   - **URL**: 粘贴上一步复制的 URL
   - **Events**: 选择 `Entry published`, `Entry unpublished`, `Entry updated`
4. 点击 **Save**

现在当 Strapi 中的内容更新时，网站会自动重新构建和部署。

## 🔍 部署验证

### 1. 检查网站功能

访问您的网站并验证：

- [ ] 首页正常加载
- [ ] 导航菜单工作正常
- [ ] 动态内容显示正确
- [ ] 响应式设计在各设备上正常
- [ ] SEO 标签正确设置

### 2. 性能检查

使用以下工具检查网站性能：

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

目标指标：
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔧 故障排除

### 常见问题及解决方案

#### 1. 构建失败

**错误**: `Module not found: Can't resolve 'axios'`

**解决方案**: 确保 `package.json` 中包含所有必要依赖。

#### 2. API 连接失败

**错误**: `Network Error` 或 `401 Unauthorized`

**解决方案**: 
- 检查环境变量是否正确设置
- 验证 Strapi API Token 是否有效
- 确认 Strapi 服务正常运行

#### 3. 图片加载失败

**错误**: 图片无法显示

**解决方案**:
- 检查 `next.config.js` 中的 `images.domains` 配置
- 确认 Strapi 图片 URL 可访问

#### 4. 样式问题

**错误**: 样式未正确应用

**解决方案**:
- 检查 Tailwind CSS 配置
- 确认 CSS 文件正确导入

### 获取帮助

如果遇到问题，请：

1. 检查 Cloudflare Pages 的部署日志
2. 查看浏览器开发者工具的控制台错误
3. 参考 [Next.js 文档](https://nextjs.org/docs)
4. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

## 📈 后续优化

部署完成后，考虑以下优化：

### 1. 安全设置

- 启用 HSTS
- 配置 CSP 头部
- 设置安全响应头

### 2. 性能优化

- 启用 Cloudflare 的性能优化功能
- 配置缓存规则
- 启用图片优化

### 3. 监控设置

- 配置 Cloudflare Analytics
- 设置 UptimeRobot 监控
- 配置错误报告

---

**部署完成！** 🎉

您的 DITC 官网现在已成功部署到 Cloudflare Pages。访问 https://gditc.org 查看您的网站。 