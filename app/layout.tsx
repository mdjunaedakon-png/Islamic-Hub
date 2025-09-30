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
  title: 'HasanaTV - Your Complete Islamic Resource',
  description: 'A comprehensive Islamic web application featuring Quran, Hadith, Islamic videos, and news.',
  keywords: 'islamic, quran, hadith, islamic videos, islamic news, muslim, islam',
  authors: [{ name: 'HasanaTV Team' }],
  openGraph: {
    title: 'HasanaTV - Your Complete Islamic Resource',
    description: 'A comprehensive Islamic web application featuring Quran, Hadith, Islamic videos, and news.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HasanaTV - Your Complete Islamic Resource',
    description: 'A comprehensive Islamic web application featuring Quran, Hadith, Islamic videos, and news.',
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
          <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-800 dark:to-gray-950">
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
