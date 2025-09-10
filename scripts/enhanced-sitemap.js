const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 加载环境变量
const { setEnvVars } = require('./load-env');
setEnvVars();

class EnhancedSitemapGenerator {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gditc.org';
    this.strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    this.apiToken = process.env.STRAPI_API_TOKEN;
    
    if (!this.strapiURL) {
      throw new Error('NEXT_PUBLIC_STRAPI_API_URL environment variable is required');
    }
  }

  async fetchFromStrapi(endpoint, params = {}) {
    const headers = {};
    if (this.apiToken) {
      headers.Authorization = `Bearer ${this.apiToken}`;
    }

    try {
      const response = await axios.get(`${this.strapiURL}${endpoint}`, {
        headers,
        params: {
          'pagination[pageSize]': 1000, // 获取更多数据
          'sort': 'updatedAt:desc',
          ...params
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.warn(`Warning: Failed to fetch ${endpoint}:`, error.message);
      return [];
    }
  }

  async generateSitemap() {
    console.log('🚀 Starting enhanced sitemap generation...');
    
    try {
      // 并行获取所有数据
      const [pages, articles, sectors, events, resources] = await Promise.all([
        this.fetchFromStrapi('/pages', { 'fields[0]': 'slug', 'fields[1]': 'updatedAt', 'fields[2]': 'locale' }),
        this.fetchFromStrapi('/articles', { 'fields[0]': 'slug', 'fields[1]': 'updatedAt', 'fields[2]': 'locale' }),
        this.fetchFromStrapi('/sectors', { 'fields[0]': 'slug', 'fields[1]': 'updatedAt', 'fields[2]': 'locale' }),
        this.fetchFromStrapi('/events', { 'fields[0]': 'slug', 'fields[1]': 'updatedAt', 'fields[2]': 'locale' }),
        this.fetchFromStrapi('/resources', { 'fields[0]': 'slug', 'fields[1]': 'updatedAt', 'fields[2]': 'locale' })
      ]);

      console.log(`📊 Fetched data: ${pages.length} pages, ${articles.length} articles, ${sectors.length} sectors, ${events.length} events, ${resources.length} resources`);

      // 静态页面
      const staticPages = [
        { url: '', lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
        { url: '/about', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.9' },
        { url: '/sectors', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
        { url: '/ActivitiesAndServices', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
        { url: '/events', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
        { url: '/newsroom', lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
        { url: '/resources', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.7' },
        { url: '/join-us', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.7' }
      ];

      // 多语言静态页面
      const locales = ['en', 'zh-Hans'];
      const multilingualStaticPages = [];
      
      locales.forEach(locale => {
        staticPages.forEach(page => {
          const localePrefix = locale === 'en' ? '' : `/${locale}`;
          multilingualStaticPages.push({
            url: `${localePrefix}${page.url}`,
            lastmod: page.lastmod,
            changefreq: page.changefreq,
            priority: page.priority
          });
        });
      });

      // 动态页面
      const dynamicPages = [];
      
      // 处理页面
      pages.forEach(page => {
        const locale = page.attributes.locale || 'en';
        const localePrefix = locale === 'en' ? '' : `/${locale}`;
        dynamicPages.push({
          url: `${localePrefix}/${page.attributes.slug}`,
          lastmod: page.attributes.updatedAt,
          changefreq: 'weekly',
          priority: '0.8'
        });
      });

      // 处理文章
      articles.forEach(article => {
        const locale = article.attributes.locale || 'en';
        const localePrefix = locale === 'en' ? '' : `/${locale}`;
        dynamicPages.push({
          url: `${localePrefix}/newsroom/${article.attributes.slug}`,
          lastmod: article.attributes.updatedAt,
          changefreq: 'monthly',
          priority: '0.6'
        });
      });

      // 处理行业
      sectors.forEach(sector => {
        const locale = sector.attributes.locale || 'en';
        const localePrefix = locale === 'en' ? '' : `/${locale}`;
        dynamicPages.push({
          url: `${localePrefix}/sectors/${sector.attributes.slug}`,
          lastmod: sector.attributes.updatedAt,
          changefreq: 'weekly',
          priority: '0.7'
        });
      });

      // 处理事件
      events.forEach(event => {
        const locale = event.attributes.locale || 'en';
        const localePrefix = locale === 'en' ? '' : `/${locale}`;
        dynamicPages.push({
          url: `${localePrefix}/events/${event.attributes.slug}`,
          lastmod: event.attributes.updatedAt,
          changefreq: 'weekly',
          priority: '0.6'
        });
      });

      // 处理资源
      resources.forEach(resource => {
        const locale = resource.attributes.locale || 'en';
        const localePrefix = locale === 'en' ? '' : `/${locale}`;
        dynamicPages.push({
          url: `${localePrefix}/resources/${resource.attributes.slug}`,
          lastmod: resource.attributes.updatedAt,
          changefreq: 'monthly',
          priority: '0.5'
        });
      });

      // 合并所有页面
      const allPages = [...multilingualStaticPages, ...dynamicPages];
      
      // 去重
      const uniquePages = allPages.filter((page, index, self) => 
        index === self.findIndex(p => p.url === page.url)
      );

      console.log(`📝 Generating sitemap with ${uniquePages.length} unique URLs`);

      // 生成sitemap XML
      const sitemap = this.generateSitemapXML(uniquePages);
      
      // 确保public目录存在
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // 写入sitemap文件
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
      
      // 生成sitemap索引（如果页面太多）
      if (uniquePages.length > 50000) {
        await this.generateSitemapIndex(uniquePages);
      }
      
      // 生成robots.txt
      this.generateRobotsTxt(publicDir);
      
      // 生成sitemap统计
      this.generateSitemapStats(uniquePages, publicDir);
      
      console.log(`✅ Enhanced sitemap generated successfully with ${uniquePages.length} URLs`);
      
      return uniquePages.length;
      
    } catch (error) {
      console.error('❌ Error generating enhanced sitemap:', error);
      throw error;
    }
  }

  generateSitemapXML(pages) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>${this.baseURL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  }

  async generateSitemapIndex(pages) {
    const chunkSize = 50000;
    const chunks = [];
    
    for (let i = 0; i < pages.length; i += chunkSize) {
      chunks.push(pages.slice(i, i + chunkSize));
    }

    const publicDir = path.join(process.cwd(), 'public');
    
    // 生成分块sitemap
    chunks.forEach((chunk, index) => {
      const sitemap = this.generateSitemapXML(chunk);
      fs.writeFileSync(path.join(publicDir, `sitemap-${index + 1}.xml`), sitemap);
    });

    // 生成sitemap索引
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.map((_, index) => `  <sitemap>
    <loc>${this.baseURL}/sitemap-${index + 1}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
    console.log(`📋 Generated sitemap index with ${chunks.length} chunks`);
  }

  generateRobotsTxt(publicDir) {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseURL}/sitemap.xml
${fs.existsSync(path.join(publicDir, 'sitemap-index.xml')) ? `Sitemap: ${this.baseURL}/sitemap-index.xml` : ''}

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block admin and API paths
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ robots.txt generated successfully');
  }

  generateSitemapStats(pages, publicDir) {
    const stats = {
      totalUrls: pages.length,
      generatedAt: new Date().toISOString(),
      languages: [...new Set(pages.map(p => p.url.startsWith('/zh-Hans') ? 'zh-Hans' : 'en'))],
      urlTypes: {
        static: pages.filter(p => !p.url.includes('/') || p.url.split('/').length <= 2).length,
        dynamic: pages.filter(p => p.url.split('/').length > 2).length
      },
      priorities: {
        high: pages.filter(p => parseFloat(p.priority) >= 0.8).length,
        medium: pages.filter(p => parseFloat(p.priority) >= 0.5 && parseFloat(p.priority) < 0.8).length,
        low: pages.filter(p => parseFloat(p.priority) < 0.5).length
      }
    };

    fs.writeFileSync(
      path.join(publicDir, 'sitemap-stats.json'), 
      JSON.stringify(stats, null, 2)
    );
    console.log('📊 Sitemap statistics generated');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const generator = new EnhancedSitemapGenerator();
  generator.generateSitemap()
    .then(count => {
      console.log(`🎉 Sitemap generation completed with ${count} URLs`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Sitemap generation failed:', error);
      process.exit(1);
    });
}

module.exports = EnhancedSitemapGenerator;
