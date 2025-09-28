import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoSSR from '@/components/NoSSR';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://islamichub-sigma.vercel.app'),
  title: 'Islamic Hub - Your Complete Islamic Resource',
  description: 'A comprehensive Islamic web application featuring Quran, Hadith, Islamic videos, news, and products.',
  keywords: 'islamic, quran, hadith, islamic videos, islamic news, islamic products, muslim, islam',
  authors: [{ name: 'Islamic Hub Team' }],
  openGraph: {
    title: 'Islamic Hub - Your Complete Islamic Resource',
    description: 'A comprehensive Islamic web application featuring Quran, Hadith, Islamic videos, news, and products.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Islamic Hub - Your Complete Islamic Resource',
    description: 'A comprehensive Islamic web application featuring Quran, Hadith, Islamic videos, news, and products.',
  },
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
            <NoSSR>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </NoSSR>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
