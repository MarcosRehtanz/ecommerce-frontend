'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Skeleton,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowRight, IconShoppingCart, IconHeart } from '@tabler/icons-react';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { getProductImageSrc } from '@/utils/image';
import { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  initialProducts?: Product[];
}

function GlassProductCard({ product }: { product: Product }) {
  const { addItem } = useUnifiedCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: getProductImageSrc(product.imageData, product.imageUrl),
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const hasDiscount =
    product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100)
    : 0;

  const imageSrc = getProductImageSrc(
    product.imageData,
    product.imageUrl,
    'https://placehold.co/400x400/1a1a2e/7C3AED?text=Producto'
  );
  const isBase64 = imageSrc?.startsWith('data:');

  return (
    <motion.article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 420,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered
            ? '0 25px 50px rgba(0,0,0,0.4)'
            : '0 10px 30px rgba(0,0,0,0.2)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image Container */}
        <Link
          href={`/products/${product.id}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <Box pos="relative" style={{ aspectRatio: '1', overflow: 'hidden' }}>
            {/* Image with zoom effect */}
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
              }}
            >
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                style={{ objectFit: 'cover' }}
                unoptimized={isBase64}
              />
            </motion.div>

            {/* Gradient overlay */}
            <Box
              pos="absolute"
              bottom={0}
              left={0}
              right={0}
              h={100}
              style={{
                background:
                  'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Sale Badge */}
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  padding: '6px 12px',
                  background: 'var(--electric-orchid, #7C3AED)',
                  borderRadius: 100,
                  zIndex: 2,
                }}
              >
                <Text c="white" size="xs" fw={600}>
                  -{discountPercent}%
                </Text>
              </motion.div>
            )}

            {/* Low Stock Badge */}
            {product.stock < 5 && product.stock > 0 && (
              <Box
                pos="absolute"
                top={16}
                right={16}
                px="sm"
                py={4}
                style={{
                  background: 'rgba(251, 146, 60, 0.9)',
                  borderRadius: 100,
                  zIndex: 2,
                }}
              >
                <Text c="white" size="xs" fw={600}>
                  Últimas {product.stock}
                </Text>
              </Box>
            )}

            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlist}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isWishlisted ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 16,
                right: hasDiscount || (product.stock < 5 && product.stock > 0) ? 16 : 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <IconHeart
                size={20}
                color={isWishlisted ? '#ef4444' : 'white'}
                fill={isWishlisted ? '#ef4444' : 'none'}
              />
            </motion.button>
          </Box>
        </Link>

        {/* Content */}
        <Box p="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Link
            href={`/products/${product.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Text
              c="white"
              fw={500}
              size="md"
              lineClamp={2}
              mb="xs"
              style={{
                minHeight: '2.6em',
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </Text>
          </Link>

          {/* Dual Pricing */}
          <Box mt="auto">
            <Box style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <Text
                fw={700}
                fz={22}
                style={{ color: 'var(--electric-orchid, #7C3AED)' }}
              >
                ${Number(product.price).toLocaleString('es-AR')}
              </Text>
              {hasDiscount && (
                <Text td="line-through" c="white" opacity={0.4} size="sm">
                  ${Number(product.originalPrice).toLocaleString('es-AR')}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* Quick Add Button - Slides up on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                background:
                  'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.8) 100%)',
              }}
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background:
                    product.stock === 0
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'var(--electric-orchid, #7C3AED)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: product.stock === 0 ? 0.5 : 1,
                }}
              >
                <IconShoppingCart size={18} />
                {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
}

export function ProductCarousel({
  title,
  subtitle,
  viewAllLink = '/products',
  initialProducts = [],
}: ProductCarouselProps) {
  const products = initialProducts;
  const isLoading = false;

  return (
    <Box py="xl" style={{ backgroundColor: 'var(--deep-ink, #0F172A)' }}>
      <Container size="xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
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
              {subtitle || 'Productos'}
            </Text>
            <Title
              order={2}
              c="white"
              fz={{ base: 28, md: 36 }}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </Title>
          </div>

          <Link
            href={viewAllLink}
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              whileHover={{ x: 4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'white',
                opacity: 0.7,
                transition: 'opacity 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.color = 'var(--electric-orchid)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.color = 'white';
              }}
            >
              <Text fw={500} size="sm">
                Ver todos
              </Text>
              <IconArrowRight size={16} />
            </motion.div>
          </Link>
        </motion.div>

        {isLoading ? (
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={420} radius="lg" />
            ))}
          </Box>
        ) : products.length > 0 ? (
          <Carousel
            slideSize={{ base: '85%', xs: '50%', sm: '33.333333%', md: '25%' }}
            slideGap="md"
            align="start"
            slidesToScroll={1}
            withControls
            loop={products.length > 4}
            styles={{
              root: {
                '--carousel-control-size': '44px',
              },
              control: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                opacity: 0.8,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'var(--electric-orchid)',
                  borderColor: 'var(--electric-orchid)',
                  opacity: 1,
                },
                '&[data-inactive]': {
                  opacity: 0,
                  cursor: 'default',
                },
              },
              controls: {
                top: '40%',
              },
            }}
          >
            {products.map((product, index) => (
              <Carousel.Slide key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <GlassProductCard product={product} />
                </motion.div>
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Box
            py="xl"
            ta="center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Text c="white" opacity={0.6}>
              No hay productos disponibles
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}
