const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.jamendo.com', 'usercontent.jamendo.com'], 
  },
  experimental: {
    appDir: true,
    serverActions: true,
  },
}

module.exports = nextConfig;
