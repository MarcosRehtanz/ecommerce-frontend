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
  const storeName = config?.general?.storeName || 'Mi Tienda';
  const description = config?.general?.storeDescription || 'Encuentra los mejores productos con envío rápido, devoluciones gratuitas y pago seguro.';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
    title: {
      default: `${storeName} - Tu tienda online de confianza`,
      template: `%s | ${storeName}`,
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: storeName,
      description,
    },
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
