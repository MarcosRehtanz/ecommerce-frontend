'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { IconMail, IconCheck } from '@tabler/icons-react';
import { useNewsletterSubscribe } from '@/hooks/useNewsletter';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { mutate: subscribe, isPending } = useNewsletterSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    subscribe(
      { email },
      {
        onSuccess: () => {
          setSubscribed(true);
          setEmail('');
        },
      }
    );
  };

  return (
    <Box bg="dark.8" py={60}>
      <Container size="md">
        <Stack align="center" gap="lg">
          <IconMail size={48} color="white" opacity={0.8} />

          <Title order={2} c="white" ta="center">
            Únete y obtén 10% OFF
          </Title>

          <Text c="white" opacity={0.8} ta="center" maw={500}>
            Suscríbete a nuestro newsletter y recibe ofertas exclusivas,
            novedades y un 10% de descuento en tu primera compra.
          </Text>

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 450 }}>
            <Group gap="sm" wrap="nowrap">
              <TextInput
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                size="md"
                radius="md"
                style={{ flex: 1 }}
                disabled={subscribed}
              />
              <Button
                type="submit"
                size="md"
                radius="md"
                loading={isPending}
                disabled={subscribed}
                leftSection={subscribed ? <IconCheck size={18} /> : undefined}
              >
                {subscribed ? '¡Suscrito!' : 'Suscribirme'}
              </Button>
            </Group>
          </form>

          <Text size="xs" c="dimmed" ta="center">
            Sin spam. Puedes darte de baja cuando quieras.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
