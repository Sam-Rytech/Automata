'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlowBuilder } from '@/components/FlowBuilder'
import { StatusPanel, type StatusState } from '@/components/StatusPanel'
import { ExecuteButton } from '@/components/ExecuteButton'
import { SkeuoButton } from '@/components/ui/skeuo-button'
import type { Action } from '@/lib/types'

const ACTION_COLORS: Record<string, string> = {
  SWAP: '#e91e8c', BRIDGE: '#9d5ff5', STAKE: '#1db954', TRANSFER: '#4C9FFF',
}

/* ── Simulate dialog ── */
interface SimResult {
  estimatedFee: string
  gasEstimate: string
  warnings: string[]
  safe: boolean
}

function SimulateDialog({ result, onClose }: { result: SimResult; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'linear-gradient(145deg, #1c1c30, #141428)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          margin: '1rem',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em' }}>
            Simulation Result
          </h3>
          <span style={{
            padding: '0.2rem 0.7rem',
            borderRadius: '999px',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            background: result.safe ? 'rgba(29,185,84,0.12)' : 'rgba(255,165,0,0.12)',
            border: `1px solid ${result.safe ? 'rgba(29,185,84,0.3)' : 'rgba(255,165,0,0.3)'}`,
            color: result.safe ? '#1db954' : '#ffa500',
          }}>
            {result.safe ? 'Looks Good' : 'Proceed with caution'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Estimated Fee', value: result.estimatedFee },
            { label: 'Gas Estimate', value: result.gasEstimate },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '0.65rem 0.9rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
            }}>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>{row.label}</span>
              <span style={{ color: '#ccc', fontSize: '0.8rem', fontFamily: 'monospace' }}>{row.value}</span>
            </div>
          ))}

          {result.warnings.length > 0 && (
            <div style={{
              padding: '0.75rem 0.9rem',
              background: 'rgba(255,165,0,0.05)',
              border: '1px solid rgba(255,165,0,0.2)',
              borderRadius: '8px',
            }}>
              <p style={{ color: '#ffa500', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Warnings
              </p>
              {result.warnings.map((w, i) => (
                <p key={i} style={{ color: '#cc8800', fontSize: '0.78rem', lineHeight: 1.5 }}>• {w}</p>
              ))}
            </div>
          )}
        </div>

        <SkeuoButton size="sm" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Close
        </SkeuoButton>
      </motion.div>
    </motion.div>
  )
}

