/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Run on port 3001 to avoid conflict with backend (port 3000)
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig