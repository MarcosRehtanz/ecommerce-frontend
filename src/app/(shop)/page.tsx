import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Stack align="center" gap="xl" mt={100}>
        <Title order={1} ta="center">
          Bienvenido a E-commerce B2C
        </Title>
        <Text size="xl" c="dimmed" ta="center" maw={600}>
          Descubre nuestra amplia selección de productos de alta calidad.
          Compra fácil, rápido y seguro.
        </Text>
        <Group>
          <Button component={Link} href="/products" size="lg">
            Ver Productos
          </Button>
          <Button component={Link} href="/register" variant="outline" size="lg">
            Crear Cuenta
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
