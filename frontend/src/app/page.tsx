'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RevealText, Reveal } from '@/components/ui/reveal'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Footer } from '@/components/layout/footer'

// SSR-safe dynamic import for the canvas animation
const SpiralAnimation = dynamic(
  () => import('@/components/ui/spiral-animation').then(m => ({ default: m.SpiralAnimation })),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Spiral animation layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <SpiralAnimation />
        </div>

        {/* Overlay gradient so text is always readable */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15,15,26,0.1) 0%, rgba(15,15,26,0.6) 100%)',
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '0 2rem',
          }}
        >
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--accent-pink)',
                border: '1px solid rgba(233,30,140,0.35)',
                padding: '0.35rem 1.1rem',
                borderRadius: '999px',
                background: 'rgba(233,30,140,0.07)',
              }}
            >
              Built on Polkadot · XCM v3
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#fff',
              maxWidth: '900px',
            }}
          >
            <RevealText text="Cross-Chain Flows." delay={0.4} />
            <RevealText text="One Click." delay={0.55} />
          </h1>

          {/* Subheadline */}
          <Reveal delay={0.75}>
            <p
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: 400,
                maxWidth: '500px',
                lineHeight: 1.7,
              }}
            >
              Drag, configure, execute. No XCM knowledge required.
            </p>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.9}>
            <Link href="/build" style={{ textDecoration: 'none' }}>
              <button className="btn-launch" style={{ position: 'relative' }}>
                <div className="btn-ring" />
                <span>Launch App</span>
              </button>
            </Link>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.25)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(233,30,140,0.6), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  )
}