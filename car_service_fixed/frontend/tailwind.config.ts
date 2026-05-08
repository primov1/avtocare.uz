import type {Config} from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Brand colors
            colors: {
                brand: {
                    50: '#E1F5EE',
                    100: '#9FE1CB',
                    200: '#5DCAA5',
                    400: '#1D9E75',
                    600: '#0F6E56',
                    800: '#085041',
                    900: '#04342C',
                },
            },
            // Responsive breakpoints
            screens: {
                xs: '480px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
            },
            // Sidebar width token
            width: {
                sidebar: '220px',
            },
            // Font
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [],
};

export default config;
