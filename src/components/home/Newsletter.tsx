'use client';

import { useState } from 'react';
import { Box, Container, Title, Text } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSparkles, IconCheck, IconArrowRight } from '@tabler/icons-react';
import { useNewsletterSubscribe } from '@/hooks/useNewsletter';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { mutate: subscribe, isPending } = useNewsletterSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    subscribe(
      { email },
      {
        onSuccess: () => {
          setSubscribed(true);
          setEmail('');
        },
      }
    );
  };

  return (
    <Box
      pos="relative"
      py={{ base: 80, md: 100 }}
      style={{
        background:
          'linear-gradient(135deg, var(--electric-orchid, #7C3AED) 0%, #5b21b6 50%, #4c1d95 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle pattern overlay */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <Container size="sm" pos="relative" style={{ zIndex: 1 }}>
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
              mb="xl"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 100,
              }}
            >
              <IconSparkles size={16} color="white" />
              <Text size="sm" fw={600} c="white">
                EXCLUSIVO PARA MIEMBROS
              </Text>
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Title
              order={2}
              c="white"
              fz={{ base: 32, sm: 40, md: 48 }}
              fw={600}
              mt="xl"
              mb="md"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Únete al Círculo Interior
            </Title>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text c="white" opacity={0.85} size="lg" mb="xl" maw={500} mx="auto">
              Recibe acceso anticipado a nuevos lanzamientos, ofertas exclusivas
              y un{' '}
              <Text component="span" fw={700} c="white">
                10% de descuento
              </Text>{' '}
              en tu primera compra.
            </Text>
          </motion.div>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Box
                    p="md"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                    }}
                  >
                    <IconCheck size={32} color="white" />
                  </Box>
                  <Text c="white" fw={600} size="lg">
                    ¡Bienvenido al círculo!
                  </Text>
                  <Text c="white" opacity={0.8} size="sm">
                    Revisa tu correo para confirmar tu suscripción.
                  </Text>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    maxWidth: 480,
                    margin: '0 auto',
                  }}
                >
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 12,
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Email Input */}
                    <motion.div
                      animate={{
                        boxShadow: isFocused
                          ? '0 0 0 2px rgba(255, 255, 255, 0.5)'
                          : '0 0 0 0px rgba(255, 255, 255, 0)',
                      }}
                      style={{
                        flex: '1 1 280px',
                        minWidth: 280,
                        borderRadius: 100,
                      }}
                    >
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        required
                        className="input-glass-dark"
                      />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        flex: '0 0 auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '18px 32px',
                        background: 'var(--deep-ink, #0F172A)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 100,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: isPending ? 'wait' : 'pointer',
                        opacity: isPending ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            width: 20,
                            height: 20,
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                          }}
                        />
                      ) : (
                        <>
                          Unirme
                          <IconArrowRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </Box>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust text */}
          {!subscribed && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Text c="white" opacity={0.5} size="sm" mt="xl">
                Sin spam. Cancela cuando quieras.
              </Text>
            </motion.div>
          )}

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              marginTop: 48,
              flexWrap: 'wrap',
            }}
          >
            {[
              '10% en primera compra',
              'Acceso anticipado',
              'Ofertas exclusivas',
            ].map((benefit, index) => (
              <Box
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Box
                  w={6}
                  h={6}
                  style={{
                    borderRadius: '50%',
                    background: 'white',
                    opacity: 0.6,
                  }}
                />
                <Text c="white" size="sm" opacity={0.8}>
                  {benefit}
                </Text>
              </Box>
            ))}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
