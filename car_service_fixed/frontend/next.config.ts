import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    // Proxy /api/* → backend in development (avoids CORS)
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
            },
        ];
    },
    // Allow images from any domain (adjust to your CDN in production)
    images: {
        remotePatterns: [{protocol: 'https', hostname: '**'}],
    },
};

export default nextConfig;
