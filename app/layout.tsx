import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeartCursor from '@/components/HeartCursor';
import MusicPlayer from '@/components/MusicPlayer';
import RomanticBackground from '@/components/RomanticBackground';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} antialiased`}
      >
        <RomanticBackground />
        <HeartCursor />
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <MusicPlayer />
        <Footer />
      </body>
    </html>
  );
}
