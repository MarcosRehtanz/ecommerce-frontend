import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';
import { fetchHomepageConfig } from '@/lib/api/server';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchHomepageConfig();
  const general = config?.general;
  const storeName = general?.storeName || 'Mi Tienda';
  const description = general?.storeDescription || 'Encuentra los mejores productos con envío rápido, devoluciones gratuitas y pago seguro.';
  const titleSuffix = general?.titleSuffix || 'Tu tienda online de confianza';
  const keywords = general?.keywords;
  const faviconUrl = general?.faviconUrl;
  const ogImage = general?.ogImage;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
    title: {
      default: `${storeName} - ${titleSuffix}`,
      template: `%s | ${storeName}`,
    },
    description,
    ...(keywords && { keywords: keywords.split(',').map(k => k.trim()) }),
    ...(faviconUrl && {
      icons: {
        icon: faviconUrl,
        shortcut: faviconUrl,
        apple: faviconUrl,
      },
    }),
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: storeName,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: storeName }] }),
    },
    ...(ogImage && {
      twitter: {
        card: 'summary_large_image',
        title: `${storeName} - ${titleSuffix}`,
        description,
        images: [ogImage],
      },
    }),
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <ColorSchemeScript />
        {/* Clash Display from Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
