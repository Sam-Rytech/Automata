'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkeuoButton } from '@/components/ui/skeuo-button'

const socials = [
  {
    label: 'Twitter', href: 'https://twitter.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.735-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'GitHub', href: 'https://github.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Discord', href: 'https://discord.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
  {
    label: 'Telegram', href: 'https://t.me',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: 'Docs', href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2z" />
      </svg>
    ),
  },
]

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
  </svg>
)

export function Footer() {
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = () => {
    if (!open) { setOpen(true); return }
    if (email.trim()) {
      setSubmitted(true)
      setTimeout(() => { setSubmitted(false); setEmail(''); setOpen(false) }, 2500)
    }
  }

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: '#0f0f1a',
      padding: '4rem 3rem 3rem',
    }}>
      {/* Top */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem',
        marginBottom: '3.5rem',
      }}>
        {/* Brand */}
        <div>
          <p style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff', marginBottom: '0.4rem' }}>
            Automata
          </p>
          <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.6 }}>
            Built by Velocity Labs
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '0.2rem' }}>
            XCM v3 · Moonbeam · Polkadot
          </p>
        </div>

        {/* Subscribe */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.7rem' }}>
          <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Stay updated
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <AnimatePresence>
              {open && (
                <motion.div
                  key="email-input"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 210, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden', flexShrink: 0 }}
                >
                  {submitted ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ color: '#1db954', fontSize: '0.82rem', whiteSpace: 'nowrap', padding: '0 0.5rem' }}
                    >
                      ✓ You're in
                    </motion.p>
                  ) : (
                    <input
                      autoFocus
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(233,30,140,0.28)',
                        borderRadius: '8px',
                        padding: '0.7rem 1rem',
                        color: '#fff',
                        fontSize: '0.82rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        caretColor: '#e91e8c',
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <SkeuoButton size="sm" onClick={handleSubscribe}>
              <MailIcon />
              <span>{open && !submitted ? 'Send' : 'Subscribe'}</span>
            </SkeuoButton>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '2rem' }} />

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          {socials.map(({ href, icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              initial={{ color: '#666' }}
              whileHover={{ y: -3, color: '#ffffff' }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{ display: 'flex', alignItems: 'center', color: '#666' }}
            >
              {icon}
            </motion.a>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem' }}>
          © {new Date().getFullYear()} Automata. All rights reserved.
        </p>
      </div>
    </footer>
  )
}