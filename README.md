# DITC 官网前端项目

数字化国际贸易与商务协会（DITC）官方网站前端项目，基于 Next.js 构建，集成 Strapi CMS。

## 🚀 技术栈

- **前端框架**: Next.js 14 with TypeScript
- **样式框架**: Tailwind CSS
- **内容管理**: Strapi Cloud CMS
- **部署平台**: Cloudflare Pages
- **包管理器**: npm

## 📁 项目结构

```
.
├── components/          # React 组件
│   ├── Layout.tsx      # 布局组件
│   ├── SEOHead.tsx     # SEO 头部组件
│   └── OptimizedImage.tsx # 图片优化组件
├── lib/                # 工具库
│   └── strapi.ts       # Strapi API 集成
├── pages/              # Next.js 页面
│   ├── _app.tsx        # 应用入口
│   ├── index.tsx       # 首页
│   └── [slug].tsx      # 动态页面
├── styles/             # 样式文件
│   └── globals.css     # 全局样式
├── scripts/            # 构建脚本
│   └── generate-sitemap.js # 站点地图生成
├── public/             # 静态资源
└── next.config.js      # Next.js 配置
```

## 🛠️ 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

复制环境变量模板并配置：

```bash
cp env.example .env.local
```

在 `.env.local` 中配置以下变量：

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

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

## 📝 页面结构

| 页面路径 | 描述 | 数据源 |
|---------|------|--------|
| `/` | 首页 | Strapi CMS |
| `/about` | 关于我们 | Strapi CMS |
| `/membership` | 会员体系 | Strapi CMS |
| `/join` | 加入我们 | Strapi CMS |
| `/news` | 新闻列表 | Strapi CMS |
| `/news/[slug]` | 新闻详情 | Strapi CMS |
| `/contact` | 联系我们 | Strapi CMS |
| `/[slug]` | 动态页面 | Strapi CMS |

## 🎨 Strapi CMS 配置

### 内容类型

项目需要在 Strapi 中创建以下内容类型：

#### Page (页面)
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

#### Article (文章)
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

#### Category (分类)
```json
{
  "name": "Text (必填)",
  "slug": "UID (必填)",
  "description": "Text"
}
```

### API 权限配置

1. 在 Strapi 后台进入 **Settings** > **API Tokens**
2. 创建新的 API Token，设置 Read 权限
3. 将 Token 添加到环境变量 `STRAPI_API_TOKEN`

## 🚀 部署到 Cloudflare Pages

### 1. 构建项目

```bash
npm run build
```

### 2. Cloudflare Pages 设置

在 Cloudflare Pages 中配置：

- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/`

### 3. 环境变量

在 Cloudflare Pages 项目设置中添加：

```
NEXT_PUBLIC_STRAPI_API_URL = https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN = your_api_token_here
NEXT_PUBLIC_SITE_URL = https://gditc.org
```

### 4. 自定义域名

1. 在项目设置中添加自定义域名 `gditc.org`
2. 配置 DNS 记录指向 Cloudflare Pages

## 🔧 可用脚本

```bash
# 开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm run start

# 导出静态文件
npm run export

# 代码检查
npm run lint

# 生成站点地图
node scripts/generate-sitemap.js
```

## 📊 性能优化

- ✅ 静态站点生成 (SSG)
- ✅ 图片优化
- ✅ 代码分割
- ✅ CDN 缓存 (Cloudflare)
- ✅ SEO 优化
- ✅ 站点地图自动生成

## 🔒 安全配置

- ✅ HTTPS 强制重定向
- ✅ API Token 身份验证
- ✅ 环境变量隔离
- ✅ CSP 安全头部

## 📱 响应式设计

项目使用 Tailwind CSS 实现完全响应式设计，支持：

- 📱 移动设备 (320px+)
- 📱 平板设备 (768px+)
- 💻 桌面设备 (1024px+)
- 🖥️ 大屏设备 (1280px+)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目维护者：DITC 技术团队
- 邮箱：tech@gditc.org
- 网站：[https://gditc.org](https://gditc.org)

---

© 2024 DITC - 数字化国际贸易与商务协会 