'use client';

import { useEffect, useState } from 'react';
import { Box, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  endDate: Date;
  onExpire?: () => void;
  variant?: 'default' | 'neon';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: Date): TimeLeft | null {
  const difference = endDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

interface TimeBoxProps {
  value: number;
  label: string;
  variant: 'default' | 'neon';
}

function TimeBox({ value, label, variant }: TimeBoxProps) {
  const isNeon = variant === 'neon';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        px={{ base: 'sm', md: 'lg' }}
        py={{ base: 'sm', md: 'md' }}
        style={{
          background: isNeon
            ? 'rgba(255, 255, 255, 0.05)'
            : 'white',
          backdropFilter: isNeon ? 'blur(16px)' : undefined,
          WebkitBackdropFilter: isNeon ? 'blur(16px)' : undefined,
          border: isNeon
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : 'none',
          borderRadius: 16,
          minWidth: isNeon ? 80 : 60,
          textAlign: 'center',
        }}
      >
        <Text
          ff="monospace"
          fw={700}
          fz={{ base: 28, md: 36 }}
          lh={1}
          style={{
            color: isNeon ? 'white' : 'var(--electric-orchid, #7C3AED)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value.toString().padStart(2, '0')}
        </Text>
        <Text
          size="xs"
          fw={500}
          mt={8}
          tt="uppercase"
          style={{
            color: isNeon
              ? 'rgba(255, 255, 255, 0.5)'
              : 'var(--electric-orchid, #7C3AED)',
            letterSpacing: 1,
          }}
        >
          {label}
        </Text>
      </Box>
    </motion.div>
  );
}

// Separator component for neon variant
function TimeSeparator() {
  return (
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '0 4px',
      }}
    >
      <Box
        w={6}
        h={6}
        style={{
          background: 'var(--electric-orchid, #7C3AED)',
          borderRadius: '50%',
          boxShadow: '0 0 10px var(--electric-orchid, #7C3AED)',
        }}
      />
      <Box
        w={6}
        h={6}
        style={{
          background: 'var(--electric-orchid, #7C3AED)',
          borderRadius: '50%',
          boxShadow: '0 0 10px var(--electric-orchid, #7C3AED)',
        }}
      />
    </motion.div>
  );
}

export function CountdownTimer({
  endDate,
  onExpire,
  variant = 'default',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(endDate)
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  // Prevent hydration mismatch
  if (!mounted || !timeLeft) {
    return null;
  }

  const showDays = timeLeft.days > 0;
  const isNeon = variant === 'neon';

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isNeon ? 'center' : 'flex-start',
        gap: isNeon ? 12 : 8,
        flexWrap: 'wrap',
      }}
    >
      {showDays && (
        <>
          <TimeBox value={timeLeft.days} label="Días" variant={variant} />
          {isNeon && <TimeSeparator />}
        </>
      )}
      <TimeBox value={timeLeft.hours} label="Horas" variant={variant} />
      {isNeon && <TimeSeparator />}
      <TimeBox value={timeLeft.minutes} label="Min" variant={variant} />
      {isNeon && <TimeSeparator />}
      <TimeBox value={timeLeft.seconds} label="Seg" variant={variant} />
    </Box>
  );
}
