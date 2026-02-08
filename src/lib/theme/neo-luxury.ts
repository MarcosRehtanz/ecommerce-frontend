import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

/**
 * NEO-LUXURY DESIGN SYSTEM
 * ========================
 * Core Design Identity for Premium E-commerce Experience
 */

// === COLOR SCALES ===

// Deep Ink - Primary Background (NO pure black, NO light grays)
const ink: MantineColorsTuple = [
  '#e8e9ec',
  '#c5c8d0',
  '#a1a6b4',
  '#7e8498',
  '#5a627c',
  '#374060',
  '#2a3349',
  '#1e2538',
  '#141a2b',
  '#0F172A', // Base - Deep Ink
];

// Electric Orchid - Action/Conversion (buttons, prices, active states)
const orchid: MantineColorsTuple = [
  '#f3e8ff',
  '#e4ccff',
  '#d4aeff',
  '#c490ff',
  '#b372ff',
  '#a254fd',
  '#9145e8',
  '#7C3AED', // Base - Electric Orchid
  '#6b2dc7',
  '#5b21b6',
];

// Jade Mint - Trust/Success (trust bars, success, verified badges)
const mint: MantineColorsTuple = [
  '#e6fbf4',
  '#c0f5e2',
  '#99efd0',
  '#72e9be',
  '#4ce3ac',
  '#26dd9a',
  '#10B981', // Base - Jade Mint
  '#0ea572',
  '#0c9163',
  '#0a7d54',
];

// Glass - For glassmorphism panels
const glass: MantineColorsTuple = [
  'rgba(255, 255, 255, 0.02)',
  'rgba(255, 255, 255, 0.03)',
  'rgba(255, 255, 255, 0.05)', // Standard glass bg
  'rgba(255, 255, 255, 0.08)',
  'rgba(255, 255, 255, 0.1)',  // Standard border
  'rgba(255, 255, 255, 0.15)',
  'rgba(255, 255, 255, 0.2)',
  'rgba(255, 255, 255, 0.25)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0.4)',
];

// === THEME CONFIGURATION ===

