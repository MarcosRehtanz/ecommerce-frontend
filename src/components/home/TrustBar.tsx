'use client';

import { Box, Container, Group, Text } from '@mantine/core';
import {
  IconTruckDelivery,
  IconShieldCheck,
  IconHeadset,
} from '@tabler/icons-react';

const trustItems = [
  {
    icon: IconTruckDelivery,
    text: 'Envo Express 24-48h',
  },
  {
    icon: IconShieldCheck,
    text: 'Pago 100% Seguro',
  },
  {
    icon: IconHeadset,
    text: 'Soporte Premium 24/7',
  },
];

export function TrustBar() {
  return (
    <Box
      py="md"
      mt={-40}
      pos="relative"
      style={{ zIndex: 10 }}
    >
      <Container size="lg">
        <Box
          px="xl"
          py="lg"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Group justify="space-between" gap="xl" wrap="wrap">
            {trustItems.map((item, index) => (
              <Group
                key={index}
                gap="sm"
                wrap="nowrap"
                style={{ flex: '1 1 auto', justifyContent: 'center' }}
              >
                <Box
                  p={8}
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 8,
                  }}
                >
                  <item.icon
                    size={22}
                    style={{ color: 'var(--jade-mint, #10B981)' }}
                    stroke={1.5}
                  />
                </Box>
                <Text
                  c="white"
                  size="sm"
                  fw={500}
                  style={{ opacity: 0.9 }}
                >
                  {item.text}
                </Text>
              </Group>
            ))}
          </Group>
        </Box>
      </Container>
    </Box>
  );
}
