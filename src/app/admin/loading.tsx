import { Container, Skeleton, Stack, Group } from '@mantine/core';

export default function AdminLoading() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Skeleton height={40} width={250} />
          <Skeleton height={40} width={150} />
        </Group>
        <Skeleton height={60} radius="md" />
        <Stack gap="sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={60} radius="md" />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
