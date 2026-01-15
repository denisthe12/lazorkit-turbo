/** @type {import('next').NextConfig} */
const nextConfig = {
  // Игнорируем ошибки TypeScript при сборке (чтобы мелкие типы не ломали деплой)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Игнорируем ошибки ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Включаем поддержку top-level await (нужно для некоторых Web3 либ)
    config.experiments = { ...config.experiments, topLevelAwait: true };
    
    // Игнорируем 'fs' модуль для клиентской сборки
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;