export const neoLuxuryTheme = createTheme({
  // Color Palette
  colors: {
    ink,
    orchid,
    mint,
    glass,
  },

  // Primary color for Mantine components
  primaryColor: 'orchid',
  primaryShade: 7,

  // Default to dark color scheme
  // Note: This is set but Next.js may need additional config

  // Typography
  fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',

  headings: {
    fontFamily: 'var(--font-display), "Clash Display", var(--font-inter), sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(56), lineHeight: '1.1' },
      h2: { fontSize: rem(42), lineHeight: '1.2' },
      h3: { fontSize: rem(32), lineHeight: '1.3' },
      h4: { fontSize: rem(24), lineHeight: '1.4' },
      h5: { fontSize: rem(20), lineHeight: '1.4' },
      h6: { fontSize: rem(16), lineHeight: '1.5' },
    },
  },

  // Spacing & Radius
  defaultRadius: 'lg',
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24), // Standard for cards (rounded-3xl equivalent)
  },

  // Shadows with orchid glow variants
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 30px rgba(0, 0, 0, 0.3)',
    xl: '0 25px 50px rgba(0, 0, 0, 0.4)',
  },

  // Component-specific overrides
  components: {
    // Button with orchid glow on hover
    Button: {
      defaultProps: {
        radius: 'xl',
      },
      styles: (theme: any, params: any) => ({
        root: {
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      }),
    },

    // Card with glassmorphism
    Card: {
      defaultProps: {
        radius: 'xl',
        padding: 'lg',
      },
      styles: () => ({
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }),
    },

    // Paper - only set radius, let individual pages handle background
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
    },

    // === SHARED INPUT STYLES (Glass-Dark) ===
    // All form inputs use the same glass-dark aesthetic

    TextInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        label: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 13,
          marginBottom: 6,
        },
        input: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          '&:focus': {
            borderColor: 'var(--mantine-color-orchid-7)',
            boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)',
          },
        },
      }),
    },

    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        label: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 13,
          marginBottom: 6,
        },
        input: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          '&:focus': {
            borderColor: 'var(--mantine-color-orchid-7)',
            boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)',
          },
        },
        innerInput: {
          color: 'white',
        },
      }),
    },

    Select: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        label: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 13,
          marginBottom: 6,
        },
        input: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          '&:focus': {
            borderColor: 'var(--mantine-color-orchid-7)',
            boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)',
          },
        },
        dropdown: {
          backgroundColor: '#1e2538',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        option: {
          '&[data-combobox-selected]': {
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
          },
          '&[data-combobox-active]': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      }),
    },

    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        label: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 13,
          marginBottom: 6,
        },
        input: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          '&:focus': {
            borderColor: 'var(--mantine-color-orchid-7)',
            boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)',
          },
        },
      }),
    },

    Textarea: {
      defaultProps: {
        radius: 'md',
      },
      styles: () => ({
        label: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 13,
          marginBottom: 6,
        },
        input: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
          },
          '&:focus': {
            borderColor: 'var(--mantine-color-orchid-7)',
            boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)',
          },
        },
      }),
    },

    // Title with Clash Display
    Title: {
      styles: () => ({
        root: {
          fontFamily: 'var(--font-display), "Clash Display", sans-serif',
        },
      }),
    },

    // Badge styling
    Badge: {
      defaultProps: {
        radius: 'xl',
      },
    },

    // Anchor styling
    Anchor: {
      styles: () => ({
        root: {
          color: 'var(--mantine-color-orchid-7)',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: 'var(--mantine-color-orchid-5)',
          },
        },
      }),
    },

    // Skeleton with dark styling
    Skeleton: {
      styles: () => ({
        root: {
          '&::before': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          },
        },
      }),
    },

    // Container max widths
    Container: {
      defaultProps: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1320,
        },
      },
    },
  },

  // Other global settings
  other: {
    // Neo-Luxury specific tokens
    deepInk: '#0F172A',
    electricOrchid: '#7C3AED',
    jadeMint: '#10B981',

    // Glassmorphism tokens
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassBlur: '16px',

    // Glow effects
    orchidGlow: '0 0 40px rgba(124, 58, 237, 0.4)',
    orchidGlowHover: '0 0 60px rgba(124, 58, 237, 0.6)',
    mintGlow: '0 0 20px rgba(16, 185, 129, 0.4)',

    // Animation durations
    transitionFast: '0.2s',
    transitionNormal: '0.3s',
    transitionSlow: '0.5s',

    // Stagger delay for entry animations
    staggerDelay: 0.15,
  },
});

// === HELPER FUNCTIONS ===

/**
 * Get glassmorphism styles for custom components
 */
export const getGlassStyles = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const backgrounds = {
    light: 'rgba(255, 255, 255, 0.03)',
    medium: 'rgba(255, 255, 255, 0.05)',
    heavy: 'rgba(255, 255, 255, 0.08)',
  };

  return {
    background: backgrounds[intensity],
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  };
};

/**
 * Get orchid glow button styles
 */
export const getGlowButtonStyles = (isHovered = false) => ({
  background: 'var(--mantine-color-orchid-7)',
  color: 'white',
  border: 'none',
  borderRadius: 100,
  boxShadow: isHovered
    ? '0 0 60px rgba(124, 58, 237, 0.6)'
    : '0 0 40px rgba(124, 58, 237, 0.4)',
  transition: 'all 0.3s ease',
});

/**
 * Standard entry animation variants for Framer Motion
 */
export const entryAnimationVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(20px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Container animation with stagger
 */
export const containerAnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Card hover animation
 */
export const cardHoverAnimation = {
  scale: 1.02,
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
  transition: { duration: 0.3 },
};

// === CSS VARIABLE TOKENS ===
// These should match globals.css

export const cssVariables = {
  '--deep-ink': '#0F172A',
  '--electric-orchid': '#7C3AED',
  '--jade-mint': '#10B981',
  '--glass-white': 'rgba(255, 255, 255, 0.05)',
  '--border-glass': 'rgba(255, 255, 255, 0.1)',
  '--font-display': '"Clash Display", var(--font-inter), sans-serif',
  '--font-body': 'var(--font-inter), system-ui, sans-serif',
};
