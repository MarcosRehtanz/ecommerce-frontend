'use client';

import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Overlay,
  Skeleton,
} from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

// Default values
const defaults = {
  title: 'Descubre tu estilo único',
  subtitle: 'Productos de alta calidad seleccionados para ti. Envío gratis en tu primera compra.',
  primaryButtonText: 'Ver Colección',
  primaryButtonLink: '/products',
  secondaryButtonText: 'Novedades',
  secondaryButtonLink: '/products?sort=newest',
  backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
};

export function HeroSection() {
  const { data: config, isLoading } = useHomepageConfig();
  const heroConfig = config?.hero;

  // Use config values or defaults
  const title = heroConfig?.title || defaults.title;
  const subtitle = heroConfig?.subtitle || defaults.subtitle;
  const primaryButtonText = heroConfig?.primaryButtonText || defaults.primaryButtonText;
  const primaryButtonLink = heroConfig?.primaryButtonLink || defaults.primaryButtonLink;
  const secondaryButtonText = heroConfig?.secondaryButtonText || defaults.secondaryButtonText;
  const secondaryButtonLink = heroConfig?.secondaryButtonLink || defaults.secondaryButtonLink;
  const backgroundImage = heroConfig?.backgroundImage || defaults.backgroundImage;

  // Don't render if explicitly set to not visible
  if (heroConfig && !heroConfig.isVisible) {
    return null;
  }

  return (
    <Box
      pos="relative"
      h={{ base: 400, sm: 500, md: 600 }}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%)"
        opacity={1}
        zIndex={1}
      />

      <Container size="xl" h="100%" pos="relative" style={{ zIndex: 2 }}>
        <Stack
          justify="center"
          h="100%"
          maw={600}
          gap="lg"
        >
          {isLoading ? (
            <>
              <Skeleton height={50} width="80%" />
              <Skeleton height={30} width="60%" />
              <Group mt="md">
                <Skeleton height={44} width={150} radius="md" />
                <Skeleton height={44} width={120} radius="md" />
              </Group>
            </>
          ) : (
            <>
              <Title
                order={1}
                c="white"
                fz={{ base: 32, sm: 42, md: 52 }}
                fw={800}
                lh={1.1}
              >
                {title}
              </Title>

              <Text
                c="white"
                fz={{ base: 'md', sm: 'lg', md: 'xl' }}
                opacity={0.9}
              >
                {subtitle}
              </Text>

              <Group mt="md">
                <Button
                  component={Link}
                  href={primaryButtonLink}
                  size="lg"
                  radius="md"
                  rightSection={<IconArrowRight size={18} />}
                >
                  {primaryButtonText}
                </Button>
                {secondaryButtonText && (
                  <Button
                    component={Link}
                    href={secondaryButtonLink}
                    size="lg"
                    radius="md"
                    variant="white"
                    c="dark"
                  >
                    {secondaryButtonText}
                  </Button>
                )}
              </Group>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
