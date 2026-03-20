'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RevealText, Reveal } from '@/components/ui/reveal'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Footer } from '@/components/layout/footer'

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
          minHeight: '600px',
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Full-bleed spiral — no size constraints */}
        <div style={{ position: 'absolute', inset: '-10%', zIndex: 0 }}>
          <SpiralAnimation />
        </div>

        {/* Radial vignette so text stays readable */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(15,15,26,0.55) 65%, rgba(15,15,26,0.85) 100%)',
          }}
        />

        {/* Hero content — centered, stacked */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            padding: '0 1.5rem',
            width: '100%',
            maxWidth: '900px',
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--accent-pink)',
                border: '1px solid rgba(233,30,140,0.3)',
                padding: '0.4rem 1.2rem',
                borderRadius: '999px',
                background: 'rgba(233,30,140,0.06)',
                whiteSpace: 'nowrap',
              }}
            >
              Built by Velocity Labs
            </span>
          </motion.div>

          {/* Headline — two intentional lines, fluid sizing */}
          <h1
            style={{
              fontSize: 'clamp(3.2rem, 9vw, 8rem)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#fff',
              width: '100%',
            }}
          >
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <RevealText text="Cross-Chain Flows." delay={0.35} />
            </span>
            <span style={{ display: 'block', overflow: 'hidden', marginTop: '0.15em' }}>
              <RevealText text="One Click." delay={0.5} />
            </span>
          </h1>

          {/* Subheadline */}
          <Reveal delay={0.7}>
            <p
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                fontWeight: 400,
                lineHeight: 1.7,
                maxWidth: '420px',
              }}
            >
              Drag, configure, execute.
              <br />No XCM knowledge required.
            </p>
          </Reveal>

          {/* Skeuomorphic Launch App button */}
          <Reveal delay={0.88}>
            <Link href="/build" style={{ textDecoration: 'none' }}>
              <button className="skeuo-btn">
                <span>Launch App</span>
                <svg
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.7 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
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
          <span style={{
            color: 'rgba(255,255,255,0.2)',
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              width: 1,
              height: 36,
              background: 'linear-gradient(to bottom, rgba(233,30,140,0.7), transparent)',
            }}
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