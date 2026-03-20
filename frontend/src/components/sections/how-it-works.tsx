'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion'
import { SkeuoButton } from '@/components/ui/skeuo-button'

/* ── 3D Tilt Card ── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 120, damping: 18 })
  const springY = useSpring(y, { stiffness: 120, damping: 18 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-7deg', '7deg'])
  const glowX = useTransform(springX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(springY, [-0.5, 0.5], ['0%', '100%'])

  return (
    <motion.div
      ref={ref}
      onMouseMove={e => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{
        rotateX, rotateY,
        transformStyle: 'preserve-3d',
        perspective: '800px',
        borderRadius: '20px',
        background: 'linear-gradient(145deg, #1c1c30 0%, #141428 60%, #0f0f1e 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 0 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.5), 0 16px 48px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        cursor: 'default',
        padding: '2rem',
      }}
      whileHover={{
        boxShadow: '0 2px 0 0 rgba(255,255,255,0.05) inset, 0 8px 40px rgba(0,0,0,0.6), 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(233,30,140,0.18), 0 0 100px rgba(233,30,140,0.07)',
      }}
    >
      {/* Moving spotlight */}
      <motion.div
        style={{
          position: 'absolute',
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)',
          left: glowX, top: glowY,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  )
}

/* ── Section reveal ── */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const steps = [
  {
    number: '01',
    title: 'Connect your wallet',
    description: 'Link MetaMask to Moonbase Alpha with one click. Automata checks your network automatically and prompts a switch if needed — no manual RPC setup required.',
    visual: <WalletMockup />,
  },
  {
    number: '02',
    title: 'Build your flow visually',
    description: 'Drag SWAP, BRIDGE, STAKE, or TRANSFER chips onto the canvas. Chain them in any order and configure each action — destination parachain, gas limit — without touching a line of XCM.',
    visual: <FlowMockup />,
  },
  {
    number: '03',
    title: 'Execute in one click',
    description: 'Hit Execute. Automata encodes your flow into XCM v3 bytes, fires them through the Moonbeam precompile, and shows you live status — encoding → pending → confirmed on-chain.',
    visual: <SuccessMockup />,
  },
]

export function HowItWorks() {
  return (
    <section style={{
      background: '#0f0f1a',
      padding: '11rem 0 13rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top needle */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '1px', height: '80px',
        background: 'linear-gradient(to bottom, transparent, #e91e8c)',
      }} />

      {/* Background radial bloom */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(106,13,173,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3rem' }}>
        {/* Header */}
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: '7rem' }}>
            <p style={{
              color: '#e91e8c',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '1.2rem',
            }}>
              The process
            </p>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#fff',
            }}>
              How it works
            </h2>
          </div>
        </FadeUp>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          {steps.map((step, i) => (
            <FadeUp key={step.number} delay={0.1}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5rem',
                alignItems: 'center',
                direction: i % 2 !== 0 ? 'rtl' : 'ltr',
              }}>
                {/* Text */}
                <div style={{ direction: 'ltr' }}>
                  <span style={{
                    fontSize: 'clamp(5rem, 9vw, 8.5rem)',
                    fontWeight: 800,
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(233,30,140,0.14)',
                    lineHeight: 1,
                    display: 'block',
                    userSelect: 'none',
                  }}>
                    {step.number}
                  </span>
                  <h3 style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginTop: '-0.6rem',
                    marginBottom: '1.2rem',
                    color: '#fff',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: '#888',
                    fontSize: '1rem',
                    lineHeight: 1.85,
                    maxWidth: '430px',
                  }}>
                    {step.description}
                  </p>
                  <span style={{
                    display: 'block',
                    width: '40px', height: '2px',
                    background: '#e91e8c',
                    marginTop: '2rem',
                  }} />
                </div>

                {/* Card */}
                <div style={{ direction: 'ltr' }}>
                  <TiltCard>{step.visual}</TiltCard>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── MOCKUP 1: Wallet ── */
