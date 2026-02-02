'use client';

import { useState, useEffect } from 'react';
import { Box, Text, CloseButton, Group, Container } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { IconTruck, IconSparkles } from '@tabler/icons-react';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

interface TopBarProps {
  storageKey?: string;
}

export function TopBar({ storageKey = 'topbar-dismissed' }: TopBarProps) {
  const [visible, setVisible] = useState(false);
  const { data: config, isLoading } = useHomepageConfig();

  const topbarConfig = config?.topbar;

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed && topbarConfig?.isVisible) {
      setVisible(true);
    }
  }, [storageKey, topbarConfig?.isVisible]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  // Don't show while loading or if not visible
  if (isLoading) {
    return null;
  }

  if (!visible || !topbarConfig?.isVisible) {
    return null;
  }

  // Determine colors with fallbacks
  const bgColor = topbarConfig.backgroundColor || 'var(--electric-orchid)';
  const textColor = topbarConfig.textColor || 'white';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            py="xs"
            style={{
              background: bgColor,
              color: textColor,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle shimmer effect */}
            <Box
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s infinite linear',
                pointerEvents: 'none',
              }}
            />

            <Container size="xl">
              <Group justify="center" gap="sm" pos="relative">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <IconSparkles
                    size={16}
                    style={{ color: textColor, opacity: 0.8 }}
                  />
                </motion.div>

                <Text size="sm" c={textColor} fw={500}>
                  {topbarConfig.message}
                </Text>

                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <IconSparkles
                    size={16}
                    style={{ color: textColor, opacity: 0.8 }}
                  />
                </motion.div>

                <CloseButton
                  pos="absolute"
                  right={0}
                  size="sm"
                  variant="transparent"
                  c={textColor}
                  onClick={handleDismiss}
                  aria-label="Cerrar anuncio"
                  style={{
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                />
              </Group>
            </Container>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
