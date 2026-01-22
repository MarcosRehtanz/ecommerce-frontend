'use client';

import { Container, Group, Text, ThemeIcon, Box } from '@mantine/core';
import {
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconHeadset,
} from '@tabler/icons-react';

const proofs = [
  {
    icon: IconTruck,
    text: 'Envío en 24-48h',
  },
  {
    icon: IconRefresh,
    text: 'Devolución gratis 30 días',
  },
  {
    icon: IconShieldCheck,
    text: 'Pago 100% seguro',
  },
  {
    icon: IconHeadset,
    text: 'Soporte 24/7',
  },
];

export function SocialProof() {
  return (
    <Box bg="gray.0" py="md">
      <Container size="xl">
        <Group justify="center" gap={{ base: 'md', sm: 'xl', md: 50 }} wrap="wrap">
          {proofs.map((proof) => (
            <Group key={proof.text} gap="xs">
              <ThemeIcon variant="transparent" c="blue">
                <proof.icon size={20} />
              </ThemeIcon>
              <Text size="sm" fw={500} c="dark.6">
                {proof.text}
              </Text>
            </Group>
          ))}
        </Group>
      </Container>
    </Box>
  );
}
