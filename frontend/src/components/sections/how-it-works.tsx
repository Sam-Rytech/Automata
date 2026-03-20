'use client'
import { Reveal, RevealText } from '@/components/ui/reveal'

const steps = [
  {
    number: '01',
    title: 'Connect your wallet',
    description:
      'Link MetaMask to Moonbase Alpha with one click. Automata checks your network automatically and prompts a switch if needed — no manual RPC setup.',
    visual: <WalletMockup />,
  },
  {
    number: '02',
    title: 'Build your flow visually',
    description:
      'Drag SWAP, BRIDGE, STAKE, or TRANSFER chips onto the canvas. Chain them in any order. Configure each action — destination parachain, gas limit — without touching a single line of XCM.',
    visual: <FlowMockup />,
  },
  {
    number: '03',
    title: 'Execute in one click',
    description:
      'Hit Execute. Automata encodes your flow into XCM v3 bytes, fires them through the Moonbeam precompile, and shows you the live status — encoding → pending → confirmed on-chain.',
    visual: <SuccessMockup />,
  },
]

export function HowItWorks() {
  return (
    <section
      style={{
        background: 'var(--bg-primary)',
        padding: '10rem 0 12rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top border accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--accent-pink))',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3rem' }}>
        {/* Section header */}
        <div style={{ marginBottom: '7rem', textAlign: 'center' }}>
          <Reveal>
            <p
              style={{
                color: 'var(--accent-pink)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '1.2rem',
              }}
            >
              The process
            </p>
          </Reveal>
          <RevealText
            text="How it works"
            delay={0.1}
            className="how-it-works-title"
          />
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6rem',
                alignItems: 'center',
                direction: i % 2 !== 0 ? 'rtl' : 'ltr',
              }}
            >
              {/* Text side */}
              <div style={{ direction: 'ltr' }}>
                <Reveal delay={0.05}>
                  <span className="step-number">{step.number}</span>
                </Reveal>
                <Reveal delay={0.15}>
                  <h3
                    style={{
                      fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      marginTop: '-1rem',
                      marginBottom: '1.2rem',
                      color: '#fff',
                    }}
                  >
                    {step.title}
                  </h3>
                </Reveal>
                <Reveal delay={0.25}>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      maxWidth: '480px',
                    }}
                  >
                    {step.description}
                  </p>
                </Reveal>
                <Reveal delay={0.35}>
                  <span className="accent-line" style={{ marginTop: '2rem' }} />
                </Reveal>
              </div>

              {/* Visual side */}
              <Reveal direction={i % 2 === 0 ? 'right' : 'left'} delay={0.2}>
                <div style={{ direction: 'ltr' }}>{step.visual}</div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .how-it-works-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
      `}</style>
    </section>
  )
}

/* ── Step 1 visual: Wallet connection mockup ── */
function WalletMockup() {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        Connect Wallet
      </p>
      {/* MetaMask option */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(233,30,140,0.06)',
          border: '1px solid rgba(233,30,140,0.3)',
          borderRadius: '10px',
          padding: '1rem 1.2rem',
          marginBottom: '0.75rem',
          cursor: 'pointer',
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #e2761b, #e4761b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '16px' }}>🦊</span>
        </div>
        <div>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>MetaMask</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Browser extension</p>
        </div>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#1db954' }} />
      </div>
      {/* Network info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', marginTop: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Network</span>
        <span style={{ color: '#4C9FFF', fontSize: '0.8rem', fontWeight: 600 }}>Moonbase Alpha</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chain ID</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>1287</span>
      </div>
    </div>
  )
}

/* ── Step 2 visual: Mini flow builder mockup ── */
function FlowMockup() {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
      <div style={{ position: 'relative' }}>
        {/* Action chips at top */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'SWAP', color: '#e91e8c' },
            { label: 'BRIDGE', color: '#6a0dad' },
            { label: 'STAKE', color: '#1db954' },
            { label: 'TRANSFER', color: '#4C9FFF' },
          ].map(chip => (
            <span key={chip.label} style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              border: `1px solid ${chip.color}`,
              color: chip.color,
              background: `${chip.color}11`,
            }}>
              {chip.label}
            </span>
          ))}
        </div>
        {/* Flow nodes */}
        {[
          { label: 'SWAP', color: '#e91e8c', sub: 'AssetHub → USDC' },
          { label: 'BRIDGE', color: '#6a0dad', sub: 'Moonbeam (2004)' },
        ].map((node, i) => (
          <div key={i}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${node.color}55`,
              borderLeft: `3px solid ${node.color}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ color: node.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>{node.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{node.sub}</p>
              </div>
            </div>
            {i === 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '0.4rem 0' }}>
                <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom, #e91e8c, #6a0dad)' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Step 3 visual: Success / tx confirmed mockup ── */
function SuccessMockup() {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      {/* Status */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'rgba(29, 185, 84, 0.12)',
          border: '1px solid rgba(29, 185, 84, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1db954" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p style={{ color: '#1db954', fontWeight: 700, fontSize: '1rem' }}>Flow Executed</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>Confirmed on Moonbase Alpha</p>
      </div>
      {/* Tx hash */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Transaction</p>
        <p style={{ color: '#4C9FFF', fontSize: '0.78rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          0x3fa8...d91c
        </p>
      </div>
      {/* Event */}
      <div style={{ marginTop: '0.75rem', background: 'rgba(233,30,140,0.05)', border: '1px solid rgba(233,30,140,0.15)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Event emitted</p>
        <p style={{ color: 'var(--accent-pink)', fontSize: '0.8rem', fontFamily: 'monospace' }}>FlowExecuted(user, flowId)</p>
      </div>
    </div>
  )
}