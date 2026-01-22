import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'E-commerce B2C',
  description: 'Plataforma de venta online',
};

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
