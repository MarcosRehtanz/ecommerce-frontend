'use client';

import { Box, Container, Title, Text, Skeleton } from '@mantine/core';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconArrowRight, IconBolt } from '@tabler/icons-react';
import { useHomepageConfig } from '@/hooks/useSiteConfig';
import { CountdownTimer } from './CountdownTimer';

// Default values - set a date 3 days from now for demo
const getDefaultEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  date.setHours(23, 59, 59, 999);
  return date;
};

const defaults = {
  title: 'Hasta 50% de Descuento',
  subtitle: 'OFERTA POR TIEMPO LIMITADO',
  description: 'La oferta termina en:',
  buttonText: 'Comprar Ahora',
  buttonLink: '/products?onSale=true',
  endDate: getDefaultEndDate(),
};

export function SpecialOffer() {
  const { data: config, isLoading } = useHomepageConfig();
  const offerConfig = config?.['special-offer'];

  // Use config values or defaults
  const title = offerConfig?.title || defaults.title;
  const subtitle = offerConfig?.subtitle || defaults.subtitle;
  const description = offerConfig?.description || defaults.description;
  const buttonText = offerConfig?.buttonText || defaults.buttonText;
  const buttonLink = offerConfig?.buttonLink || defaults.buttonLink;
  const endDate = offerConfig?.endDate
    ? new Date(offerConfig.endDate)
    : defaults.endDate;

  // Don't render if explicitly set to not visible
  if (offerConfig && !offerConfig.isVisible) {
    return null;
  }

  // Don't render if offer has expired
  if (endDate < new Date()) {
    return null;
  }

  if (isLoading) {
    return (
      <Box py="xl" style={{ backgroundColor: 'var(--deep-ink, #0F172A)' }}>
        <Container size="xl">
          <Skeleton height={300} radius="lg" />
        </Container>
      </Box>
    );
  }

  return (
    <Box
      pos="relative"
      py={{ base: 60, md: 80 }}
      style={{
        background: 'linear-gradient(135deg, var(--deep-ink, #0F172A) 0%, #1a1035 50%, var(--deep-ink, #0F172A) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated radial glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '150%',
          background:
            'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.25) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Neon border glow - top */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        h={2}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--electric-orchid, #7C3AED) 50%, transparent 100%)',
          boxShadow: '0 0 30px 5px rgba(124, 58, 237, 0.6)',
        }}
      />

      {/* Neon border glow - bottom */}
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        h={2}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--electric-orchid, #7C3AED) 50%, transparent 100%)',
          boxShadow: '0 0 30px 5px rgba(124, 58, 237, 0.6)',
        }}
      />

      {/* Decorative floating orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.1)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.1)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container size="lg" pos="relative" style={{ zIndex: 1 }}>
        <Box ta="center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="span"
              px="lg"
              py="xs"
              mb="lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.5)',
                borderRadius: 100,
              }}
            >
              <IconBolt
                size={16}
                style={{ color: 'var(--electric-orchid, #7C3AED)' }}
              />
              <Text
                size="sm"
                fw={600}
                style={{ color: 'var(--electric-orchid, #7C3AED)' }}
              >
                {subtitle}
              </Text>
            </Box>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Title
              order={2}
              c="white"
              fz={{ base: 36, sm: 48, md: 56 }}
              fw={600}
              mt="lg"
              mb="md"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </Title>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text c="white" opacity={0.6} size="lg" mb="xl">
              {description}
            </Text>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginBottom: 40 }}
          >
            <CountdownTimer endDate={endDate} variant="neon" />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href={buttonLink} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '18px 40px',
                  background: 'var(--electric-orchid, #7C3AED)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(124, 58, 237, 0.5)',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 0 60px rgba(124, 58, 237, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 0 40px rgba(124, 58, 237, 0.5)';
                }}
              >
                {buttonText}
                <IconArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Text c="white" opacity={0.4} size="sm" mt="xl">
              Envío gratis en pedidos mayores a $50.000
            </Text>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
