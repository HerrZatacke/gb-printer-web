import { execSync } from 'child_process';
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import { version } from './package.json';

const isDev = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: !isDev,
  openAnalyzer: false,
});

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

const branch = getGitBranch();
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,

  env: {
    NEXT_PUBLIC_BRANCH: branch,
    NEXT_PUBLIC_VERSION: version,
  },

  // build still requires webpack, so cannot use... :(
  // turbopack: {},

  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/i,
      use: 'raw-loader',
    });

    return config;
  },

  rewrites: async () => {
    return isDev ? [
      {
        source: '/wificonfig/:path*',
        destination: 'http://192.168.0.5/wificonfig/:path*',
      },
    ] : [];
  },
};

export default withBundleAnalyzer(nextConfig);
