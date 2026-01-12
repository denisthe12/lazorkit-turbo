/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем внешние домены для разработки (Ngrok)
  experimental: {
    allowedDevOrigins: [
      "localhost:3000",
      "*.ngrok-free.app", 
      "*.ngrok.io" 
    ],
  },
  // Наш старый фикс для глобальных переменных
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        global: 'globalThis',
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
};

export default nextConfig;