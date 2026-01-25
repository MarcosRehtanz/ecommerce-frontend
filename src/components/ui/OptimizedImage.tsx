'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@mantine/core';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

const DEFAULT_FALLBACK = 'https://placehold.co/300x300?text=Sin+imagen';

/**
 * Componente de imagen optimizado que maneja:
 * - Imágenes base64
 * - URLs externas
 * - Fallback en caso de error
 * - Loading state con skeleton
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
  fallbackSrc = DEFAULT_FALLBACK,
  style,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determinar la fuente final de la imagen
  const imageSrc = error || !src ? fallbackSrc : src;

  // Las imágenes base64 no se pueden optimizar con next/image loader
  const isBase64 = imageSrc?.startsWith('data:');

  // Para imágenes base64, usamos unoptimized
  const imageProps = {
    src: imageSrc,
    alt,
    className,
    priority,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setError(true);
      setIsLoading(false);
    },
    ...(isBase64 ? { unoptimized: true } : {}),
    ...(fill
      ? { fill: true, sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' }
      : { width: width || 300, height: height || 300 }),
    style: {
      objectFit: 'cover' as const,
      ...style,
    },
  };

  return (
    <div style={{ position: fill ? 'relative' : 'static', width: fill ? '100%' : width, height: fill ? '100%' : height }}>
      {isLoading && (
        <Skeleton
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
          radius="md"
        />
      )}
      <Image {...imageProps} />
    </div>
  );
}
