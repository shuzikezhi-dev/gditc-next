/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  images: {
    unoptimized: true,
    domains: ['wonderful-serenity-47deffe3a2.strapiapp.com']
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  }
}

module.exports = nextConfig 