function WalletMockup() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.4rem' }}>
        Connect Wallet
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        background: 'rgba(233,30,140,0.05)',
        border: '1px solid rgba(233,30,140,0.22)',
        borderRadius: '12px',
        padding: '1rem 1.2rem',
        marginBottom: '0.6rem',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e2761b, #cd6116)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
        }}>🦊</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>MetaMask</p>
          <p style={{ color: '#666', fontSize: '0.72rem' }}>Browser extension</p>
        </div>
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: '#1db954',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1.2rem 0' }} />

      {[
        { label: 'Network', value: 'Moonbase Alpha', color: '#e91e8c' },
        { label: 'Chain ID', value: '1287', color: 'rgba(255,255,255,0.4)' },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
          <span style={{ color: '#666', fontSize: '0.78rem' }}>{row.label}</span>
          <span style={{ color: row.color, fontSize: '0.78rem', fontWeight: 600 }}>{row.value}</span>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#666', fontSize: '0.78rem' }}>Address</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
          0x3fa8...d91c
          <span style={{ animation: 'blink-cursor 1.1s step-end infinite', color: '#e91e8c', marginLeft: '1px' }}>|</span>
        </span>
      </div>
    </div>
  )
}

/* ── MOCKUP 2: Flow Builder ── */
function FlowMockup() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
        {[
          { label: 'SWAP', color: '#e91e8c' },
          { label: 'BRIDGE', color: '#9d5ff5' },
          { label: 'STAKE', color: '#1db954' },
          { label: 'TRANSFER', color: '#e91e8c' },
        ].map(chip => (
          <span key={chip.label} style={{
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
            padding: '0.28rem 0.7rem', borderRadius: '20px',
            border: `1px solid ${chip.color}44`,
            color: chip.color,
            background: `${chip.color}0d`,
            cursor: 'grab',
          }}>
            {chip.label}
          </span>
        ))}
      </div>

      <div style={{
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '1.2rem',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        background: 'rgba(255,255,255,0.01)',
      }}>
        {[
          { label: 'SWAP', color: '#e91e8c', sub: 'AssetHub → USDC' },
          { label: 'BRIDGE', color: '#9d5ff5', sub: 'Moonbeam (2004)' },
        ].map((node, i, arr) => (
          <div key={i}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${node.color}28`,
              borderLeft: `3px solid ${node.color}`,
              borderRadius: '8px',
              padding: '0.72rem 1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ color: node.color, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em' }}>{node.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.74rem', marginTop: '2px' }}>{node.sub}</p>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, opacity: 0.5 }} />
            </div>
            {i < arr.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '0.3rem 0' }}>
                <div style={{
                  width: 2, height: 28, borderRadius: '2px',
                  background: 'linear-gradient(to bottom, #e91e8c, #9d5ff5, #e91e8c)',
                  backgroundSize: '100% 200%',
                  animation: 'flow-travel 1.4s linear infinite',
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── MOCKUP 3: Success ── */
function SuccessMockup() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.2 }}
          style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'rgba(29,185,84,0.1)',
            border: '1px solid rgba(29,185,84,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.9rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.polyline
              points="20 6 9 17 4 12"
              stroke="#1db954" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
        <p style={{ color: '#1db954', fontWeight: 700, fontSize: '0.92rem' }}>Flow Executed</p>
        <p style={{ color: '#666', fontSize: '0.74rem', marginTop: '0.2rem' }}>Confirmed on Moonbase Alpha</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '0.6rem',
      }}>
        <p style={{ color: '#555', fontSize: '0.63rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Transaction Hash
        </p>
        <p style={{ color: '#e91e8c', fontSize: '0.78rem', fontFamily: 'monospace', animation: 'hash-glow 2.5s ease-in-out infinite' }}>
          0x3fa8c2...d91c
        </p>
      </div>

      <div style={{
        background: 'rgba(233,30,140,0.04)',
        border: '1px solid rgba(233,30,140,0.14)',
        borderRadius: '8px', padding: '0.8rem 1rem',
      }}>
        <p style={{ color: '#555', fontSize: '0.63rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Event Emitted
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
          FlowExecuted<span style={{ color: '#e91e8c' }}>(user, flowId)</span>
        </p>
      </div>
    </div>
  )
}