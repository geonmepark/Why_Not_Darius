import type { NextConfig } from 'next';

const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

const nextConfig: NextConfig = {
  output: isElectronBuild ? 'export' : undefined,
  trailingSlash: isElectronBuild ? true : undefined,
  images: {
    unoptimized: true, // DDragon CDN <img> 태그 사용 (next/image 미사용)
  },
};

export default nextConfig;
