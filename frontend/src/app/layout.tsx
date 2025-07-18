export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'QLearning',
    description: 'QLearning - AI-powered learning platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthKitProvider>{children}</AuthKitProvider>
                <Toaster />
            </body>
        </html>
    );
}
