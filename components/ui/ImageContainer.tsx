'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface ImageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | '16:9' | '3:2' | '4:5';
  fill?: boolean;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  showBorder?: boolean;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  '16:9': 'aspect-video',
  '3:2': 'aspect-[3/2]',
  '4:5': 'aspect-[4/5]',
};

const ImageContainer = React.forwardRef<HTMLDivElement, ImageContainerProps>(
  (
    {
      src,
      alt,
      aspectRatio = 'square',
      fill = false,
      priority = false,
      loading = 'lazy',
      showBorder = true,
      className,
      ...props
    },
    ref
  ) => {
    const aspectClass = aspectRatioClasses[aspectRatio];

    return (
      <div
        ref={ref}
        className={clsx(
          'relative overflow-hidden rounded-lg bg-purple-pale/50',
          showBorder && 'border border-purple-secondary/30',
          !fill && aspectClass,
          'animate-fadeIn duration-500',
          className
        )}
        {...props}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className="w-full h-full object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={loading}
        />
      </div>
    );
  }
);

ImageContainer.displayName = 'ImageContainer';

export { ImageContainer };
