/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  distDir: 'dist',
  images: {
    unoptimized: true,
    domains: ['wonderful-serenity-47deffe3a2.strapiapp.com']
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  },
  i18n: {
    locales: ['en', 'zh-Hans'],
    defaultLocale: 'en',
    localeDetection: false,
  },
}

module.exports = nextConfig 