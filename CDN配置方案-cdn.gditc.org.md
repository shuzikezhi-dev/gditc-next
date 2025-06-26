# DITC官网CDN配置方案 - cdn.gditc.org

> **文档版本**: v1.0  
> **创建日期**: 2024年12月  
> **最后更新**: 2024年12月  
> **维护人员**: 技术支持团队

## 📋 目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [配置步骤](#配置步骤)
- [代码实现](#代码实现)
- [测试验证](#测试验证)
- [监控维护](#监控维护)
- [故障排除](#故障排除)

---

## 🎯 项目概述

### 配置目标
将 `cdn.gditc.org` 配置为 Strapi CMS 静态资源的CDN访问域名，实现全球加速访问图片、文件等静态资源。

### 核心需求
- **静态资源加速**: 图片、文档、媒体文件等
- **全球CDN分发**: 利用 Cloudflare 全球节点
- **自动缓存优化**: 减少源站负载
- **图片格式优化**: WebP、AVIF 自动转换

### 预期效果
- 🚀 **性能提升**: 静态资源加载速度提升 60-80%
- 💰 **成本节约**: 减少源站带宽消耗
- 🌍 **全球可用**: 就近访问，降低延迟
- 📱 **移动优化**: 自适应图片大小和格式

---

## 🏗️ 技术架构

### 当前系统架构

```
用户访问 (gditc.org)
    ↓
Cloudflare CDN/DNS
    ↓
Cloudflare Pages (静态前端)
    ↓ API 调用
Strapi Cloud CMS (内容管理)
```

### CDN配置架构

```
静态资源请求 (cdn.gditc.org/uploads/*)
    ↓
Cloudflare CDN (全球节点)
    ↓ 缓存未命中时
Strapi Cloud (wonderful-serenity-47deffe3a2.strapiapp.com)
```

### 账号信息汇总

| 服务 | 登录地址 | 账号 | 用途 |
|------|----------|------|------|
| Cloudflare | [cloudflare.com](https://cloudflare.com) | `tiger.w@cloudbest.cn` | DNS管理、CDN配置 |
| Strapi Cloud | [cloud.strapi.io](https://cloud.strapi.io/) | `ditc202506@gmail.com` | CMS项目管理 |
| Strapi Admin | [wonderful-serenity-47deffe3a2.strapiapp.com](https://wonderful-serenity-47deffe3a2.strapiapp.com) | `ditc202506@gmail.com` | 内容管理 |

---

## ⚙️ 配置步骤

### 第一步: Cloudflare DNS 配置

#### 1.1 添加 CNAME 记录

登录 Cloudflare Dashboard (`tiger.w@cloudbest.cn`):

1. 进入 `gditc.org` 域名管理
2. 点击 **DNS** 选项卡
3. 添加新记录:

```
类型: CNAME
名称: cdn
目标: wonderful-serenity-47deffe3a2.strapiapp.com
代理状态: 已代理 ✅ (显示橙色云朵图标)
TTL: 自动
```

#### 1.2 配置页面规则

进入 **规则** → **页面规则**，创建新规则:

**规则1: 静态资源缓存**
```
URL 模式: cdn.gditc.org/uploads/*
设置:
✅ 缓存级别: 缓存所有内容
✅ 边缘缓存TTL: 30天
✅ 浏览器缓存TTL: 7天
✅ 总是在线: 开启
```

**规则2: 图片优化**
```
URL 模式: cdn.gditc.org/uploads/*.{jpg,jpeg,png,gif,webp}
设置:
✅ Polish: 有损压缩
✅ WebP: 开启
```

#### 1.3 启用性能优化

在 **速度** → **优化** 中配置:

```
✅ Auto Minify: HTML, CSS, JavaScript
✅ Brotli: 开启
✅ Image Resizing: 开启
✅ Mirage: 开启 (移动设备图片优化)
```

### 第二步: Strapi CMS 配置

#### 2.1 环境变量配置

登录 Strapi Cloud (`ditc202506@gmail.com`):

1. 进入项目设置
2. 选择 **环境变量**
3. 添加新变量:

```env
CDN_URL=https://cdn.gditc.org
```

4. 保存并重启实例

#### 2.2 媒体库设置 (可选)

在 Strapi 管理后台:

1. 进入 **Settings** → **Media Library**
2. 如果有 CDN 配置选项，设置:
```
CDN Base URL: https://cdn.gditc.org
```

### 第三步: 前端代码配置

#### 3.1 Next.js 配置文件

修改 `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'wonderful-serenity-47deffe3a2.strapiapp.com',
      'cdn.gditc.org'  // 添加CDN域名
    ]
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    NEXT_PUBLIC_CDN_URL: 'https://cdn.gditc.org'
  }
}

module.exports = nextConfig
```

#### 3.2 环境变量

在 Cloudflare Pages 项目设置中添加:

```env
NEXT_PUBLIC_CDN_URL=https://cdn.gditc.org
```

---

## 💻 代码实现

### CDN 图片组件

创建 `components/CDNImage.tsx`:

```typescript
import Image from 'next/image';

interface CDNImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function CDNImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false 
}: CDNImageProps) {
  /**
   * 转换图片URL为CDN地址
   */
  const getCDNUrl = (imageSrc: string): string => {
    // 如果是相对路径的uploads，添加CDN前缀
    if (imageSrc.startsWith('/uploads/')) {
      return `https://cdn.gditc.org${imageSrc}`;
    }
    
    // 如果包含strapiapp.com，替换为CDN域名
    if (imageSrc.includes('strapiapp.com')) {
      return imageSrc.replace(
        'wonderful-serenity-47deffe3a2.strapiapp.com', 
        'cdn.gditc.org'
      );
    }
    
    // 其他情况返回原始URL
    return imageSrc;
  };

  return (
    <Image
      src={getCDNUrl(src)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
```

### Strapi API 工具函数

创建 `lib/cdn-utils.ts`:

```typescript
/**
 * CDN 工具函数
 */

const CDN_BASE_URL = 'https://cdn.gditc.org';
const STRAPI_BASE_URL = 'wonderful-serenity-47deffe3a2.strapiapp.com';

/**
 * 转换单个图片URL为CDN地址
 */
export const convertToCDN = (url: string): string => {
  if (!url) return '';
  
  if (url.startsWith('/uploads/')) {
    return `${CDN_BASE_URL}${url}`;
  }
  
  if (url.includes(STRAPI_BASE_URL)) {
    return url.replace(STRAPI_BASE_URL, 'cdn.gditc.org');
  }
  
  return url;
};

/**
 * 递归处理对象中的所有图片URL
 */
export const processMediaUrls = (data: any): any => {
  if (typeof data === 'string') {
    return convertToCDN(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(processMediaUrls);
  }
  
  if (data && typeof data === 'object') {
    const processed = { ...data };
    
    // 处理常见的图片字段
    if (processed.url) {
      processed.url = convertToCDN(processed.url);
    }
    
    if (processed.formats) {
      Object.keys(processed.formats).forEach(key => {
        if (processed.formats[key].url) {
          processed.formats[key].url = convertToCDN(processed.formats[key].url);
        }
      });
    }
    
    // 递归处理其他字段
    Object.keys(processed).forEach(key => {
      processed[key] = processMediaUrls(processed[key]);
    });
    
    return processed;
  }
  
  return data;
};

/**
 * 生成响应式图片URL
 */
export const getResponsiveImageUrl = (
  baseUrl: string, 
  width: number, 
  format: 'webp' | 'jpeg' | 'png' = 'webp'
): string => {
  const cdnUrl = convertToCDN(baseUrl);
  
  // 如果使用Cloudflare Image Resizing
  return `${cdnUrl}?width=${width}&format=${format}&quality=85`;
};
```

### API 调用封装

修改 `lib/strapi.ts`:

```typescript
import axios from 'axios';
import { processMediaUrls } from './cdn-utils';

const strapiAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// 响应拦截器：自动处理图片URL
strapiAPI.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = processMediaUrls(response.data);
    }
    return response;
  },
  (error) => {
    console.error('Strapi API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 获取页面内容
 */
export const getPageContent = async (slug: string) => {
  try {
    const response = await strapiAPI.get(
      `/pages?filters[slug][$eq]=${slug}&populate=*`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

/**
 * 获取文章列表
 */
export const getArticles = async () => {
  try {
    const response = await strapiAPI.get('/articles?populate=*');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

export default strapiAPI;
```

---

## 🧪 测试验证

### DNS 解析测试

```bash
# 检查DNS解析
dig cdn.gditc.org

# 检查CNAME记录
dig cdn.gditc.org CNAME

# 预期结果应包含Cloudflare的IP地址
```

### 功能测试

#### 1. 基础访问测试

**原始Strapi URL**:
```
https://wonderful-serenity-47deffe3a2.strapiapp.com/uploads/sample_image.jpg
```

**CDN URL**:
```
https://cdn.gditc.org/uploads/sample_image.jpg
```

两个URL应该都能正常访问相同的图片。

#### 2. 缓存测试

使用curl检查HTTP响应头:

```bash
curl -I https://cdn.gditc.org/uploads/sample_image.jpg
```

预期响应头应包含:
```
CF-Cache-Status: HIT
CF-Ray: xxxxxx-xxx
Cache-Control: public, max-age=604800
```

#### 3. 性能测试

使用在线工具测试加载速度:
- [GTmetrix](https://gtmetrix.com/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [WebPageTest](https://www.webpagetest.org/)

### 自动化测试脚本

创建 `scripts/test-cdn.js`:

```javascript
const axios = require('axios');

async function testCDN() {
  const testUrls = [
    'https://cdn.gditc.org/uploads/test-image.jpg',
    'https://wonderful-serenity-47deffe3a2.strapiapp.com/uploads/test-image.jpg'
  ];

  for (const url of testUrls) {
    try {
      const start = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const duration = Date.now() - start;
      
      console.log(`✅ ${url}`);
      console.log(`   状态: ${response.status}`);
      console.log(`   响应时间: ${duration}ms`);
      console.log(`   缓存状态: ${response.headers['cf-cache-status'] || 'N/A'}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${url}`);
      console.log(`   错误: ${error.message}`);
      console.log('');
    }
  }
}

testCDN();
```

---

## 📊 监控维护

### Cloudflare Analytics

在 Cloudflare Dashboard 中监控:

#### 关键指标
- **缓存命中率**: 目标 >90%
- **带宽节省**: 监控节省的带宽量
- **响应时间**: 全球平均响应时间
- **错误率**: 4xx/5xx 错误监控

#### 设置告警

1. 进入 **通知** 设置
2. 创建新的通知策略:

```
触发条件:
- 缓存命中率 < 85%
- 平均响应时间 > 500ms
- 错误率 > 5%

通知方式:
- 邮箱: support@gditc.org
- 微信/钉钉 (如已配置)
```

### 定期维护任务

#### 每周检查
- [ ] CDN缓存命中率报告
- [ ] 图片加载速度测试
- [ ] 错误日志检查

#### 每月优化
- [ ] 分析热点资源，调整缓存策略
- [ ] 清理无用的缓存内容
- [ ] 检查新的性能优化功能

#### 每季度评估
- [ ] CDN成本效益分析
- [ ] 性能提升效果评估
- [ ] 技术架构优化建议

### 监控脚本

创建 `scripts/monitor-cdn.js`:

```javascript
const axios = require('axios');

async function monitorCDN() {
  const endpoints = [
    'https://cdn.gditc.org/uploads/',
    'https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/analytics/dashboard'
  ];

  // 实现监控逻辑
  // 检查可用性、响应时间、缓存状态等
}

// 设置定时监控
setInterval(monitorCDN, 5 * 60 * 1000); // 每5分钟检查一次
```

---

## 🔧 故障排除

### 常见问题及解决方案

#### 问题1: CDN域名无法访问

**症状**: `cdn.gditc.org` 返回错误或无法访问

**排查步骤**:
1. 检查DNS解析: `dig cdn.gditc.org`
2. 确认CNAME记录配置正确
3. 检查Cloudflare代理状态是否启用

**解决方案**:
```bash
# 重新设置CNAME记录
# 确保目标指向: wonderful-serenity-47deffe3a2.strapiapp.com
# 确保代理状态为: 已代理 (橙色云朵)
```

#### 问题2: 图片无法加载

**症状**: 前端页面图片显示错误

**排查步骤**:
1. 检查图片URL格式是否正确
2. 确认CDN URL转换逻辑
3. 检查Strapi原始图片是否存在

**解决方案**:
```typescript
// 检查URL转换逻辑
console.log('原始URL:', originalUrl);
console.log('CDN URL:', convertToCDN(originalUrl));
```

#### 问题3: 缓存问题

**症状**: 更新的图片没有及时生效

**解决方案**:
1. 在Cloudflare控制台清除缓存
2. 或使用API清除特定文件缓存:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"files":["https://cdn.gditc.org/uploads/updated-image.jpg"]}'
```

#### 问题4: CORS错误

**症状**: 浏览器控制台显示跨域错误

**解决方案**:
在Cloudflare页面规则中添加CORS头:
```
URL模式: cdn.gditc.org/*
设置:
✅ 添加响应头:
  Access-Control-Allow-Origin: https://gditc.org
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

### 紧急联系方式

| 角色 | 联系方式 | 职责 |
|------|----------|------|
| **技术支持** | `support@gditc.org` | 一般技术问题 |
| **系统管理员** | `ditc202506@gmail.com` | 系统配置问题 |
| **域名管理** | `tiger.w@cloudbest.cn` | DNS和CDN问题 |

---

## 📚 相关文档

- [技术方案-DITC官网静态页面实现.md](./技术方案-DITC官网静态页面实现.md)
- [README.md](./readme.md)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Strapi 文档](https://docs.strapi.io/)

---

## 📝 更新日志

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0 | 2024-12 | 初始版本，完整CDN配置方案 | 技术团队 |

---

> **备注**: 本文档包含敏感配置信息，请妥善保管，仅供授权技术人员使用。 