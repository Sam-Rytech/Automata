'use client'
import { useState } from 'react'
import { SkeuoButton } from '@/components/ui/skeuo-button'
import type { StatusState } from './StatusPanel'
import type { Action } from '@/lib/types'

interface ExecuteButtonProps {
  actions: Action[]
  onStatusChange: (status: StatusState, message?: string, txHash?: string) => void
}

const LoaderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
)

export function ExecuteButton({ actions, onStatusChange }: ExecuteButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExecute = async () => {
    if (actions.length === 0 || loading) return
    setLoading(true)

    try {
      // Step 1 — encode
      onStatusChange('encoding')
      const { generatePayload } = await import('@/lib/api')
      const { payload } = await generatePayload(actions)

      // Step 2 — execute on-chain
      onStatusChange('pending')
      const { executeFlow } = await import('@/lib/contract')
      const tx = await executeFlow(payload)
      await tx.wait()

      // Step 3 — success
      const { saveToHistory } = await import('@/lib/history')
      saveToHistory({
        flowId: tx.hash,
        txHash: tx.hash,
        timestamp: Date.now(),
        actionCount: actions.length,
      })
      onStatusChange('success', undefined, tx.hash)
    } catch (err: any) {
      const msg = err?.reason ?? err?.message ?? 'Execution failed'
      onStatusChange('error', msg)
    } finally {
      setLoading(false)
    }
  }

  const disabled = actions.length === 0 || loading

  return (
    <SkeuoButton
      onClick={handleExecute}
      style={disabled ? { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' } : {}}
    >
      {loading ? (
        <>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-flex' }}>
            <LoaderIcon />
          </span>
          <span>Executing...</span>
        </>
      ) : (
        <>
          <span>Execute</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </SkeuoButton>
  )
}