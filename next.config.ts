
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
<<<<<<< HEAD
  },
   webpack: (config, { isServer }) => {
    // This is to fix a build error with Genkit
    config.externals.push('@opentelemetry/exporter-jaeger');
    return config;
=======
>>>>>>> 13f825aea5d340d73ac76a729b4d394c5580accd
  },
};

export default nextConfig;
