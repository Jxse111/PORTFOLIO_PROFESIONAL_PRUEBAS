import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de compilación estática
  output: 'standalone',
  
  // Extensiones de página permitidas
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  
  // Paquetes que necesitan ser transpilados
  transpilePackages: ["next-mdx-remote"],
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite todas las imágenes de HTTPS
      },
    ],
    // Optimización de imágenes
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configuración de SASS
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Configuración de redirecciones y reescrituras si es necesario
  async redirects() {
    return [];
  },
  
  // Configuración de reescrituras si es necesario
  async rewrites() {
    return [];
  },
};

// Exportar la configuración con MDX
export default withMDX(nextConfig);
