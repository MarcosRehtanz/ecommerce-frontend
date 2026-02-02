'use client';

import { useRef } from 'react';
import { Box, Container, Text, Skeleton } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

// Default values
const defaults = {
  title: 'Estilo que Define tu Esencia',
  subtitle:
    'Descubre piezas exclusivas seleccionadas para quienes buscan lo extraordinario.',
  primaryButtonText: 'Explorar Coleccin',
  primaryButtonLink: '/products',
  secondaryButtonText: 'Novedades',
  secondaryButtonLink: '/products?sort=newest',
  heroImage: '/hero-product.svg',
};

// Custom ease curve
const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: easeOutQuad,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(20px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: easeOutQuad,
    },
  },
};

export function HeroSection() {
  const { data: config, isLoading } = useHomepageConfig();
  const heroConfig = config?.hero;
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-5, 5]),
    springConfig
  );

  // Use config values or defaults
  const title = heroConfig?.title || defaults.title;
  const subtitle = heroConfig?.subtitle || defaults.subtitle;
  const primaryButtonText =
    heroConfig?.primaryButtonText || defaults.primaryButtonText;
  const primaryButtonLink =
    heroConfig?.primaryButtonLink || defaults.primaryButtonLink;
  const secondaryButtonText =
    heroConfig?.secondaryButtonText || defaults.secondaryButtonText;
  const secondaryButtonLink =
    heroConfig?.secondaryButtonLink || defaults.secondaryButtonLink;
  const heroImage = heroConfig?.backgroundImage || defaults.heroImage;

  // Don't render if explicitly set to not visible
  if (heroConfig && !heroConfig.isVisible) {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Box
      ref={containerRef}
      pos="relative"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--deep-ink)',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radial gradient backdrop */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative circles */}
      <Box
        pos="absolute"
        top={-100}
        right={-100}
        w={400}
        h={400}
        style={{
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.08)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        pos="absolute"
        bottom={-50}
        left={-50}
        w={300}
        h={300}
        style={{
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.05)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Container size="xl" h="100vh" pos="relative" style={{ zIndex: 2 }}>
        <Box
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            height: '100%',
            gap: '2rem',
          }}
        >
          {/* Text Content */}
          {isLoading ? (
            <Box>
              <Skeleton height={60} width="80%" mb="md" />
              <Skeleton height={80} width="90%" mb="lg" />
              <Skeleton height={30} width="70%" mb="xl" />
              <Skeleton height={50} width={200} radius="xl" />
            </Box>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ maxWidth: 600 }}
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <Box
                  component="span"
                  px="md"
                  py={6}
                  mb="lg"
                  style={{
                    display: 'inline-block',
                    background: 'rgba(124, 58, 237, 0.15)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: 100,
                    color: 'var(--electric-orchid)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Nueva Coleccin 2025
                </Box>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: 'white',
                  margin: '0 0 1.5rem 0',
                }}
              >
                {title}
              </motion.h1>

              {/* Subtitle */}
              <motion.div variants={itemVariants}>
                <Text
                  size="xl"
                  c="white"
                  opacity={0.7}
                  mb="xl"
                  maw={500}
                  lh={1.6}
                >
                  {subtitle}
                </Text>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                {/* Primary CTA */}
                <Link href={primaryButtonLink} style={{ textDecoration: 'none' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'var(--electric-orchid)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 100,
                      fontSize: 16,
                      fontWeight: 500,
                      cursor: 'pointer',
                      boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
                      transition: 'box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 0 60px rgba(124, 58, 237, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 0 40px rgba(124, 58, 237, 0.4)';
                    }}
                  >
                    {primaryButtonText}
                    <IconArrowRight size={18} />
                  </motion.button>
                </Link>

                {/* Secondary CTA */}
                {secondaryButtonText && (
                  <Link
                    href={secondaryButtonLink}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 100,
                        fontSize: 16,
                        fontWeight: 500,
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.2)';
                      }}
                    >
                      {secondaryButtonText}
                    </motion.button>
                  </Link>
                )}
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  marginTop: '3rem',
                  opacity: 0.6,
                }}
              >
                <Box>
                  <Text c="white" fw={600} fz={24} lh={1}>
                    10K+
                  </Text>
                  <Text c="white" fz="sm" opacity={0.7}>
                    Clientes felices
                  </Text>
                </Box>
                <Box>
                  <Text c="white" fw={600} fz={24} lh={1}>
                    4.9
                  </Text>
                  <Text c="white" fz="sm" opacity={0.7}>
                    Calificacin
                  </Text>
                </Box>
                <Box>
                  <Text c="white" fw={600} fz={24} lh={1}>
                    24h
                  </Text>
                  <Text c="white" fz="sm" opacity={0.7}>
                    Envo express
                  </Text>
                </Box>
              </motion.div>
            </motion.div>
          )}

          {/* Floating Product Image with Parallax */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.div
              style={{
                x,
                y,
                rotateY,
                position: 'relative',
                width: '100%',
                maxWidth: 500,
                aspectRatio: '1',
              }}
            >
              {/* Glow behind product */}
              <Box
                pos="absolute"
                top="50%"
                left="50%"
                w="80%"
                h="80%"
                style={{
                  transform: 'translate(-50%, -50%)',
                  background:
                    'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Product image */}
              <Box
                pos="relative"
                w="100%"
                h="100%"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={heroImage}
                  alt="Featured Product"
                  width={500}
                  height={500}
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                  }}
                  priority
                  onError={(e) => {
                    // Fallback to placeholder if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </Box>

              {/* Floating badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: '5%',
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 16,
                }}
              >
                <Text c="white" fw={600} fz="sm">
                  -40% OFF
                </Text>
              </motion.div>

              {/* Price tag */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                style={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '0%',
                  padding: '1rem 1.5rem',
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
              >
                <Text c="dimmed" fz="xs" td="line-through">
                  $299.00
                </Text>
                <Text
                  fw={700}
                  fz="xl"
                  style={{ color: 'var(--electric-orchid)' }}
                >
                  $179.00
                </Text>
              </motion.div>
            </motion.div>
          </motion.div>
        </Box>
      </Container>

      {/* Bottom gradient fade */}
      <Box
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        h={100}
        style={{
          background:
            'linear-gradient(to top, var(--deep-ink) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

    </Box>
  );
}
