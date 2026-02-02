'use client';

import { Container, Title, Text, Button, Stack, Paper } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="lg" mt={100}>
        <IconAlertTriangle size={64} color="var(--mantine-color-red-6)" />
        <Title order={1} ta="center">
          Algo salió mal
        </Title>
        <Text c="dimmed" ta="center" maw={500}>
          Ocurrió un error inesperado. Por favor, intenta nuevamente.
        </Text>
        <Paper withBorder p="md" bg="gray.0" maw={400} w="100%">
          <Text size="xs" c="dimmed" ff="monospace" lineClamp={3}>
            {error.message}
          </Text>
        </Paper>
        <Button onClick={reset} size="md">
          Intentar de nuevo
        </Button>
      </Stack>
    </Container>
  );
}
