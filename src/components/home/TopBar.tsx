'use client';

import { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Group, Container, Skeleton } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

interface TopBarProps {
  storageKey?: string;
}

export function TopBar({ storageKey = 'topbar-dismissed' }: TopBarProps) {
  const [visible, setVisible] = useState(false);
  const { data: config, isLoading } = useHomepageConfig();

  const topbarConfig = config?.topbar;

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed && topbarConfig?.isVisible) {
      setVisible(true);
    }
  }, [storageKey, topbarConfig?.isVisible]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  // Don't show while loading or if not visible
  if (isLoading) {
    return null;
  }

  if (!visible || !topbarConfig?.isVisible) {
    return null;
  }

  return (
    <Box
      bg={topbarConfig.backgroundColor || 'dark.9'}
      py="xs"
      style={{
        color: topbarConfig.textColor || 'white',
      }}
    >
      <Container size="xl">
        <Group justify="center" gap="xs" pos="relative">
          <IconTruck size={18} style={{ color: topbarConfig.textColor || 'white' }} />
          <Text size="sm" c={topbarConfig.textColor || 'white'} fw={500}>
            {topbarConfig.message}
          </Text>
          <CloseButton
            pos="absolute"
            right={0}
            size="sm"
            variant="transparent"
            c={topbarConfig.textColor || 'white'}
            onClick={handleDismiss}
            aria-label="Cerrar anuncio"
          />
        </Group>
      </Container>
    </Box>
  );
}
