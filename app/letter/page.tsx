'use client';

import { motion } from 'framer-motion';
import { fadeInUpVariants, containerVariants, revealVariants } from '@/lib/animations';
import { useState } from 'react';

export default function Letter() {
  const [showFull, setShowFull] = useState(false);

  const letterText = [
    "My Dearest,",
    "",
    "I find myself struggling to put into words what you mean to me, because words feel so small compared to the magnitude of what I feel in my heart.",
    "",
    "Every day with you is a gift I never knew I needed. You've changed my life in ways I never expected - not just by being here, but by being YOU. Your laughter is my favorite song, your smile is my greatest reward, and your presence is my home.",
    "",
    "I love the way you care about the little things - how you remember the small details about my day, how you make effort to understand my dreams, how you hold my hand like it's the most precious thing in the world. I love your strength, your vulnerability, your weirdness, and your heart.",
    "",
    "When I look at you, I don't just see the person I love. I see my future, my adventure, my safe place, and my greatest blessing. You make me want to be braver, kinder, and more patient. You inspire me daily to be the best version of myself.",
    "",
    "There will be days that are harder than others. There will be storms that test us, moments that challenge us, and times when things don't go as planned. But I want you to know that no matter what comes our way, I choose you. Every single day, I choose you.",
    "",
    "You are not perfect, and neither am I. But together, we are perfect for each other. Our love is not about being flawless - it's about being real, raw, and infinitely grateful for the privilege of walking through life with you.",
    "",
    "Thank you for loving me even on the days I'm hard to love. Thank you for believing in me when I doubted myself. Thank you for being my person, my reason, and my forever.",
    "",
    "I promise to love you with the same devotion you show me. I promise to support your dreams, celebrate your victories, and hold you through your struggles. I promise to keep choosing you, to keep fighting for us, and to spend my life building something beautiful with you.",
    "",
    "You are my greatest love story, my most cherished memory, and my brightest future.",
    "",
    "Forever yours,",
    "❤️"
  ];

  return (
    <div className="min-h-screen bg-gradient-rose pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUpVariants}
            className="text-center mb-12"
          >
            <h1 className="heading-romantic mb-4">A Letter to You 💌</h1>
            <p className="text-gray-600 text-lg font-serif-body">
              Words from my heart, written for you
            </p>
          </motion.div>

          {/* Letter Container */}
          <motion.div className="card-romantic p-8 sm:p-12 max-h-[500px] overflow-y-auto">
            <div className="space-y-4 font-serif-body text-gray-700 leading-relaxed">
              {letterText.map((line, idx) => (
                <motion.p
                  key={idx}
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                  custom={idx * 0.05}
                  className={`text-base sm:text-lg ${
                    line.includes('My Dearest') || line.includes('Forever yours')
                      ? 'font-semibold text-romantic-red'
                      : ''
                  } ${line === '❤️' ? 'text-4xl text-center' : ''}`}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Read more hint */}
            {!showFull && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-8 pt-4 border-t border-white/30"
              >
                <button
                  onClick={() => setShowFull(true)}
                  className="text-romantic-red hover:text-dark-rose font-serif-body underline transition-colors"
                >
                  Read full letter ↓
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Decorative footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <p className="text-5xl">💌</p>
            </motion.div>
            <p className="text-gray-600 font-serif-body mt-4 text-sm">
              This letter is a reminder of how much you mean to me.
            </p>
            <p className="text-gray-500 font-serif-body text-sm mt-2">
              Read it whenever you need to remember. ❤️
            </p>
          </motion.div>

          {/* Tips */}
          <motion.div
            variants={fadeInUpVariants}
            className="text-center mt-12 pt-8 border-t border-white/30"
          >
            <p className="text-gray-600 text-sm italic">
              💡 Customize this letter with your own words and memories
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
