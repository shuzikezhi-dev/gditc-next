const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function generateSitemap() {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gditc.org';
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  if (!strapiURL) {
    console.error('NEXT_PUBLIC_STRAPI_API_URL environment variable is required');
    process.exit(1);
  }

  try {
    // 获取所有页面
    const pagesResponse = await axios.get(`${strapiURL}/pages?fields[0]=slug&fields[1]=updatedAt`);
    const pages = pagesResponse.data.data;

    // 获取所有文章
    const articlesResponse = await axios.get(`${strapiURL}/articles?fields[0]=slug&fields[1]=updatedAt`);
    const articles = articlesResponse.data.data;

    // 静态页面
    const staticPages = [
      { url: '', lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
      { url: '/about', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.8' },
      { url: '/membership', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.8' },
      { url: '/join', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.8' },
      { url: '/news', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.7' },
      { url: '/contact', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.6' }
    ];

    // 动态页面
    const dynamicPages = pages.map(page => ({
      url: `/${page.attributes.slug}`,
      lastmod: page.attributes.updatedAt,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // 文章页面
    const articlePages = articles.map(article => ({
      url: `/news/${article.attributes.slug}`,
      lastmod: article.attributes.updatedAt,
      changefreq: 'monthly',
      priority: '0.6'
    }));

    // 合并所有页面
    const allPages = [...staticPages, ...dynamicPages, ...articlePages];

    // 生成sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // 确保public目录存在
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 写入sitemap文件
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    
    console.log(`✅ Sitemap generated successfully with ${allPages.length} URLs`);
    
    // 生成robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseURL}/sitemap.xml`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ robots.txt generated successfully');

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap(); 