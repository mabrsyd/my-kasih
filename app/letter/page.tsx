'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ParagraphReveal } from '@/components/ScrollReveal';
import MomentOfSilence from '@/components/MomentOfSilence';
import { cinematicFadeVariants, whisperVariants } from '@/lib/animations';

export default function Letter() {
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
      <section className="min-h-screen flex items-center justify-center section-breathe pt-24 relative">
        <motion.div
          variants={cinematicFadeVariants}
          initial="initial"
          animate="animate"
          className="text-center content-intimate"
        >
          {/* Decorative envelope */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 0.7, rotateX: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-6xl mb-12"
          >
            ✉
          </motion.div>

          <motion.h1
            className="text-poetry text-dark-rose mb-8"
            variants={whisperVariants}
            initial="initial"
            animate="animate"
          >
            Surat Untukmu
          </motion.h1>

          <motion.p
            className="text-intimate mb-16 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            Kata-kata dari hatiku yang terdalam,<br />
            ditulis hanya untukmu...
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-dark-rose/50 text-center"
            >
              <p className="text-whisper mb-2 text-xs tracking-widest uppercase">Baca</p>
              <span className="text-lg">↓</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Letter content - paragraph by paragraph reveal */}
      <section className="section-breathe" ref={letterRef}>
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLetterInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
            className="glass rounded-3xl p-8 md:p-12 shadow-romantic"
          >
            {/* Opening salutation */}
            <motion.p
              className="text-handwritten text-xl text-romantic-red mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isLetterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {letterParagraphs[0]}
            </motion.p>

            {/* Main paragraphs with stagger */}
            <ParagraphReveal 
              paragraphs={letterParagraphs.slice(1, -1)}
              staggerDelay={0.4}
              paragraphClassName="text-intimate"
            />

            {/* Closing paragraph - special styling */}
            <motion.p
              className="text-handwritten text-lg text-romantic-red mt-10 italic"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {letterParagraphs[letterParagraphs.length - 1]}
            </motion.p>

            {/* Signature */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-whisper mb-4 uppercase tracking-widest text-xs">Selamanya milikmu</p>
              <motion.span 
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ♥
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Emotional climax */}
      <MomentOfSilence 
        quote="Baca surat ini setiap kali kamu perlu diingatkan betapa berartinya dirimu bagiku"
      />

      {/* Final moment */}
      <section className="section-breathe">
        <div className="content-intimate text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.span 
              className="text-5xl block mb-8"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✉
            </motion.span>
            <p className="text-whisper">
              Dengan cinta tak terbatas...
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
