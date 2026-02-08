This directory should contain your gallery images.

To customize the gallery:

1. Add your image files here (.jpg, .png, .webp)
2. Update the GALLERY_PHOTOS in lib/constants.ts with your image paths

Example format:

```typescript
export const GALLERY_PHOTOS = [
  {
    id: 1,
    title: "Sunset Together",
    image: "/images/sunset.jpg",
  },
  // ... more photos
];
```

Then update the gallery component to show actual images instead of gradients.
