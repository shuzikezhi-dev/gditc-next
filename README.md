# DITC 官网前端项目

数字化国际贸易与商务协会（DITC）官方网站前端项目，基于 Next.js 构建，集成 Strapi CMS。

## 🚀 技术栈

- **前端框架**: Next.js 14 with TypeScript
- **样式框架**: Tailwind CSS
- **内容管理**: Strapi Cloud CMS
- **部署平台**: Cloudflare Pages
- **包管理器**: npm
- **SEO 优化**: 结构化数据、多语言站点地图
- **自动更新**: 10分钟间隔内容检查和自动部署

## 📁 项目结构

```
.
├── components/          # React 组件
│   ├── Layout.tsx      # 布局组件
│   ├── SEOHead.tsx     # SEO 头部组件
│   └── OptimizedImage.tsx # 图片优化组件
├── lib/                # 工具库
│   ├── strapi.ts       # Strapi API 集成
│   └── structured-data.ts # 结构化数据生成
├── pages/              # Next.js 页面
│   ├── _app.tsx        # 应用入口
│   ├── index.tsx       # 首页
│   └── [slug].tsx      # 动态页面
├── styles/             # 样式文件
│   └── globals.css     # 全局样式
├── scripts/            # 构建脚本
│   ├── generate-sitemap.js # 基础站点地图生成
│   ├── enhanced-sitemap.js # 增强站点地图生成
│   └── auto-update.js  # 自动更新脚本
├── public/             # 静态资源
├── logs/               # 日志文件
├── ecosystem.config.js # PM2 配置
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

### 基础命令
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
```

### SEO 和站点地图
```bash
# 生成基础站点地图
npm run sitemap

# 生成增强站点地图（推荐）
npm run sitemap:enhanced

# SEO 优化构建
npm run seo:build
```

### 自动更新系统
```bash
# 启动自动更新（10分钟间隔）
npm run auto-update:start

# 停止自动更新
npm run auto-update:stop

# 手动触发更新
npm run auto-update:update

# 查看更新状态
npm run auto-update:status
```

### PM2 生产环境管理
```bash
# 启动 PM2 服务
npm run pm2:start

# 停止 PM2 服务
npm run pm2:stop

# 重启 PM2 服务
npm run pm2:restart

# 查看 PM2 日志
npm run pm2:logs
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

## 🚀 生产环境部署指南

### 1. 服务器环境准备

#### 系统要求
- Node.js 18+ 
- PM2 进程管理器
- Git
- 足够的磁盘空间（建议 2GB+）

#### 安装依赖
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Wrangler CLI（用于 Cloudflare 部署）
npm install -g wrangler
```

### 2. 项目部署

#### 克隆和配置
```bash
# 克隆项目
git clone <your-repository-url>
cd gditc/code

# 安装依赖
npm install

# 配置环境变量
cp env.example .env.local
cp env.auto-update.example .env.auto-update

# 编辑配置文件
nano .env.local
nano .env.auto-update
```

#### 环境变量配置

**`.env.local` 配置：**
```env
# Strapi CMS 配置
NEXT_PUBLIC_STRAPI_API_URL=https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN=your_api_token_here

# 站点配置
NEXT_PUBLIC_SITE_URL=https://gditc.org
```

**`.env.auto-update` 配置：**
```env
# 更新间隔（10分钟）
UPDATE_INTERVAL=600000

# 部署命令
DEPLOY_COMMAND=npx wrangler deploy

# 通知配置（可选）
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
EMAIL_NOTIFICATION=false
```

### 3. Cloudflare 配置

#### Wrangler 认证
```bash
# 登录 Cloudflare
wrangler login

# 验证配置
wrangler whoami
```

#### 部署配置
确保 `wrangler.jsonc` 配置正确：
```json
{
  "name": "ditc-frontend",
  "compatibility_date": "2025-06-23",
  "assets": {
    "directory": "./out"
  }
}
```

### 4. 启动服务

#### 首次部署
```bash
# 生成站点地图
npm run sitemap:enhanced

# 构建项目
npm run build

# 部署到 Cloudflare
npx wrangler deploy

# 启动自动更新服务
npm run pm2:start
```

#### 验证部署
```bash
# 检查 PM2 状态
pm2 status

# 查看日志
npm run pm2:logs

# 检查自动更新状态
npm run auto-update:status
```

### 5. 监控和维护

#### 日志管理
```bash
# 查看实时日志
pm2 logs ditc-auto-updater

# 查看历史日志
tail -f logs/auto-update.log

# 清理旧日志
pm2 flush
```

#### 服务管理
```bash
# 重启服务
npm run pm2:restart

# 停止服务
npm run pm2:stop

# 手动触发更新
npm run auto-update:update
```

#### 健康检查
```bash
# 检查网站状态
curl -I https://gditc.org

# 检查站点地图
curl https://gditc.org/sitemap.xml

# 检查自动更新状态
npm run auto-update:status
```

### 6. 故障排除

#### 常见问题

**1. 自动更新不工作**
```bash
# 检查环境变量
echo $NEXT_PUBLIC_STRAPI_API_URL
echo $STRAPI_API_TOKEN

# 检查 PM2 状态
pm2 status

# 查看错误日志
pm2 logs ditc-auto-updater --err
```

**2. 构建失败**
```bash
# 清理缓存
rm -rf .next out node_modules package-lock.json

# 重新安装
npm install

# 重新构建
npm run build
```

**3. 部署失败**
```bash
# 检查 Wrangler 配置
wrangler whoami

# 检查 wrangler.jsonc
cat wrangler.jsonc

# 手动部署测试
npx wrangler deploy --dry-run
```

### 7. 性能优化

#### 构建优化
- 使用 CDN 加速静态资源
- 启用图片优化
- 配置缓存策略

#### 更新优化
- 根据内容更新频率调整间隔
- 配置并行构建
- 使用增量更新

#### 监控优化
- 设置告警阈值
- 配置日志轮转
- 定期清理旧日志

### 8. 安全配置

#### API 安全
- 定期轮换 API Token
- 限制 API 访问频率
- 使用 HTTPS

#### 部署安全
- 保护环境变量
- 配置防火墙规则
- 定期更新依赖

### 9. 备份和恢复

#### 数据备份
```bash
# 备份环境配置
cp .env.local .env.local.backup
cp .env.auto-update .env.auto-update.backup

# 备份 PM2 配置
pm2 save
```

#### 恢复流程
```bash
# 恢复环境配置
cp .env.local.backup .env.local
cp .env.auto-update.backup .env.auto-update

# 恢复 PM2 配置
pm2 resurrect
```

## 📞 技术支持

- 项目维护者：DITC 技术团队
- 邮箱：tech@gditc.org
- 网站：[https://gditc.org](https://gditc.org)

### 紧急联系
如遇到紧急问题，请：
1. 查看日志文件：`logs/auto-update.log`
2. 检查 PM2 状态：`pm2 status`
3. 联系技术支持团队

---

© 2024 DITC - 数字化国际贸易与商务协会 