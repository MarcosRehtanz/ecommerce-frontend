import { Container, Title, Text, Button, Stack } from '@mantine/core';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function NotFound() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md" mt={100}>
        <Title order={1}>404</Title>
        <Text size="xl" c="dimmed">
          Página no encontrada
        </Text>
        <Button component={Link} href={ROUTES.home}>
          Volver al inicio
        </Button>
      </Stack>
    </Container>
  );
}
