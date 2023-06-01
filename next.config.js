// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['ghoshortho.com', 'localhost', 'dropboxusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.dropboxusercontent.com',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/welcome',
        permanent: true,
      },
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
});
