import { execSync } from 'child_process';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { version, name, author, description, homepage } from './package.json';
import generateWebManifest from './scripts/generateWebManifest';

const isDev = process.env.NODE_ENV === 'development';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

const rewritesConfig = isDev ? {
  rewrites: async () => {
    return  [
      {
        source: '/wificonfig/:path*',
        destination: 'http://192.168.0.5/wificonfig/:path*',
      },
    ];
  },
} : {};

const branch = getGitBranch();

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const getNextConfig = async (): Promise<NextConfig> => {
  const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true,
    basePath,
    assetPrefix: basePath ? `${basePath}/` : '',

    env: {
      NEXT_PUBLIC_BRANCH: branch,
      NEXT_PUBLIC_VERSION: version,
      NEXT_PUBLIC_BASE_PATH: basePath || '',
      NEXT_PUBLIC_HOMEPAGE: homepage,
      NEXT_PUBLIC_MANIFEST_TAGS: await generateWebManifest({
        description,
        name,
        author,
        homepage,
        basePath,
        version,
      }),
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

    ...rewritesConfig,
  };

  return withNextIntl(nextConfig);
};

export default getNextConfig;
