/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static1.cbrimages.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com'
      }
    ]
  }
}

module.exports = nextConfig
