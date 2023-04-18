/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static1.cbrimages.com',
      }
    ]
  }
}

module.exports = nextConfig
