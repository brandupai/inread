/** @type {import('next').NextConfig} */
const longCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/fonts/:path*', headers: longCache },
      { source: '/demo/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
      { source: '/logo.svg', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
    ];
  },
};

export default nextConfig;
