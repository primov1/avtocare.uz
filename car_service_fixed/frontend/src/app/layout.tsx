import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google'; // Geist o'rniga Inter ishlatamiz
import {Providers} from './providers';
import './globals.css';

// Inter shriftini sozlash
const inter = Inter({subsets: ['latin'], variable: '--font-inter'});

export const metadata: Metadata = {
    title: {default: 'AutoCare Ecosystem', template: '%s | AutoCare'},
    description: 'Professional avtomobil xizmat ko\'rsatish platformasi',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#ffffff'},
        {media: '(prefers-color-scheme: dark)', color: '#030712'},
    ],
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="uz" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased font-sans`}>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}