'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SkeuoButton } from '@/components/ui/skeuo-button'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Footer } from '@/components/layout/footer'

const SpiralAnimation = dynamic(
  () => import('@/components/ui/spiral-animation').then(m => ({ default: m.SpiralAnimation })),
  { ssr: false }
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

function HeroLine({ text, delay }: { text: string; delay: number }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.div>
    </div>
  )
}

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden bg-black flex items-center justify-center"
        style={{ height: '100vh', minHeight: '640px' }}>

        {/* Full-bleed spiral */}
        <div className="absolute inset-0 z-0" style={{ margin: '-5%' }}>
          <SpiralAnimation />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 z-10" style={{
          background: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(15,15,26,0.5) 60%, rgba(15,15,26,0.88) 100%)',
        }} />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center gap-8 px-6 w-full max-w-5xl">

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-xs tracking-widest uppercase whitespace-nowrap"
            style={{
              color: '#e91e8c',
              border: '1px solid rgba(233,30,140,0.3)',
              padding: '0.4rem 1.2rem',
              borderRadius: '999px',
              background: 'rgba(233,30,140,0.06)',
              letterSpacing: '0.22em',
              fontSize: '0.7rem',
            }}
          >
            Built by Velocity Labs
          </motion.span>

          {/* Headline */}
          <h1 className="font-extrabold w-full m-0" style={{ letterSpacing: '-0.03em' }}>
            {/* Line 1 — forced single line */}
            <span
              className="block  overflow-hidden text-white"
              style={{ fontSize: 'clamp(2rem, 6.5vw, 6rem)', lineHeight: 1.0 }}
            >
              <HeroLine text="Cross-Chain Flows." delay={0.3} />
            </span>
            {/* Line 2 — dimmer for hierarchy */}
            <span
              className="block whitespace-nowrap overflow-hidden"
              style={{
                fontSize: 'clamp(1.8rem, 5.5vw, 5rem)',
                lineHeight: 1.05,
                color: 'rgba(255,255,255,0.65)',
                marginTop: '0.08em',
              }}
            >
              <HeroLine text="One Click." delay={0.48} />
            </span>
          </h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-center leading-relaxed max-w-xs"
            style={{ color: 'rgba(255,255,255,0.38)', fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)' }}
          >
            Drag, configure, execute.
            <br />No XCM knowledge required.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/build" className="no-underline">
              <SkeuoButton>
                <span>Launch App</span>
                <ArrowRight />
              </SkeuoButton>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="uppercase" style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.6rem', letterSpacing: '0.25em' }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #e91e8c, transparent)' }}
          />
        </motion.div>
      </section>

      <HowItWorks />
      <Footer />
    </main>
  )
}