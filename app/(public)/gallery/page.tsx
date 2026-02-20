import { galleryService } from '@/services';
import GalleryClient from './GalleryClient';
import type { GalleryItem } from './GalleryClient';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function GalleryPage() {
  let photos: GalleryItem[] = [];

  try {
    const rawPhotos = await galleryService.getAll();
    photos = rawPhotos.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? undefined,
      order: p.order,
      image: {
        id: p.image.id,
        publicUrl: p.image.publicUrl,
        fileName: p.image.fileName,
        width: p.image.width ?? undefined,
        height: p.image.height ?? undefined,
      },
    }));
  } catch (error) {
    console.error('[Page] Failed to fetch gallery:', error);
  }

  return <GalleryClient photos={photos} />;
}
