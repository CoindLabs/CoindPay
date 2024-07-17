/**
 * @type {import('next').NextConfig}
 */
const path = require('path')

const withPWA = require('next-pwa')({
  dest: 'public',
})

const nextConfig = withPWA({
  // 严格模式，以防止在useEffect中的方法被执行两次，https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  //https://nextjs.org/docs/api-reference/next/image#blurdataurl
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['ahooks', '@connect2ic/react', '@connect2ic/core'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    styledComponents: true,
    // removeConsole: {
    //   exclude: ['error'],
    // },
  },
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
    ]
  },
})

module.exports = nextConfig
