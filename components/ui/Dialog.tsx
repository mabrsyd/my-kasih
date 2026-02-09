'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={clsx(
      'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fadeIn',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={clsx(
        'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl',
        'bg-white/90 backdrop-blur-md border border-purple-secondary/30',
        'shadow-romantic p-6',
        'data-[state=open]:animate-fadeIn',
        'focus:outline-none',
        className
      )}
      {...props}
    />
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    className={clsx('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={clsx(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={clsx(
      'text-lg font-semibold font-serif-display text-purple-primary leading-none',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={clsx('text-sm text-neutral-dark/70 font-serif-body', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
