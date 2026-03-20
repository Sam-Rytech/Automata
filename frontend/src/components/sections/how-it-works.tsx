'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Reveal, RevealText, RevealGroup } from '@/components/ui/reveal'

/* ── Tilt card wrapper ── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ['6deg', '-6deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-6deg', '6deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      className="hiw-card"
    >
      {children}
    </motion.div>
  )
}

const steps = [
  {
    number: '01',
    title: 'Connect your wallet',
    description:
      'Link MetaMask to Moonbase Alpha with one click. Automata checks your network automatically and prompts a switch if needed.',
    visual: <WalletMockup />,
  },
  {
    number: '02',
    title: 'Build your flow visually',
    description:
      'Drag SWAP, BRIDGE, STAKE, or TRANSFER chips onto the canvas. Chain them in any order. Configure each action without touching a single line of XCM.',
    visual: <FlowMockup />,
  },
  {
    number: '03',
    title: 'Execute in one click',
    description:
      'Hit Execute. Automata encodes your flow into XCM v3 bytes, fires them through the Moonbeam precompile, and shows live status — encoding → pending → confirmed.',
    visual: <SuccessMockup />,
  },
]

export function HowItWorks() {
  return (
    <section
      style={{
        background: 'var(--bg-primary)',
        padding: '11rem 0 13rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top connector */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '1px', height: '80px',
        background: 'linear-gradient(to bottom, transparent, var(--accent-pink))',
      }} />

      {/* Background radial */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(106,13,173,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3rem' }}>
        {/* Section header */}
        <div style={{ marginBottom: '7rem', textAlign: 'center' }}>
          <Reveal>
            <p style={{
              color: 'var(--accent-pink)',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '1.2rem',
            }}>
              The process
            </p>
          </Reveal>
          <div style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
          }}>
            <RevealText text="How it works" delay={0.1} />
          </div>
        </div>

        {/* Steps */}
        <RevealGroup stagger={0.18} delay={0.05}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5rem',
                alignItems: 'center',
                marginBottom: i < steps.length - 1 ? '8rem' : 0,
                direction: i % 2 !== 0 ? 'rtl' : 'ltr',
              }}
            >
              {/* Text */}
              <div style={{ direction: 'ltr' }}>
                <span className="step-number">{step.number}</span>
                <h3 style={{
                  fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginTop: '-0.8rem',
                  marginBottom: '1.2rem',
                  color: '#fff',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.85,
                  maxWidth: '440px',
                }}>
                  {step.description}
                </p>
                <span className="accent-line" style={{ marginTop: '2rem' }} />
              </div>

              {/* Tilt card mockup */}
              <div style={{ direction: 'ltr' }}>
                <TiltCard>
                  <div style={{ padding: '2rem' }}>
                    {step.visual}
                  </div>
                </TiltCard>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   STEP 1 — Wallet connect mockup
───────────────────────────────────────── */
function WalletMockup() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.4rem' }}>
        Connect Wallet
      </p>

      {/* MetaMask row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(233,30,140,0.05)',
        border: '1px solid rgba(233,30,140,0.25)',
        borderRadius: '12px',
        padding: '1rem 1.2rem',
        marginBottom: '0.75rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e2761b, #cd6116)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
        }}>
          🦊
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>MetaMask</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px' }}>Browser extension</p>
        </div>
        {/* Pulsing connected dot */}
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: '#1db954',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.2rem 0' }} />

      {/* Network row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Network</span>
        <span style={{ color: '#e91e8c', fontSize: '0.78rem', fontWeight: 600 }}>Moonbase Alpha</span>
      </div>

      {/* Chain ID row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Chain ID</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontFamily: 'monospace' }}>1287</span>
      </div>

      {/* Address row with blinking cursor */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Address</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
          0x3fa8...d91c
          <span style={{ animation: 'blink-cursor 1.1s step-end infinite', opacity: 1, color: 'var(--accent-pink)', marginLeft: '1px' }}>|</span>
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   STEP 2 — Flow builder mockup
───────────────────────────────────────── */
function FlowMockup() {
  const chips = [
    { label: 'SWAP', color: '#e91e8c' },
    { label: 'BRIDGE', color: '#9d5ff5' },
    { label: 'STAKE', color: '#1db954' },
    { label: 'TRANSFER', color: '#e91e8c' },
  ]

  const nodes = [
    { label: 'SWAP', color: '#e91e8c', sub: 'AssetHub → USDC' },
    { label: 'BRIDGE', color: '#9d5ff5', sub: 'Moonbeam (2004)' },
  ]

  return (
    <div>
      {/* Chips */}
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.6rem', flexWrap: 'wrap' }}>
        {chips.map(chip => (
          <span key={chip.label} style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em',
            padding: '0.3rem 0.7rem',
            borderRadius: '20px',
            border: `1px solid ${chip.color}55`,
            color: chip.color,
            background: `${chip.color}0d`,
            cursor: 'grab',
          }}>
            {chip.label}
          </span>
        ))}
      </div>

      {/* Dot grid bg */}
      <div style={{
        background: 'rgba(255,255,255,0.01)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        padding: '1.2rem',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}>
        {nodes.map((node, i) => (
          <div key={i}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${node.color}33`,
              borderLeft: `3px solid ${node.color}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ color: node.color, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em' }}>{node.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '2px' }}>{node.sub}</p>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, opacity: 0.6 }} />
            </div>
            {i < nodes.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '0.35rem 0' }}>
                {/* Animated gradient connector */}
                <div style={{
                  width: 2,
                  height: 28,
                  borderRadius: '2px',
                  background: 'linear-gradient(to bottom, #e91e8c, #9d5ff5, #e91e8c)',
                  backgroundSize: '100% 200%',
                  animation: 'flow-travel 1.5s linear infinite',
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   STEP 3 — Success / tx confirmed mockup
───────────────────────────────────────── */
function SuccessMockup() {
  return (
    <div>
      {/* Success header */}
      <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
          style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'rgba(29, 185, 84, 0.1)',
            border: '1px solid rgba(29, 185, 84, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.9rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline
              points="20 6 9 17 4 12"
              stroke="#1db954"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="0"
              style={{ animation: 'draw-check 0.5s ease 0.6s both' }}
            />
          </svg>
        </motion.div>
        <p style={{ color: '#1db954', fontWeight: 700, fontSize: '0.95rem' }}>Flow Executed</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Confirmed on Moonbase Alpha</p>
      </div>

      {/* Tx hash */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '0.8rem 1rem',
        marginBottom: '0.6rem',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Transaction Hash
        </p>
        <p style={{
          color: '#e91e8c',
          fontSize: '0.78rem',
          fontFamily: 'monospace',
          animation: 'hash-glow 2.5s ease-in-out infinite',
        }}>
          0x3fa8c2...d91c
        </p>
      </div>

      {/* Event emitted */}
      <div style={{
        background: 'rgba(233,30,140,0.04)',
        border: '1px solid rgba(233,30,140,0.15)',
        borderRadius: '8px',
        padding: '0.8rem 1rem',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Event Emitted
        </p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
          FlowExecuted<span style={{ color: '#e91e8c' }}>(user, flowId)</span>
        </p>
      </div>
    </div>
  )
}