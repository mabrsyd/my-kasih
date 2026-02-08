'use client';

import { motion } from 'framer-motion';
import ScrollReveal, { StaggerReveal } from '@/components/ScrollReveal';
import MomentOfSilence from '@/components/MomentOfSilence';
import { cinematicFadeVariants } from '@/lib/animations';

export default function About() {
  const storyChapters = [
    {
      icon: '✦',
      title: 'Awal Pertemuan',
      content: 'Semua bermula dari momen yang tak akan pernah kulupakan. Kamu hadir dalam hidupku seperti sinar mentari yang menembus awan. Ada sesuatu yang ajaib tentang saat itu - koneksi yang terasa lebih dalam dari kata-kata. Bukan hanya cinta pada pandangan pertama; tapi pengakuan jiwa yang selalu kutunggu sepanjang hidupku.'
    },
    {
      icon: '♥',
      title: 'Kenapa Kamu',
      content: 'Kamu membuatku ingin menjadi orang yang lebih baik setiap hari. Kebaikanmu tak terbatas, tawamu menular, dan kehadiranmu membawa kedamaian di saat gelisahku. Kamu melihatku - bukan hanya siapa aku sekarang, tapi siapa yang ingin aku jadi. Bersamamu, aku merasa aman untuk menjadi diriku seutuhnya.'
    },
    {
      icon: '∞',
      title: 'Perjalanan Kita',
      content: 'Setiap momen yang kita bagikan adalah berkah. Dari kencan kopi yang tenang hingga lupa waktu, hingga percakapan malam tentang mimpi dan ketakutan, hingga pertengkaran kecil yang hanya membuat kita lebih kuat - setiap bab cerita kita berarti. Kamu mengajariku bahwa cinta bukan hanya perasaan; tapi pilihan yang kita buat setiap hari untuk hadir satu sama lain.'
    },
    {
      icon: '◇',
      title: 'Selamanya',
      content: 'Aku tidak tahu apa yang masa depan simpan, tapi aku tahu bahwa aku ingin menghadapinya denganmu di sisiku. Apakah kita mendaki gunung atau duduk dalam keheningan, apakah kita menangis atau tertawa sampai sakit - aku ingin mengalami semuanya bersamamu. Kamu adalah petualangan terbesarku, rumah teraman, dan cinta selamanya.'
    }
  ];

  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Hero section */}
      <section className="min-h-[60vh] flex items-center justify-center section-breathe pt-24">
        <motion.div
          variants={cinematicFadeVariants}
          initial="initial"
          animate="animate"
          className="text-center content-intimate"
        >
          <motion.span 
            className="text-4xl block mb-8 opacity-60"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            ♥
          </motion.span>
          <h1 className="text-poetry text-dark-rose mb-6">Tentang Kita</h1>
          <p className="text-intimate">
            Cerita cinta kita, dalam kata-kata dari hatiku
          </p>
        </motion.div>
      </section>

      {/* Story chapters */}
      <section className="section-breathe">
        <div className="max-w-2xl mx-auto px-6">
          <StaggerReveal staggerDelay={0.2}>
            {storyChapters.map((chapter, index) => (
              <div 
                key={index}
                className={`mb-16 last:mb-0 ${index % 2 === 1 ? 'md:ml-12' : ''}`}
              >
                <div className="glass rounded-2xl p-8 shadow-romantic hover-glow transition-all duration-500">
                  <div className="flex gap-6 items-start">
                    <span className="text-2xl text-romantic-red opacity-60 mt-1">
                      {chapter.icon}
                    </span>
                    <div>
                      <h2 className="font-serif-display text-xl text-dark-rose mb-4">
                        {chapter.title}
                      </h2>
                      <p className="text-intimate leading-relaxed">
                        {chapter.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Emotional moment */}
      <MomentOfSilence 
        quote="Aku mencintaimu bukan karena siapa kamu, tapi karena siapa aku saat bersamamu"
        author="Selamanya milikmu"
      />

      {/* Closing section */}
      <section className="section-breathe">
        <div className="content-intimate text-center">
          <ScrollReveal>
            <motion.div
              className="text-5xl mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ♥
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-whisper">
              Dan cerita kita belum berakhir...
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
