/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placehold.co', 'via.placeholder.com'],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_STACKS_API_URL: process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so',
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST34EECPKYV8K5P8HBXZ2KDB895V3MCDTR4P4QMAA'
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },

};

module.exports = nextConfig;
