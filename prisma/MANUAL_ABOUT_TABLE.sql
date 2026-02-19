-- This file contains SQL to create the About table in Supabase
-- Copy and paste this into Supabase SQL Editor to execute

CREATE TABLE IF NOT EXISTS "public"."About" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "About_order_idx" ON "public"."About"("order");

-- Insert default story chapters (optional - remove lines below if you want to manage via CMS only)
INSERT INTO "public"."About" ("id", "icon", "title", "content", "order", "createdAt", "updatedAt") VALUES
('about-1', '✦', 'Awal Pertemuan', 'Semua bermula dari momen yang tak akan pernah kulupakan. Kamu hadir dalam hidupku seperti sinar mentari yang menembus awan. Ada sesuatu yang ajaib tentang saat itu - koneksi yang terasa lebih dalam dari kata-kata. Bukan hanya cinta pada pandangan pertama; tapi pengakuan jiwa yang selalu kutunggu sepanjang hidupku.', 0, NOW(), NOW()),
('about-2', '♥', 'Kenapa Kamu', 'Kamu membuatku ingin menjadi orang yang lebih baik setiap hari. Kebaikanmu tak terbatas, tawamu menular, dan kehadiranmu membawa kedamaian di saat gelisahku. Kamu melihatku - bukan hanya siapa aku sekarang, tapi siapa yang ingin aku jadi. Bersamamu, aku merasa aman untuk menjadi diriku seutuhnya.', 1, NOW(), NOW()),
('about-3', '∞', 'Perjalanan Kita', 'Setiap momen yang kita bagikan adalah berkah. Dari kencan kopi yang tenang hingga lupa waktu, hingga percakapan malam tentang mimpi dan ketakutan, hingga pertengkaran kecil yang hanya membuat kita lebih kuat - setiap bab cerita kita berarti. Kamu mengajariku bahwa cinta bukan hanya perasaan; tapi pilihan yang kita buat setiap hari untuk hadir satu sama lain.', 2, NOW(), NOW()),
('about-4', '◇', 'Selamanya', 'Aku tidak tahu apa yang masa depan simpan, tapi aku tahu bahwa aku ingin menghadapinya denganmu di sisiku. Apakah kita mendaki gunung atau duduk dalam keheningan, apakah kita menangis atau tertawa sampai sakit - aku ingin mengalami semuanya bersamamu. Kamu adalah petualangan terbesarku, rumah teraman, dan cinta selamanya.', 3, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
