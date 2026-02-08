'use client';

import { Box, Container, Title, Text, Skeleton } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import { productsByCategoryRoute } from '@/lib/routes';
import { CategoryGridConfig } from '@/types';

// Premium category images
const categoryImages: Record<string, string> = {
  electronica:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  moda: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  hogar: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  deportes:
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
  belleza:
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  accesorios:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
};

// Fallback categories for when no data
const fallbackCategories = [
  {
    id: '1',
    name: 'Nueva Colección',
    slug: 'nueva-coleccion',
    description: 'Lo último en tendencias',
    featured: true,
  },
  {
    id: '2',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Complementa tu estilo',
  },
  {
    id: '3',
    name: 'Ediciones Limitadas',
    slug: 'ediciones-limitadas',
    description: 'Exclusividad garantizada',
  },
  {
    id: '4',
    name: 'Lo Más Vendido',
    slug: 'mas-vendido',
    description: 'Favoritos del público',
  },
];

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageData?: string;
  imageUrl?: string;
  _count?: { products: number };
}

interface CategoryGridProps {
  initialCategories?: Category[];
  config?: CategoryGridConfig;
}

// Custom ease curve
const easeOutQuad = [0.25, 0.46, 0.45, 0.94] as const;

// Animation variants
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

interface BentoTileProps {
  category: Category;
  size: 'large' | 'medium' | 'small';
  className?: string;
}

function BentoTile({ category, size, className }: BentoTileProps) {
  const imageUrl =
    category.imageData ||
    category.imageUrl ||
    categoryImages[category.slug] ||
    categoryImages.electronica;

  const isLarge = size === 'large';

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <Link
        href={productsByCategoryRoute(category.slug)}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: isLarge ? 280 : 190,
          }}
          whileHover="hover"
          initial="initial"
        >
          {/* Image with zoom effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
            }}
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.1 },
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes={isLarge ? '50vw' : '25vw'}
            />
          </motion.div>

          {/* Gradient Overlay - lightens on hover */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%)',
            }}
            variants={{
              initial: { opacity: 1 },
              hover: { opacity: 0.7 },
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Content */}
          <Box
            pos="absolute"
            bottom={0}
            left={0}
            right={0}
            p={isLarge ? 'xl' : 'lg'}
            style={{ zIndex: 1 }}
          >
            <Text
              c="white"
              fz={isLarge ? 32 : 20}
              fw={600}
              mb={8}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {category.name}
            </Text>

            {category.description && (
              <Text c="white" opacity={0.7} size={isLarge ? 'md' : 'sm'} mb="md">
                {category.description}
              </Text>
            )}

            {/* Explore link */}
            <motion.div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              variants={{
                initial: { x: 0 },
                hover: { x: 4 },
              }}
              transition={{ duration: 0.3 }}
            >
              <Text
                component="span"
                c="white"
                size="sm"
                fw={500}
                style={{
                  opacity: 0.8,
                  transition: 'color 0.3s ease',
                }}
                className="explore-text"
              >
                Explorar
              </Text>
              <motion.div
                variants={{
                  initial: { x: 0, opacity: 0.8 },
                  hover: { x: 4, opacity: 1 },
                }}
                transition={{ duration: 0.3 }}
              >
                <IconArrowRight size={16} color="white" style={{ opacity: 0.8 }} />
              </motion.div>
            </motion.div>
          </Box>

          {/* Badge for featured/new */}
          {isLarge && (
            <Box
              pos="absolute"
              top={20}
              left={20}
              px="md"
              py={6}
              style={{
                background: 'var(--electric-orchid)',
                borderRadius: 100,
                zIndex: 1,
              }}
            >
              <Text c="white" size="xs" fw={600}>
                DESTACADO
              </Text>
            </Box>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid({ initialCategories = [], config: gridConfig }: CategoryGridProps) {

  if (gridConfig?.isVisible === false) return null;

  const sectionLabel = gridConfig?.sectionLabel || 'Colecciones';
  const sectionTitle = gridConfig?.title || 'Explora por Categoría';

  const categories =
    initialCategories.length > 0
      ? initialCategories.slice(0, 4)
      : fallbackCategories;

  const isLoading = false;

  if (isLoading) {
    return (
      <Box py="xl" style={{ backgroundColor: 'var(--deep-ink)' }}>
        <Container size="xl">
          <Skeleton height={40} width={300} mb="xl" />
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 16,
              height: 500,
            }}
          >
            <Skeleton height="100%" radius="lg" style={{ gridRow: 'span 2' }} />
            <Skeleton height="100%" radius="lg" />
            <Skeleton height="100%" radius="lg" />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // Ensure we have at least 4 categories
  const displayCategories = [...categories];
  while (displayCategories.length < 4) {
    displayCategories.push(fallbackCategories[displayCategories.length]);
  }

  return (
    <Box py="xl" style={{ backgroundColor: 'var(--deep-ink)' }}>
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 40 }}
        >
          <Text
            c="white"
            size="sm"
            fw={600}
            mb="xs"
            style={{
              color: 'var(--electric-orchid)',
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
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {sectionTitle}
          </Title>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="bento-grid"
        >
          {/* Hero Tile - spans 2x2 */}
          <BentoTile
            category={displayCategories[0]}
            size="large"
            className="bento-hero"
          />

          {/* Secondary Tiles */}
          <BentoTile
            category={displayCategories[1]}
            size="medium"
            className="bento-item-1"
          />

          <BentoTile
            category={displayCategories[2]}
            size="small"
            className="bento-item-2"
          />

          <BentoTile
            category={displayCategories[3]}
            size="small"
            className="bento-item-3"
          />
        </motion.div>
      </Container>

      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 200px);
          gap: 16px;
        }

        .bento-hero {
          grid-column: span 2;
          grid-row: span 2;
        }

        .bento-item-1 {
          grid-column: span 2;
        }

        .bento-item-2 {
          grid-column: span 1;
        }

        .bento-item-3 {
          grid-column: span 1;
        }

        .bento-grid:hover .explore-text {
          color: var(--electric-orchid);
        }

        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(3, 180px);
          }

          .bento-hero {
            grid-column: span 2;
            grid-row: span 1;
          }

          .bento-item-1 {
            grid-column: span 2;
          }

          .bento-item-2,
          .bento-item-3 {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 200px);
          }

          .bento-hero,
          .bento-item-1,
          .bento-item-2,
          .bento-item-3 {
            grid-column: span 1;
            grid-row: span 1;
          }
        }
      `}</style>
    </Box>
  );
}
