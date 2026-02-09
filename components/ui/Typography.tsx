'use client';

import React from 'react';
import clsx from 'clsx';

interface TypographyProps extends React.HTMLAttributes<any> {}

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={clsx(
        'text-poetry font-serif-display font-bold text-purple-primary leading-tight',
        className
      )}
      {...props}
    />
  )
);
H1.displayName = 'H1';

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={clsx(
        'text-4xl md:text-5xl font-serif-display font-semibold text-purple-primary mt-8 mb-4 leading-tight',
        className
      )}
      {...props}
    />
  )
);
H2.displayName = 'H2';

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx(
        'text-2xl md:text-3xl font-serif-display font-semibold text-purple-primary mt-6 mb-3',
        className
      )}
      {...props}
    />
  )
);
H3.displayName = 'H3';

const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={clsx(
        'text-xl font-serif-display font-medium text-purple-primary mt-4 mb-2',
        className
      )}
      {...props}
    />
  )
);
H4.displayName = 'H4';

const P = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx(
        'text-intimate font-serif-body text-neutral-dark leading-relaxed my-4',
        className
      )}
      {...props}
    />
  )
);
P.displayName = 'P';

const Subtitle = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'text-lg md:text-xl text-purple-warm font-serif-body italic opacity-90 mt-2 mb-6',
        className
      )}
      {...props}
    />
  )
);
Subtitle.displayName = 'Subtitle';

const Caption = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        'text-sm text-neutral-dark/60 font-serif-body',
        className
      )}
      {...props}
    />
  )
);
Caption.displayName = 'Caption';

const Whisper = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        'text-whisper font-serif-body text-neutral-dark/70',
        className
      )}
      {...props}
    />
  )
);
Whisper.displayName = 'Whisper';

export { H1, H2, H3, H4, P, Subtitle, Caption, Whisper };
