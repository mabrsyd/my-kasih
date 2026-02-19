import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data (skip About since it's managed by CMS)
  await prisma.memory.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.letter.deleteMany();
  await prisma.media.deleteMany();
  await prisma.auditLog.deleteMany();

  console.log('✓ Cleaned existing data');

  // Create sample media (placeholder URLs)
  const media1 = await prisma.media.create({
    data: {
      fileName: 'memory-cover-1.jpg',
      filePath: 'media/memory-cover-1.jpg',
      publicUrl: 'https://images.unsplash.com/photo-1518684079-7723ee35d244?w=800',
      mimeType: 'image/jpeg',
      size: 125000,
      width: 800,
      height: 600,
    },
  });

  const media2 = await prisma.media.create({
    data: {
      fileName: 'gallery-1.jpg',
      filePath: 'media/gallery-1.jpg',
      publicUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      mimeType: 'image/jpeg',
      size: 135000,
      width: 800,
      height: 533,
    },
  });

  const media3 = await prisma.media.create({
    data: {
      fileName: 'gallery-2.jpg',
      filePath: 'media/gallery-2.jpg',
      publicUrl: 'https://images.unsplash.com/photo-1515934751541-7a0be3d411c2?w=800',
      mimeType: 'image/jpeg',
      size: 115000,
      width: 800,
      height: 600,
    },
  });

  const media4 = await prisma.media.create({
    data: {
      fileName: 'letter-cover.jpg',
      filePath: 'media/letter-cover.jpg',
      publicUrl: 'https://images.unsplash.com/photo-1516321318423-f06897860033?w=800',
      mimeType: 'image/jpeg',
      size: 145000,
      width: 800,
      height: 600,
    },
  });

  console.log('✓ Created sample media');

  // Create/seed About chapters (CMS-driven content)
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    const aboutChapters = [
      {
        icon: '✦',
        title: 'Awal Pertemuan',
        content: 'Semua bermula dari momen yang tak akan pernah kulupakan. Kamu hadir dalam hidupku seperti sinar mentari yang menembus awan. Ada sesuatu yang ajaib tentang saat itu - koneksi yang terasa lebih dalam dari kata-kata. Bukan hanya cinta pada pandangan pertama; tapi pengakuan jiwa yang selalu kutunggu sepanjang hidupku.',
        order: 0,
      },
      {
        icon: '♥',
        title: 'Kenapa Kamu',
        content: 'Kamu membuatku ingin menjadi orang yang lebih baik setiap hari. Kebaikanmu tak terbatas, tawamu menular, dan kehadiranmu membawa kedamaian di saat gelisahku. Kamu melihatku - bukan hanya siapa aku sekarang, tapi siapa yang ingin aku jadi. Bersamamu, aku merasa aman untuk menjadi diriku seutuhnya.',
        order: 1,
      },
      {
        icon: '∞',
        title: 'Perjalanan Kita',
        content: 'Setiap momen yang kita bagikan adalah berkah. Dari kencan kopi yang tenang hingga lupa waktu, hingga percakapan malam tentang mimpi dan ketakutan, hingga pertengkaran kecil yang hanya membuat kita lebih kuat - setiap bab cerita kita berarti. Kamu mengajariku bahwa cinta bukan hanya perasaan; tapi pilihan yang kita buat setiap hari untuk hadir satu sama lain.',
        order: 2,
      },
      {
        icon: '◇',
        title: 'Selamanya',
        content: 'Aku tidak tahu apa yang masa depan simpan, tapi aku tahu bahwa aku ingin menghadapinya denganmu di sisiku. Apakah kita mendaki gunung atau duduk dalam keheningan, apakah kita menangis atau tertawa sampai sakit - aku ingin mengalami semuanya bersamamu. Kamu adalah petualangan terbesarku, rumah teraman, dan cinta selamanya.',
        order: 3,
      },
    ];

    for (const chapter of aboutChapters) {
      await prisma.about.create({ data: chapter });
    }
    console.log('✓ Created About chapters');
  } else {
    console.log('✓ About chapters already exist, skipping...');
  }

  // Create sample memories
  const memory1 = await prisma.memory.create({
    data: {
      date: new Date('2024-01-15'),
      title: 'Hari Spesial Bersama',
      description:
        'Hari pertama kita bertemu, saat itu perasaan yang tidak terdeskripsi... ',
      emoji: '💕',
      coverId: media1.id,
      publishedAt: new Date(),
    },
  });

  const memory2 = await prisma.memory.create({
    data: {
      date: new Date('2024-02-14'),
      title: 'Kenangan Manis',
      description:
        'Setiap momen bersama kamu adalah kenangan indah yang akan selalu kupelihara...',
      emoji: '🌹',
      coverId: media2.id,
      publishedAt: new Date(),
    },
  });

  console.log('✓ Created sample memories');

  // Create sample gallery items
  const gallery1 = await prisma.gallery.create({
    data: {
      title: 'Petualangan Pertama',
      description: 'Moment indah dari perjalanan pertama kita bersama',
      order: 1,
      imageId: media2.id,
    },
  });

  const gallery2 = await prisma.gallery.create({
    data: {
      title: 'Kenangan Indah',
      description: 'Setiap detik bersama adalah keindahan',
      order: 2,
      imageId: media3.id,
    },
  });

  console.log('✓ Created sample gallery items');

  // Create sample letters
  const letter1 = await prisma.letter.create({
    data: {
      title: 'Surat Cinta Pertama',
      content: `Sayang,

Aku ingin menulis surat ini untuk mengutarakan apa yang ada di dalam hatiku.
Sejak hari pertama kita bertemu, hidupku berubah menjadi lebih berwarna dan penuh makna.

Setiap senyuman mu membuat matahari pagi terasa lebih cerah,
Setiap kata-kata mu adalah melodi terindah yang pernah kami dengar,
Setiap momen bersama adalah hadiah paling berharga dalam hidup kami.

Aku berjanji akan selalu ada di sisimu, dalam suka dan duka,
Untuk membangun masa depan yang penuh cinta dan kebahagiaan bersama mu.

Selamanya milikmu,
Dengan cinta sejati ❤️`,
      order: 1,
      published: true,
      imageId: media4.id,
    },
  });

  const letter2 = await prisma.letter.create({
    data: {
      title: 'Ungkapan Terima Kasih',
      content: `Sayang tercinta,

Aku ingin mengucapkan terima kasih atas semua yang telah kamu berikan,
Atas cinta, pengertian, dan dukunganmu yang tak tergoyahkan.

Kamu adalah alasan terbesar mengapa aku tersenyum setiap hari,
Kamu adalah inspirasi terbesar untuk menjadi versi terbaik dari diriku.

Terima kasih telah memilih untuk berbagi hidup denganku,
Terima kasih telah menjadi matahari dalam kegelapan malam kami.

Dengan sepenuh hati,
Selamanya menyayangimu ❤️`,
      order: 2,
      published: true,
    },
  });

  console.log('✓ Created sample letters');

  // Create audit log entries
  await prisma.auditLog.create({
    data: {
      action: 'SEED',
      entityType: 'System',
      entityId: 'init',
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
      changes: { message: 'Database seeded with sample data' },
    },
  });

  console.log('✓ Created audit logs');

  console.log('✅ Database seeding completed successfully!');
  console.log(
    '\n📊 Sample data created:',
    `\n  - ${4} media files`,
    `\n  - ${2} memories`,
    `\n  - ${2} gallery items`,
    `\n  - ${2} letters`
  );
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
