'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const values = [
  {
    icon: '🎯',
    title: 'Authenticity',
    description: 'Everything starts with real stories from real neighbourhoods. No gloss, no clichés.'
  },
  {
    icon: '🧠',
    title: 'Human × AI',
    description: 'We blend craft with intelligent systems to document emotions in motion.'
  },
  {
    icon: '🌍',
    title: 'Community',
    description: 'FFDH is a safe space for expression—a collaborative canvas for fruits, friends, and fam.'
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Fruits From Da Hood</p>
          <h1 className="mt-4 text-4xl font-headline font-bold md:text-6xl">We document the emotional pulse of the city</h1>
          <p className="mt-6 text-sm text-white/70 md:text-base">
            FFDH is a studio, a streetwear label, and a living archive of fruit-inspired characters navigating urban life. We
            combine premium textiles, bold silhouettes, and AI-crafted narratives to capture how the block feels—night after night.
          </p>
        </motion.div>
      </section>

      <section className="px-6 py-10">
        <motion.div
          className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4 text-sm text-white/70">
            <h2 className="text-2xl font-headline font-bold text-white">Origin story</h2>
            <p>
              Born in Warsaw, raised across global blocks, Fruits From Da Hood started as a pop-up print experiment. We asked a
              simple question: what if fruit had a voice, an outfit, and a destiny? The answer became a movement—part comic, part
              couture, part neighbourhood therapy session.
            </p>
            <p>
              In 2025 we launched <Link href="/rewir" className="text-neon-yellow hover:underline">Rewir</Link>, our AI emotional scene system. It listens to the city and
              generates poetic micro-stories—glitches of empathy, fragments of joy, heatwaves of anger. Every reaction you leave feeds the next drop.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/70">
            <h3 className="text-lg font-headline font-bold text-white">What we make</h3>
            <ul className="mt-4 space-y-3">
              <li>• Limited-run streetwear capsules—ethically produced, digitally tracked.</li>
              <li>• AI-driven emotional scenes that shift colour palettes based on mood data.</li>
              <li>• Character lore, soundscapes, and physical activations for the community.</li>
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {values.map((value) => (
            <motion.div
              key={value.title}
              className="rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-3xl">{value.icon}</div>
              <h3 className="mt-4 text-xl font-headline font-bold text-white">{value.title}</h3>
              <p className="mt-3 text-sm text-white/70">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <motion.div
          className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-black/70 p-10 text-center backdrop-blur"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-headline font-bold text-white">Join the Rewir network</h2>
          <p className="text-sm text-white/70">
            Tap into the scenes, remix the lore, or collaborate on upcoming drops. We build in public—fabrics, pixels, and feelings included.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/rewir" className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-black hover:bg-white/90">
              Explore Rewir
            </Link>
            <Link href="/contact" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 hover:border-white/40 hover:text-white">
              Partner with us
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}


