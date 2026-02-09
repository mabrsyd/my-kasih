'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ParagraphReveal } from '@/components/ScrollReveal';
import MomentOfSilence from '@/components/MomentOfSilence';
import { 
  cinematicFadeVariants, 
  whisperVariants,
  letterContentVariants 
} from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';

export default function Letter() {
  const router = useRouter();
  const letterRef = useRef(null);
  const isLetterInView = useInView(letterRef, { once: true, margin: "-10%" });

  const letterParagraphs = [
    "Sayangku yang tercinta,",
    "Aku kesulitan merangkai kata untuk mengungkapkan apa artimu bagiku, karena kata-kata terasa sangat kecil dibandingkan dengan besarnya perasaan di hatiku.",
    "Setiap hari bersamamu adalah hadiah yang tak pernah kusangka. Kamu telah mengubah hidupku dengan cara yang tak terduga - bukan hanya dengan kehadiranmu, tapi dengan menjadi DIRIMU. Tawamu adalah lagu favoritku, senyummu adalah hadiah terbesarku, dan keberadaanmu adalah rumahku.",
    "Aku mencintai caramu peduli pada hal-hal kecil - bagaimana kamu mengingat detail kecil tentang hariku, bagaimana kamu berusaha memahami mimpiku, bagaimana kamu menggenggam tanganku seolah itu hal paling berharga di dunia.",
    "Ketika aku melihatmu, aku tidak hanya melihat orang yang aku cintai. Aku melihat masa depanku, petualanganku, tempat teraman ku, dan berkah terbesarku. Kamu membuatku ingin menjadi lebih berani, lebih baik, dan lebih sabar.",
    "Akan ada hari-hari yang lebih berat dari yang lain. Akan ada badai yang menguji kita, momen yang menantang kita, dan waktu ketika hal-hal tidak berjalan sesuai rencana. Tapi aku ingin kamu tahu bahwa apapun yang datang, aku memilihmu. Setiap hari, aku memilihmu.",
    "Kamu tidak sempurna, begitu juga aku. Tapi bersama, kita sempurna untuk satu sama lain. Cinta kita bukan tentang menjadi tanpa cela - tapi tentang menjadi nyata, tulus, dan sangat bersyukur atas kesempatan berjalan melewati hidup bersamamu.",
    "Terima kasih telah mencintaiku bahkan di hari-hari aku sulit untuk dicintai. Terima kasih telah percaya padaku saat aku meragukan diriku sendiri. Terima kasih telah menjadi orangku, alasanku, dan selamanya.",
    "Aku berjanji untuk mencintaimu dengan pengabdian yang sama seperti yang kamu tunjukkan padaku. Aku berjanji untuk mendukung mimpimu, merayakan kemenanganmu, dan memelukmu dalam perjuanganmu.",
    "Kamu adalah kisah cinta terbesarku, kenanganku yang paling berharga, dan masa depan tercerahku."
  ];

  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Vignette */}
      <div className="vignette" />

      {/* Hero section - Emotional opening */}
      <section className="min-h-screen flex items-center justify-center pt-32 pb-16 md:pb-24 relative">
        <motion.div
          variants={cinematicFadeVariants}
          initial="hidden"
          animate="visible"
          className="text-center content-intimate px-4"
        >
          {/* Decorative envelope */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 0.6, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => router.push('/flower-animation')}
            className="text-6xl md:text-7xl mb-10 filter drop-shadow-sm cursor-pointer hover:opacity-100 transition-opacity group"
          >
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="group-hover:scale-125 transition-transform inline-block"
            >
              ✉
            </motion.span>
          </motion.div>

          <H1 className="mb-6 text-purple-primary">Surat Untukmu</H1>

          <P className="mb-12 max-w-lg mx-auto text-purple-warm opacity-90 text-lg">
            Kata-kata dari hatiku yang terdalam,<br />
            <span className="text-sm opacity-75">ditulis hanya untukmu...</span>
          </P>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-purple-accent/40"
            >
              <Whisper className="block text-xs tracking-widest uppercase mb-2">
                Baca Surat
              </Whisper>
              <span className="text-2xl">↓</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Letter content - paragraph by paragraph reveal */}
      <section className="section-breathe" ref={letterRef}>
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLetterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-md border border-l-4 border-purple-secondary rounded-2xl p-8 md:p-12 shadow-romantic border-l-purple-accent"
          >
            {/* Opening salutation */}
            <motion.p
              className="text-handwritten text-lg text-purple-accent mb-8 font-serif-body"
              initial={{ opacity: 0, y: 10 }}
              animate={isLetterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {letterParagraphs[0]}
            </motion.p>

            {/* Main paragraphs with stagger */}
            <div className="space-y-6">
              {letterParagraphs.slice(1, -1).map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-intimate text-neutral-dark leading-relaxed"
                  custom={index}
                  variants={letterContentVariants}
                  initial="hidden"
                  animate={isLetterInView ? "visible" : "hidden"}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Closing paragraph - special styling */}
            <motion.p
              className="text-handwritten text-lg text-purple-accent mt-10 italic font-serif-body"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              {letterParagraphs[letterParagraphs.length - 1]}
            </motion.p>

            {/* Signature section */}
            <motion.div
              className="mt-12 pt-8 border-t border-purple-secondary/30 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              <Whisper className="block mb-6 uppercase tracking-widest text-xs text-purple-warm/70">
                Dengan sepenuh hati,
              </Whisper>
              <motion.span 
                className="text-5xl inline-block filter drop-shadow-sm"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ♥
              </motion.span>
              <p className="text-sm text-purple-accent mt-4 font-serif-body italic">
                Selamanya milikmu
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Emotional climax */}
      <MomentOfSilence 
        quote="Baca surat ini setiap kali kamu perlu diingatkan betapa berartinya dirimu bagiku"
      />

      {/* Final message */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={() => router.push('/flower-animation')}
            className="cursor-pointer group"
          >
            <motion.span 
              className="text-6xl block mb-6 drop-shadow-sm group-hover:scale-110 transition-transform"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✉
            </motion.span>
            <Whisper className="text-lg text-purple-warm/80 group-hover:text-purple-warm transition-colors">
              Dengan cinta tak terbatas...
            </Whisper>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
