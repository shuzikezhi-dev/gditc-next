/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: ['wonderful-serenity-47deffe3a2.strapiapp.com']
  },
  env: {
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  },
  experimental: {
    images: {
      unoptimized: true
    }
  }
}

module.exports = nextConfig 