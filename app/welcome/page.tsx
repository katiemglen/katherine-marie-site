'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const features = [
  { emoji: '🗺️', title: 'Two Epic Road Trips', desc: '20 days across the West Coast (2016) and 45 days up the East Coast (2019). Every state, every meal, every time I killed the manual car.' },
  { emoji: '📊', title: 'Trip Stats', desc: 'Miles driven, money spent, showers taken (or not taken). The numbers don\'t lie.' },
  { emoji: '🎭', title: 'Browse by Mood', desc: 'Feeling beachy? Mountain-y? Hungry? Browse posts by vibe.' },
  { emoji: '📸', title: '73 Blog Posts', desc: 'Over 2,600 photos from the road. Chad\'s photography. My commentary. A match made in road trip heaven.' },
];

const secrets = [
  { emoji: '🐚🌵🦞', title: 'Hidden Emoji', desc: 'Look for small emoji hidden in the text of every blog post. Click them to discover fun facts about the places we visited. There are over 200 hidden across the site.' },
  { emoji: '💬', title: 'Katie Says...', desc: 'Scroll through any post and you might get a little message from me. Think of it as me whispering over your shoulder while you read.' },
  { emoji: '✨', title: 'Interactive Photos', desc: 'Hover over photos to see them come alive. Click any photo to see it full-screen.' },
  { emoji: '🌙', title: 'Dark Mode', desc: 'Toggle the sun/moon icon to switch between Golden Hour and Forest themes.' },
  { emoji: '📖', title: 'Story Mode', desc: 'Hit \'Read as Story\' on any post for an Instagram-style photo slideshow.' },
];

export default function WelcomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/a-drive-through-a-giants-land/20170102_081704.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 py-16 mx-4 max-w-2xl rounded-3xl"
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-white mb-4">
            Welcome to Our Adventures
          </h1>
          <p className="text-white/80 text-lg md:text-xl">
            The blog that saved us from 47 daily phone calls
          </p>
        </motion.div>
      </section>

      {/* Why This Exists */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={0}
          variants={fadeUp}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl mb-6" style={{ color: 'var(--heading-color)' }}>
            Why This Exists
          </h2>
          <div className="space-y-4 text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground)' }}>
            <p>
              Let&apos;s be honest — when Chad and I hit the road, our phones blew up. &ldquo;Are you alive?&rdquo; &ldquo;Where are you now?&rdquo; &ldquo;Did you eat today?&rdquo; We love you all, but we also love not answering the phone while standing on top of a mountain.
            </p>
            <p>
              So we built this blog. Every photo, every story, every questionable food decision — it&apos;s all here. This way, you get to ride along with us without us having to pull over and call everyone back. Win-win.
            </p>
            <p style={{ color: 'var(--muted-text)' }}>
              This started as a simple WordPress blog in 2016 for our first road trip. Now it&apos;s grown into something we&apos;re really proud of — a digital scrapbook of our adventures together.
            </p>
          </div>
        </motion.div>
      </section>

      {/* What You'll Find Here */}
      <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-24">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-center mb-10"
          style={{ color: 'var(--heading-color)' }}
        >
          What You&apos;ll Find Here
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--heading-color)' }}>{f.title}</h3>
              <p style={{ color: 'var(--muted-text)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hidden Secrets */}
      <section className="max-w-3xl mx-auto px-6 pb-16 md:pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
          style={{ border: '1px solid rgba(var(--accent-rgb), 0.2)' }}
        >
          <div className="absolute inset-0 opacity-5" style={{
            background: 'radial-gradient(circle at 30% 50%, var(--accent), transparent 60%)',
          }} />
          <div className="relative z-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl mb-2" style={{ color: 'var(--heading-color)' }}>
              🔍 This Website Has Secrets
            </h2>
            <p className="mb-8" style={{ color: 'var(--muted-text)' }}>
              We hid surprises throughout the entire site. Here&apos;s what to look for:
            </p>
            <div className="space-y-6">
              {secrets.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i + 1}
                  variants={fadeUp}
                  className="flex gap-4"
                >
                  <span className="text-2xl shrink-0 mt-1">{s.emoji}</span>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--heading-color)' }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-text)' }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-center text-lg" style={{ color: 'var(--accent)' }}>
              Can you find all the hidden emoji? Happy exploring! 🗺️
            </p>
          </div>
        </motion.div>
      </section>

      {/* About Us */}
      <section className="max-w-3xl mx-auto px-6 pb-20 md:pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="text-center"
        >
          <div className="glass rounded-3xl p-8 md:p-12">
            <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
              We&apos;re Katie &amp; Chad. We believe the best memories are made on the open road with bad coffee and good company. Thanks for being here. Thanks for caring enough to check in on us. And thanks for finally not calling.
            </p>
            <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl" style={{ color: 'var(--accent)' }}>
              With love &amp; adventure, Katherine Marie ✦
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
