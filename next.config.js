/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: [
      'wonderful-serenity-47deffe3a2.strapiapp.com',
      'cdn.gditc.org'  // 添加CDN域名
    ]
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    NEXT_PUBLIC_CDN_URL: 'https://cdn.gditc.org'
  },
  // 静态导出模式下不支持i18n，需要手动实现
  // i18n: {
  //   locales: ['en', 'zh-Hans'],
  //   defaultLocale: 'en',
  //   localeDetection: false,
  // },
}

module.exports = nextConfig 