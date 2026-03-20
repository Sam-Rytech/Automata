'use client'
import { motion, AnimatePresence } from 'framer-motion'

export type StatusState = 'idle' | 'encoding' | 'pending' | 'success' | 'error'

interface StatusPanelProps {
  status: StatusState
  message?: string
  txHash?: string
}

const EXPLORER_BASE = 'https://moonbase.moonscan.io/tx/'

function truncateHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)
const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

/* Spinning loader */
function Spinner({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: 18, height: 18, flexShrink: 0,
        border: `2px solid ${color}22`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
      }}
    />
  )
}

export function StatusPanel({ status, message, txHash }: StatusPanelProps) {
  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '1rem 1.2rem',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.p
            key="idle"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{ color: '#444', fontSize: '0.78rem', letterSpacing: '0.05em' }}
          >
            Build a flow above to get started
          </motion.p>
        )}

        {status === 'encoding' && (
          <motion.div key="encoding" className="flex items-center gap-3"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <Spinner color="#9d5ff5" />
            <span style={{ color: '#9d5ff5', fontSize: '0.78rem' }}>Encoding XCM payload...</span>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div key="pending" className="flex items-center gap-3"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <Spinner color="#e91e8c" />
            <span style={{ color: '#e91e8c', fontSize: '0.78rem' }}>Waiting for confirmation...</span>
          </motion.div>
        )}

        {status === 'success' && txHash && (
          <motion.div key="success"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 w-full"
          >
            <div className="flex items-center gap-2">
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(29,185,84,0.15)',
                  border: '1px solid rgba(29,185,84,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <motion.polyline
                    points="20 6 9 17 4 12"
                    stroke="#1db954" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                </svg>
              </motion.div>
              <span style={{ color: '#1db954', fontSize: '0.78rem', fontWeight: 600 }}>Flow executed!</span>
            </div>

            {/* Tx hash row */}
            <div className="flex items-center gap-2">
              <span style={{ color: '#555', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                {truncateHash(txHash)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(txHash)}
                style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
                title="Copy hash"
              >
                <CopyIcon />
              </button>
              <a
                href={`${EXPLORER_BASE}${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#4C9FFF', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Explorer <ExternalIcon />
              </a>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div key="error" className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(255,68,68,0.12)',
              border: '1px solid rgba(255,68,68,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <span style={{ color: '#ff6666', fontSize: '0.78rem' }}>
              {message ?? 'Something went wrong'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}