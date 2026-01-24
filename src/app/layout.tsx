import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';
import { fetchHomepageConfig } from '@/lib/api/server';

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchHomepageConfig();
  const storeName = config?.general?.storeName || 'Mi Tienda';
  const description = config?.general?.storeDescription || 'Encuentra los mejores productos con envío rápido, devoluciones gratuitas y pago seguro.';

  return {
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
    <html lang="es">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
