'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { r2Image } from '@/lib/r2';

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
  { emoji: '📸', title: '73 Blog Posts', desc: 'Chad and Katie\'s photography. My commentary with snippets of Chad quotes. A match made in road trip heaven.' },
];

const secrets = [
  { emoji: '🐚🌵🦞', title: 'Hidden Emoji', desc: 'See a little emoji tucked into the text? Click it. There are over 200 of them hiding across the site, each with a fun fact about where we were.' },
  { emoji: '💬', title: 'Katie Says...', desc: 'Keep scrolling and you might hear from me. Little notes pop up as you read — like I\'m sitting next to you telling you the parts I left out of the blog.' },
  { emoji: '✨', title: 'Interactive Photos', desc: 'Hover over photos and they\'ll react. Click any photo to see it full-screen. Go ahead, get nosy with our pictures.' },
  { emoji: '🌙', title: 'Dark Mode', desc: 'See the little sun/moon icon up top? Toggle it. The whole site transforms from Golden Hour to Forest at Twilight. It\'s kind of magical.' },
  { emoji: '📖', title: 'Story Mode', desc: 'Hit "Read as Story" on any post and it turns into an Instagram-style slideshow. Perfect for when you want to just look at pictures (we won\'t judge).' },
];

export default function WelcomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${r2Image('/images/tampas-chickens/20190415_173302.jpg')})` }}
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
              OK so here&apos;s the deal. When Chad and I hit the road in 2016, we learned something real fast: everyone we know and love has zero chill when it comes to our safety. Our phones were blowing up. Every. Single. Day. &ldquo;Are you alive?&rdquo; &ldquo;Where are you sleeping tonight?&rdquo; &ldquo;Katie, did you eat actual food or just gas station snacks again?&rdquo;
            </p>
            <p>
              And look — we get it. We love you for caring. But when you&apos;re standing on the edge of the Grand Canyon watching the sun go down, the last thing you want to do is answer 14 texts from family members who think you drove off a cliff because you didn&apos;t respond in 20 minutes.
            </p>
            <p>
              So we made this. Every photo, every story, every questionable sleeping arrangement in a Cracker Barrel parking lot — all documented right here. You get to ride along with us. We get to actually enjoy the ride. Everybody wins.
            </p>
            <p style={{ color: 'var(--muted-text)' }}>
              What started as a simple WordPress blog we threw together before our first road trip has turned into something we&apos;re genuinely proud of. Two major trips. 73 blog posts. Over 2,600 photos. And now, a website we poured our hearts into rebuilding — because these memories deserve better than a basic template.
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
            <p className="mb-8" style={{ color: 'var(--foreground)' }}>
              We had way too much fun building this. There are surprises hidden all over the place, and we want you to find them. Here&apos;s what you&apos;re looking for:
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
              Think you can find all 200+ hidden emoji? We dare you. 🗺️
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
            <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>
              We&apos;re Katie &amp; Chad. We sleep in parking lots, argue about directions (he&apos;s always right and we don&apos;t talk about it), and believe the best memories come from saying &ldquo;let&apos;s just go&rdquo; and figuring it out on the way.
            </p>
            <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: 'var(--foreground)' }}>
              Thank you for being here. Seriously. Thank you for caring about us enough to follow along, to check in, to read these stories. You being here means we get to relive these adventures every time someone new discovers them. And that&apos;s the whole point.
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
