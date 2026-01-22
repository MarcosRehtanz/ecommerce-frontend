'use client';

import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Paper,
} from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight, IconFlame } from '@tabler/icons-react';

export function SpecialOffer() {
  return (
    <Box py="xl">
      <Container size="xl">
        <Paper
          radius="lg"
          p={{ base: 'lg', md: 'xl' }}
          style={{
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Decorative elements */}
          <Box
            pos="absolute"
            top={-50}
            right={-50}
            w={200}
            h={200}
            style={{
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box
            pos="absolute"
            bottom={-30}
            left={-30}
            w={150}
            h={150}
            style={{
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />

          <Grid align="center" gutter="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                <Group gap="xs">
                  <IconFlame size={28} color="white" />
                  <Text c="white" fw={600} size="lg">
                    OFERTA ESPECIAL
                  </Text>
                </Group>

                <Title order={2} c="white" fz={{ base: 28, md: 36 }}>
                  Hasta 40% de descuento en productos seleccionados
                </Title>

                <Text c="white" opacity={0.9} size="lg">
                  Aprovecha nuestra oferta de temporada. Stock limitado, ¡no te lo pierdas!
                </Text>

                <Group mt="md">
                  <Button
                    component={Link}
                    href="/products?onSale=true"
                    size="lg"
                    radius="md"
                    color="white"
                    c="violet"
                    rightSection={<IconArrowRight size={18} />}
                  >
                    Ver Ofertas
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box ta="center">
                {/* Countdown or promo image could go here */}
                <Text c="white" fz={72} fw={900} lh={1}>
                  -40%
                </Text>
                <Text c="white" size="xl" fw={500}>
                  En toda la tienda
                </Text>
              </Box>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
