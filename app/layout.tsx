import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://the-portofolio.vercel.app'),
  title: 'Irga Andreansyah Setiawan — BilaNiumN1',
  description: 'Irga Andreansyah Setiawan is a student developer and systems builder in Lembang, Indonesia, creating useful web products, infrastructure, and community technology.',
  icons: {
    icon: '/irga-profile.jpg',
    shortcut: '/irga-profile.jpg',
    apple: '/irga-profile.jpg',
  },
  openGraph: {
    title: 'Irga Andreansyah Setiawan — BilaNiumN1',
    description: 'Student developer and systems builder creating useful products, infrastructure, and community technology.',
    url: '/',
    siteName: 'BilaNiumN1',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: '/irga-profile.jpg',
      width: 460,
      height: 460,
      alt: 'Portrait of Irga Andreansyah Setiawan',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Irga Andreansyah Setiawan — BilaNiumN1',
    description: 'Student developer and systems builder creating useful products, infrastructure, and community technology.',
    images: ['/irga-profile.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#261914',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
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
        {children}
      </body>
    </html>
  );
}
