import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*",
    "*.e2b.app",
    "*.e2b.dev",
    "localhost:3000",
    "127.0.0.1:3000",
    "0.0.0.0:3000",
    "3000-icqqp8xhgi9z9iaj1px4j.e2b.app",
  ],
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
