
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // The `unoptimized` prop on the Image component is used instead
    // remotePatterns: [],
  },
   webpack: (config, { isServer }) => {
    // This is to fix a build error with Genkit
    config.externals.push('@opentelemetry/exporter-jaeger');
    // This is to allow dynamic require() for images in image-paths.ts
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;
