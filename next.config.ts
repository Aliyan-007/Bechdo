import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: false,
    workerThreads: false,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
    staticGenerationMinPagesPerWorker: 1000,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