/* ── Config panel content ── */
function ConfigPanel({
  selectedNode,
  status,
  message,
  txHash,
  actions,
  onStatusChange,
}: {
  selectedNode: { id: string; type: string; data: any } | null
  status: StatusState
  message?: string
  txHash?: string
  actions: Action[]
  onStatusChange: (s: StatusState, m?: string, h?: string) => void
}) {
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<SimResult | null>(null)

  const handleSimulate = async () => {
    if (actions.length === 0) return
    setSimulating(true)
    try {
      const { simulateFlow } = await import('@/lib/api')
      const result = await simulateFlow(actions)
      setSimResult(result)
    } catch {
      setSimResult({ estimatedFee: '~0.01 DEV', gasEstimate: '5,000,000', warnings: ['Backend unreachable — estimate only'], safe: false })
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Panel header */}
      <div style={{
        padding: '1rem 1.2rem 0.8rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{ color: '#444', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {selectedNode ? 'Selected Node' : 'Configuration'}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.2rem' }}>
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key="node-config"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Type badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '999px',
                border: `1px solid ${ACTION_COLORS[selectedNode.type]}44`,
                background: `${ACTION_COLORS[selectedNode.type]}0d`,
                marginBottom: '1.2rem',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: ACTION_COLORS[selectedNode.type],
                }} />
                <span style={{
                  color: ACTION_COLORS[selectedNode.type],
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                }}>
                  {selectedNode.type}
                </span>
              </div>

              {/* Fields */}
              {[
                { label: 'Node ID', value: selectedNode.id, mono: true },
                { label: 'Destination Para ID', value: String(selectedNode.data?.destinationParaId ?? '—'), mono: true },
                { label: 'Gas Limit', value: String(selectedNode.data?.gasLimit ?? '—'), mono: true },
              ].map(field => (
                <div key={field.label} style={{ marginBottom: '0.9rem' }}>
                  <p style={{ color: '#444', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {field.label}
                  </p>
                  <p style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: field.mono ? 'monospace' : 'inherit' }}>
                    {field.value}
                  </p>
                </div>
              ))}

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1rem 0' }} />
              <p style={{ color: '#444', fontSize: '0.72rem', lineHeight: 1.6 }}>
                Click a node on the canvas to edit its settings directly.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty-config"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Flow summary */}
              {actions.length > 0 ? (
                <div>
                  <p style={{ color: '#555', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                    Flow ({actions.length} {actions.length === 1 ? 'action' : 'actions'})
                  </p>
                  {actions.map((a, i) => (
                    <div key={a.id} className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: `${ACTION_COLORS[a.type]}18`,
                        border: `1px solid ${ACTION_COLORS[a.type]}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.55rem', fontWeight: 700, color: ACTION_COLORS[a.type],
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ color: '#888', fontSize: '0.75rem' }}>{a.type}</span>
                      <span style={{ color: '#444', fontSize: '0.72rem', fontFamily: 'monospace', marginLeft: 'auto' }}>
                        →{a.destinationParaId}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#333', fontSize: '0.78rem', lineHeight: 1.7 }}>
                  No actions added yet. Drag chips from the canvas to build your flow.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div style={{
        padding: '0.8rem 1.2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}>
        {/* Simulate */}
        <button
          onClick={handleSimulate}
          disabled={actions.length === 0 || simulating}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            color: actions.length === 0 ? '#333' : '#888',
            fontSize: '0.78rem',
            fontFamily: 'inherit',
            cursor: actions.length === 0 ? 'not-allowed' : 'pointer',
            letterSpacing: '0.06em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (actions.length > 0) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = '#ccc'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = actions.length === 0 ? '#333' : '#888'
          }}
        >
          {simulating ? 'Simulating...' : 'Simulate'}
        </button>

        {/* Execute */}
        <ExecuteButton actions={actions} onStatusChange={onStatusChange} />
      </div>

      {/* Status */}
      <StatusPanel status={status} message={message} txHash={txHash} />

      {/* Simulate dialog */}
      <AnimatePresence>
        {simResult && <SimulateDialog result={simResult} onClose={() => setSimResult(null)} />}
      </AnimatePresence>
    </div>
  )
}

/* ── Main page ── */
export default function BuildPage() {
  const [actions, setActions] = useState<Action[]>([])
  const [status, setStatus] = useState<StatusState>('idle')
  const [statusMessage, setStatusMessage] = useState<string | undefined>()
  const [txHash, setTxHash] = useState<string | undefined>()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const handleStatusChange = useCallback((s: StatusState, m?: string, h?: string) => {
    setStatus(s)
    setStatusMessage(m)
    setTxHash(h)
  }, [])

  const handleActionsChange = useCallback((newActions: Action[]) => {
    setActions(newActions)
    if (newActions.length === 0) {
      setStatus('idle')
      setStatusMessage(undefined)
      setTxHash(undefined)
    }
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        background: '#0f0f1a',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '56px', // nav height
      }}
    >
      {/* Page header */}
      <div style={{
        padding: '0.8rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em' }}>
            Flow Builder
          </h1>
          <p style={{ color: '#444', fontSize: '0.72rem', marginTop: '1px' }}>
            Compose cross-chain actions visually
          </p>
        </div>
        {actions.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              background: 'rgba(233,30,140,0.1)',
              border: '1px solid rgba(233,30,140,0.25)',
              color: '#e91e8c',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {actions.length} {actions.length === 1 ? 'action' : 'actions'}
          </motion.span>
        )}
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Canvas — 65% */}
        <div style={{
          flex: '0 0 65%',
          position: 'relative',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          <FlowBuilder onChange={handleActionsChange} />
        </div>

        {/* Config panel — 35% */}
        <div style={{
          flex: '0 0 35%',
          background: 'linear-gradient(180deg, #141428 0%, #0f0f1e 100%)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <ConfigPanel
            selectedNode={null}
            status={status}
            message={statusMessage}
            txHash={txHash}
            actions={actions}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  )
}