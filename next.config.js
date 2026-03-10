/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow reading data/ folder at runtime
  experimental: {
    serverComponentsExternalPackages: ['dgram'],
  },
}

module.exports = nextConfig
