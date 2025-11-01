'use client'

import { motion } from 'framer-motion'

const contactChannels = [
  { title: 'Customer care', detail: 'care@fruitsfromdahood.com', icon: '💌' },
  { title: 'Partnerships', detail: 'studio@fruitsfromdahood.com', icon: '🤝' },
  { title: 'Press', detail: 'press@fruitsfromdahood.com', icon: '📰' },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="px-6 py-16">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">We respond within 48h</p>
          <h1 className="mt-4 text-4xl font-headline font-bold md:text-5xl">Let&rsquo;s build something together</h1>
          <p className="mt-6 text-sm text-white/70 md:text-base">
            Whether you’re a creator, stockist, or part of the crew—drop us a note. We read every message and share it with the right squad member.
          </p>
        </motion.div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {contactChannels.map((channel) => (
            <motion.a
              key={channel.title}
              href={`mailto:${channel.detail}`}
              className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center text-sm text-white/70 backdrop-blur hover:border-white/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-3xl">{channel.icon}</div>
              <h2 className="mt-3 text-lg font-headline font-bold text-white">{channel.title}</h2>
              <p className="mt-2 text-sm text-neon-yellow">{channel.detail}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <motion.div
          className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-sm text-white/70"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-headline font-bold text-white">Studio hours</h2>
          <p className="mt-4">Monday – Friday: 10:00 – 18:00 CET</p>
          <p className="mt-1">Saturday – Sunday: By appointment</p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">FFDH Studio · Warsaw · Barcelona · Remote</p>
        </motion.div>
      </section>
    </main>
  )
}


