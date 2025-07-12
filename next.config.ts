
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
    unoptimized: true,
    remotePatterns: [],
  },
   webpack: (config, { isServer }) => {
    // This is to fix a build error with Genkit
    config.externals.push('@opentelemetry/exporter-jaeger');
    return config;
  },
};

export default nextConfig;
