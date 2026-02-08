'use client';

import { Box, Container, Title, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconQuote, IconStarFilled, IconCheck } from '@tabler/icons-react';
import { TestimonialsConfig } from '@/types';

const DEFAULT_TESTIMONIALS = [
  {
    name: 'María García',
    rating: 5,
    text: 'La calidad superó mis expectativas. El empaque fue impecable y llegó en tiempo récord. Una experiencia de compra premium.',
    product: 'Auriculares Pro X',
  },
  {
    name: 'Carlos Rodríguez',
    rating: 5,
    text: 'Atención al cliente excepcional. Resolvieron mi duda en minutos. La calidad del producto es exactamente como se muestra.',
    product: 'Smartwatch Elite',
  },
  {
    name: 'Ana Martínez',
    rating: 5,
    text: 'Productos premium a precios justos. La experiencia de compra fue fluida y sin complicaciones. Definitivamente regresaré.',
    product: 'Bolso Signature',
  },
];

const DEFAULT_METRICS = {
  averageRating: '4.9',
  totalCustomers: '10K+',
  recommendRate: '98%',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// Custom ease curve
const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutQuad,
    },
  },
};

interface TestimonialItem {
  name: string;
  rating: number;
  text: string;
  product: string;
}

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <Box style={{ display: 'flex', gap: 4 }}>
      {[...Array(maxRating)].map((_, i) => (
        <IconStarFilled
          key={i}
          size={18}
          style={{
            color:
              i < rating
                ? 'var(--jade-mint, #10B981)'
                : 'rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
    </Box>
  );
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      style={{ height: '100%' }}
    >
      <Box
        p="xl"
        h="100%"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient accent */}
        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          h={1}
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--jade-mint, #10B981) 50%, transparent 100%)',
            opacity: 0.5,
          }}
        />

        {/* Quote Icon */}
        <Box mb="md">
          <IconQuote
            size={36}
            style={{
              color: 'var(--electric-orchid, #7C3AED)',
              opacity: 0.3,
            }}
          />
        </Box>

        {/* Star Rating */}
        <Box mb="md">
          <StarRating rating={testimonial.rating} />
        </Box>

        {/* Quote Text */}
        <Text
          c="white"
          size="md"
          lh={1.7}
          mb="xl"
          style={{
            flex: 1,
            opacity: 0.85,
          }}
        >
          &ldquo;{testimonial.text}&rdquo;
        </Text>

        {/* Product purchased */}
        <Text c="white" size="xs" opacity={0.4} mb="md">
          Compró: {testimonial.product}
        </Text>

        {/* Author Section */}
        <Box
          pt="md"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Avatar & Name */}
          <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Box
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                fw={600}
                size="sm"
                style={{ color: 'var(--electric-orchid, #7C3AED)' }}
              >
                {getInitials(testimonial.name)}
              </Text>
            </Box>
            <Text c="white" fw={500} size="sm">
              {testimonial.name}
            </Text>
          </Box>

          {/* Verified Badge */}
          <Box
            px="sm"
            py={6}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 100,
            }}
          >
            <IconCheck
              size={14}
              style={{ color: 'var(--jade-mint, #10B981)' }}
            />
            <Text
              size="xs"
              fw={500}
              style={{ color: 'var(--jade-mint, #10B981)' }}
            >
              Verificado
            </Text>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

interface TestimonialsProps {
  config?: TestimonialsConfig;
}

export function Testimonials({ config: testimonialsConfig }: TestimonialsProps) {

  if (testimonialsConfig?.isVisible === false) return null;

  // Content fields — only show if explicitly configured (no fake testimonials)
  const items = testimonialsConfig?.items;
  if (!items || items.length === 0) return null;

  // Structural defaults (safe to show)
  const sectionLabel = testimonialsConfig?.sectionLabel || 'Testimonios';
  const title = testimonialsConfig?.title || 'Lo Que Dicen Nuestros Clientes';
  const subtitle = testimonialsConfig?.subtitle || '+10,000 clientes satisfechos nos respaldan';

  // Metrics — only show if configured
  const metrics = testimonialsConfig?.metrics;
  const averageRatingLabel = metrics?.averageRatingLabel || 'Calificación promedio';
  const totalCustomersLabel = metrics?.totalCustomersLabel || 'Clientes felices';
  const recommendRateLabel = metrics?.recommendRateLabel || 'Recomendarían';

  return (
    <Box
      py={{ base: 60, md: 80 }}
      style={{ backgroundColor: 'var(--deep-ink, #0F172A)' }}
    >
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <Text
            size="sm"
            fw={600}
            mb="xs"
            style={{
              color: 'var(--electric-orchid, #7C3AED)',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {sectionLabel}
          </Text>
          <Title
            order={2}
            c="white"
            fz={{ base: 28, md: 36 }}
            mb="sm"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </Title>
          <Text c="white" opacity={0.5} size="lg">
            {subtitle}
          </Text>
        </motion.div>

        {/* Testimonial Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 24,
          }}
        >
          {items.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </motion.div>

        {/* Trust Metrics — only if configured */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 48,
              marginTop: 64,
              flexWrap: 'wrap',
            }}
          >
            <Box ta="center">
              <Text
                c="white"
                fz={36}
                fw={700}
                lh={1}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {metrics.averageRating}
              </Text>
              <Box
                mt="xs"
                style={{ display: 'flex', justifyContent: 'center', gap: 2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled
                    key={i}
                    size={14}
                    style={{ color: 'var(--jade-mint, #10B981)' }}
                  />
                ))}
              </Box>
              <Text c="white" size="sm" opacity={0.5} mt="xs">
                {averageRatingLabel}
              </Text>
            </Box>

            <Box
              style={{
                width: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                alignSelf: 'stretch',
              }}
            />

            <Box ta="center">
              <Text
                c="white"
                fz={36}
                fw={700}
                lh={1}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {metrics.totalCustomers}
              </Text>
              <Text c="white" size="sm" opacity={0.5} mt="sm">
                {totalCustomersLabel}
              </Text>
            </Box>

            <Box
              style={{
                width: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                alignSelf: 'stretch',
              }}
            />

            <Box ta="center">
              <Text
                c="white"
                fz={36}
                fw={700}
                lh={1}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {metrics.recommendRate}
              </Text>
              <Text c="white" size="sm" opacity={0.5} mt="sm">
                {recommendRateLabel}
              </Text>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
