'use client';

import { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Group, Container } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';

interface TopBarProps {
  message?: string;
  storageKey?: string;
}

export function TopBar({
  message = "ENVÍO GRATIS en pedidos mayores a $999 | Solo por tiempo limitado",
  storageKey = 'topbar-dismissed'
}: TopBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) {
      setVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!visible) return null;

  return (
    <Box bg="dark.9" py="xs">
      <Container size="xl">
        <Group justify="center" gap="xs" pos="relative">
          <IconTruck size={18} color="white" />
          <Text size="sm" c="white" fw={500}>
            {message}
          </Text>
          <CloseButton
            pos="absolute"
            right={0}
            size="sm"
            variant="transparent"
            c="white"
            onClick={handleDismiss}
            aria-label="Cerrar anuncio"
          />
        </Group>
      </Container>
    </Box>
  );
}
