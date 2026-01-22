'use client';

import { Container, SimpleGrid, Group, ThemeIcon, Text, Box, Title } from '@mantine/core';
import {
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconCreditCard,
} from '@tabler/icons-react';

const benefits = [
  {
    icon: IconTruck,
    title: 'Envío Gratis',
    description: 'En pedidos mayores a $999',
    color: 'blue',
  },
  {
    icon: IconRefresh,
    title: 'Devolución Fácil',
    description: '30 días sin preguntas',
    color: 'green',
  },
  {
    icon: IconShieldCheck,
    title: 'Pago Seguro',
    description: 'Tus datos 100% protegidos',
    color: 'violet',
  },
  {
    icon: IconCreditCard,
    title: 'Pago en Cuotas',
    description: 'Hasta 12 meses sin intereses',
    color: 'orange',
  },
];

export function ValueProposition() {
  return (
    <Box bg="gray.0" py="xl">
      <Container size="xl">
        <Title order={2} ta="center" mb="xl">
          ¿Por qué elegirnos?
        </Title>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="xl">
          {benefits.map((benefit) => (
            <Group key={benefit.title} align="flex-start" wrap="nowrap">
              <ThemeIcon
                size={50}
                radius="md"
                variant="light"
                color={benefit.color}
              >
                <benefit.icon size={26} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="md">
                  {benefit.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {benefit.description}
                </Text>
              </div>
            </Group>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
