export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-8" style={{ color: 'var(--heading-color)' }}>About</h1>
      <div className="glass rounded-2xl p-8 space-y-6 leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
        <p>
          Hi, I&apos;m <span style={{ color: 'var(--accent)' }}>Katie</span> — and this is a collection of stories from
          road trips I&apos;ve taken across the United States.
        </p>
        <p>
          In <strong style={{ color: 'var(--heading-color)' }}>2016</strong>, my partner Chad and I packed a diesel Jetta and drove
          from Minnesota to the West Coast — through Colorado, Utah, Las Vegas, the Grand Canyon,
          and California. We slept in the car, skied real mountains for the first time, and learned
          that you should never leave glass Pellegrino bottles in a freezing trunk.
        </p>
        <p>
          In <strong style={{ color: 'var(--heading-color)' }}>2019</strong>, we hit the East Coast — exploring history, beaches,
          cities, and all the quirky stops in between.
        </p>
        <p>
          These posts were originally written on the road, in parking lots, cafés, and hotel rooms.
          They&apos;re raw, honest, and sometimes ridiculous — just like the trips themselves.
        </p>
        <p style={{ color: 'var(--link-color)', fontStyle: 'italic' }}>
          &ldquo;Katie, we need survival tools and we are out of Dawn for my survival pack.
          We better go to the store and get it.&rdquo; — Chad
        </p>
      </div>
    </div>
  );
}
