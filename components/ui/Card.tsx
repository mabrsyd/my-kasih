'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const cardVariants = cva(
  'rounded-xl transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: clsx(
          'bg-white/70 backdrop-blur-md',
          'border border-purple-secondary/30',
          'shadow-romantic'
        ),
        minimal: clsx(
          'border-l-4 border-purple-secondary',
          'bg-purple-pale/50'
        ),
        elevated: clsx(
          'bg-white/90 backdrop-blur-lg',
          'border border-purple-light/50',
          'shadow-lg shadow-purple-primary/10'
        ),
        interactive: clsx(
          'bg-white/60 backdrop-blur-md',
          'border border-purple-secondary/40',
          'shadow-romantic',
          'hover:bg-white/80 hover:shadow-lg hover:border-purple-secondary/60',
          'hover:scale-105 hover:-translate-y-1',
          'cursor-pointer'
        ),
      },
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cardVariants({ variant, padding, className })}
      {...props}
    />
  )
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('mb-4', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx('text-xl font-serif-display font-semibold text-purple-primary', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-neutral-dark/70 font-serif-body', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={clsx('', className)} {...props} />
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('mt-6 flex items-center gap-3', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
