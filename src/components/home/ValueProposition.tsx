'use client';

import { Container, Text, Box, Title } from '@mantine/core';
import { motion } from 'framer-motion';
import {
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconCreditCard,
} from '@tabler/icons-react';

const benefits = [
  {
    icon: IconTruck,
    title: 'Envío Express',
    description: 'Gratis en pedidos mayores a $50.000',
    color: 'var(--electric-orchid)',
    bgColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: 'rgba(124, 58, 237, 0.2)',
  },
  {
    icon: IconRefresh,
    title: 'Devolución Fácil',
    description: '30 días sin preguntas',
    color: 'var(--jade-mint)',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  {
    icon: IconShieldCheck,
    title: 'Pago 100% Seguro',
    description: 'Tus datos siempre protegidos',
    color: 'var(--jade-mint)',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  {
    icon: IconCreditCard,
    title: 'Pago en Cuotas',
    description: 'Hasta 12 meses sin intereses',
    color: 'var(--electric-orchid)',
    bgColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: 'rgba(124, 58, 237, 0.2)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Custom ease curve
const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutQuad,
    },
  },
};

export function ValueProposition() {
  return (
    <Box
      py={{ base: 60, md: 80 }}
      style={{ backgroundColor: 'var(--deep-ink)' }}
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
              color: 'var(--electric-orchid)',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Nuestra Promesa
          </Text>
          <Title
            order={2}
            c="white"
            fz={{ base: 28, md: 36 }}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ¿Por Qué Elegirnos?
          </Title>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 24,
          }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <Box
                p="xl"
                h="100%"
                style={{
                  background: 'var(--glass-white)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 20,
                  textAlign: 'center',
                }}
              >
                {/* Icon Container */}
                <Box
                  mx="auto"
                  mb="md"
                  p="md"
                  w={72}
                  h={72}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: benefit.bgColor,
                    border: `1px solid ${benefit.borderColor}`,
                    borderRadius: 16,
                  }}
                >
                  <benefit.icon
                    size={32}
                    style={{ color: benefit.color }}
                    stroke={1.5}
                  />
                </Box>

                {/* Title */}
                <Text
                  c="white"
                  fw={600}
                  size="lg"
                  mb="xs"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {benefit.title}
                </Text>

                {/* Description */}
                <Text c="white" opacity={0.6} size="sm">
                  {benefit.description}
                </Text>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Box>
  );
}
