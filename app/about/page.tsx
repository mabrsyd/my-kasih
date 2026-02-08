'use client';

import { motion } from 'framer-motion';
import { fadeInUpVariants, containerVariants, staggerContainerVariants, itemVariants } from '@/lib/animations';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeInUpVariants} className="text-center mb-16">
            <h1 className="heading-romantic mb-4">Tentang Kita 💕</h1>
            <p className="text-gray-600 text-lg font-serif-body">
              Our love story, in the words from my heart
            </p>
          </motion.div>

          {/* Story sections */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Section 1 */}
            <motion.div variants={itemVariants} className="card-romantic">
              <div className="flex gap-4 items-start">
                <span className="text-4xl min-w-fit">🌟</span>
                <div>
                  <h2 className="subheading-romantic mb-3">The Beginning</h2>
                  <p className="text-gray-700 font-serif-body leading-relaxed">
                    It all started with a moment I'll never forget. You walked into my life like a ray of sunshine breaking through the clouds. There was something magical about that instant - a connection that felt deeper than words could ever express. It wasn't just love at first sight; it was recognition of a soul I've been waiting my whole life to meet.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div variants={itemVariants} className="card-romantic md:ml-12">
              <div className="flex gap-4 items-start">
                <span className="text-4xl min-w-fit">❤️</span>
                <div>
                  <h2 className="subheading-romantic mb-3">Why You</h2>
                  <p className="text-gray-700 font-serif-body leading-relaxed">
                    You make me want to be a better person every single day. Your kindness knows no bounds, your laughter is infectious, and your presence brings peace to my most restless moments. You see me - not just who I am, but who I'm trying to become. With you, I feel safe to be completely myself, vulnerabilities and all.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div variants={itemVariants} className="card-romantic">
              <div className="flex gap-4 items-start">
                <span className="text-4xl min-w-fit">🎵</span>
                <div>
                  <h2 className="subheading-romantic mb-3">Our Journey</h2>
                  <p className="text-gray-700 font-serif-body leading-relaxed">
                    Every moment we've shared has been a blessing. From quiet coffee dates where we lost track of time, to late night conversations about dreams and fears, to silly fights that only made us stronger - every chapter of our story matters. You've taught me that love is not just a feeling; it's a choice we make every day to show up for each other.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 4 */}
            <motion.div variants={itemVariants} className="card-romantic md:ml-12">
              <div className="flex gap-4 items-start">
                <span className="text-4xl min-w-fit">🌹</span>
                <div>
                  <h2 className="subheading-romantic mb-3">Forever & Always</h2>
                  <p className="text-gray-700 font-serif-body leading-relaxed">
                    I don't know what the future holds, but I know that I want to face it with you by my side. Whether we're climbing mountains or sitting in silence, whether we're crying or laughing until our sides hurt - I want to experience it all with you. You are my greatest adventure, my safest home, and my forever love.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            variants={fadeInUpVariants}
            className="text-center mt-16 pt-12 border-t border-white/30"
          >
            <p className="text-gray-600 font-serif-body text-lg italic">
              "I love you not because of who you are, but because of who I am when I'm with you."
            </p>
            <p className="text-gray-500 font-serif-body mt-4">— Selamanya milikmu ❤️</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
