'use client';

import { Box, Text } from '@mantine/core';
import { IconArrowLeft, IconTruck, IconShieldCheck, IconCertificate } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useHomepageConfig } from '@/hooks/useSiteConfig';

const trustItems = [
  { icon: IconTruck, label: 'Envío gratis', desc: 'En compras +$50.000' },
  { icon: IconShieldCheck, label: 'Pago seguro', desc: '100% protegido' },
  { icon: IconCertificate, label: 'Garantía', desc: 'Devolución fácil' },
];

const orbVariants = {
  animate: (i: number) => ({
    y: [0, -20, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  }),
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: config } = useHomepageConfig();
  const storeName = config?.general?.storeName || 'Mi Tienda';

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '45% 55%',
        backgroundColor: 'var(--deep-ink)',
      }}
      className="auth-layout"
    >
      {/* Left Panel — Branding (hidden on mobile) */}
      <Box
        className="auth-left-panel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2.5rem',
          background: 'linear-gradient(160deg, #0F172A 0%, #1a1145 40%, #1e1b4b 70%, #0F172A 100%)',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating orbs */}
        {[
          { top: '12%', left: '15%', size: 80, opacity: 0.12 },
          { top: '65%', right: '10%', size: 120, opacity: 0.08 },
          { bottom: '15%', left: '25%', size: 60, opacity: 0.15 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={orbVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: orb.top,
              left: orb.left,
              right: (orb as { right?: string }).right,
              bottom: (orb as { bottom?: string }).bottom,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(124, 58, 237, ${orb.opacity + 0.1}) 0%, rgba(124, 58, 237, 0) 70%)`,
              border: '1px solid rgba(124, 58, 237, 0.1)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: 340,
          }}
        >
          <Link href={ROUTES.home} style={{ textDecoration: 'none' }}>
            <Text
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              {storeName}
            </Text>
          </Link>

          <Text
            size="md"
            mt="md"
            style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
          >
            Tu destino de compras premium con productos exclusivos y experiencia de lujo.
          </Text>

          {/* Trust badges */}
          <Box mt={40} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trustItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              >
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 18px',
                    background: 'var(--glass-white)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <item.icon size={20} style={{ color: 'var(--electric-orchid)', flexShrink: 0 }} />
                  <div>
                    <Text size="sm" fw={600} style={{ color: 'white' }}>
                      {item.label}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {item.desc}
                    </Text>
                  </div>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Neon border right (vertical separator) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 2,
            height: '100%',
            background: 'linear-gradient(180deg, transparent 0%, var(--electric-orchid) 50%, transparent 100%)',
            boxShadow: '0 0 20px 3px rgba(124, 58, 237, 0.4)',
          }}
        />
      </Box>

      {/* Right Panel — Form */}
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        {/* Mobile header (hidden on desktop) */}
        <Box
          className="auth-mobile-header"
          style={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid var(--border-glass)',
          }}
        >
          <Link
            href={ROUTES.home}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--glass-white)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <IconArrowLeft size={18} />
          </Link>
          <Link href={ROUTES.home} style={{ textDecoration: 'none' }}>
            <Text
              fw={700}
              size="lg"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'white',
                letterSpacing: '-0.5px',
              }}
            >
              {storeName}
            </Text>
          </Link>
        </Box>

        <Box style={{ width: '100%', maxWidth: 420 }}>
          {children}
        </Box>
      </Box>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .auth-layout {
            grid-template-columns: 1fr !important;
          }
          .auth-left-panel {
            display: none !important;
          }
          .auth-mobile-header {
            display: flex !important;
          }
        }
      `}</style>
    </Box>
  );
}
