'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Loader } from '@mantine/core';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requireAdmin && user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, requireAdmin, router, _hasHydrated]);

  // Show loading while hydrating or checking auth
  if (!_hasHydrated || !isAuthenticated) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return <>{children}</>;
}
