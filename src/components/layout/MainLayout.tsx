'use client';

import { AppShell } from '@mantine/core';
import { Header } from './Header';
import { Footer } from './Footer';
import { TopBar } from '../home/TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
}

export function MainLayout({ children, showTopBar = true }: MainLayoutProps) {
  return (
    <AppShell
      header={{ height: showTopBar ? 100 : 60 }}
      styles={{
        main: {
          backgroundColor: 'var(--deep-ink)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
      }}
    >
      <AppShell.Header
        style={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        {showTopBar && <TopBar />}
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
