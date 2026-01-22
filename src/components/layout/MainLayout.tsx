'use client';

import { AppShell } from '@mantine/core';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
