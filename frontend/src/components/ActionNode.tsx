'use client'
import { useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { motion } from 'framer-motion'

export type ActionType = 'SWAP' | 'BRIDGE' | 'STAKE' | 'TRANSFER'

export interface ActionNodeData {
  type: ActionType
  destinationParaId: number
  gasLimit: number
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<ActionNodeData>) => void
}

const ACTION_CONFIG: Record<ActionType, { color: string; bg: string; icon: string }> = {
  SWAP:     { color: '#e91e8c', bg: 'rgba(233,30,140,0.08)',  icon: '⇄' },
  BRIDGE:   { color: '#9d5ff5', bg: 'rgba(157,95,245,0.08)', icon: '⬡' },
  STAKE:    { color: '#1db954', bg: 'rgba(29,185,84,0.08)',   icon: '◈' },
  TRANSFER: { color: '#4C9FFF', bg: 'rgba(76,159,255,0.08)', icon: '→' },
}

const PARACHAINS = [
  { label: 'AssetHub (1000)',  value: 1000 },
  { label: 'Moonbeam (2004)', value: 2004 },
  { label: 'Astar (2006)',    value: 2006 },
  { label: 'Custom',          value: 0 },
]

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

export function ActionNode({ id, data, selected }: NodeProps<ActionNodeData>) {
  const cfg = ACTION_CONFIG[data.type]
  const [customParaId, setCustomParaId] = useState('')
  const isCustom = data.destinationParaId === 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 220,
        background: 'linear-gradient(145deg, #1c1c30 0%, #141428 100%)',
        border: `1px solid ${selected ? cfg.color + '80' : 'rgba(255,255,255,0.08)'}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: '10px',
        boxShadow: selected
          ? `0 0 0 1px ${cfg.color}40, 0 8px 32px rgba(0,0,0,0.5), 0 0 40px ${cfg.color}12`
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: cfg.color,
          border: `2px solid #0f0f1a`,
          width: 10, height: 10,
          top: -5,
        }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '0.7rem 0.8rem 0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{
            width: 24, height: 24,
            borderRadius: '6px',
            background: cfg.bg,
            border: `1px solid ${cfg.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px',
            color: cfg.color,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {cfg.icon}
          </span>
          <span style={{
            color: cfg.color,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
          }}>
            {data.type}
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={() => data.onDelete(id)}
          className="flex items-center justify-center transition-colors duration-150"
          style={{
            width: 22, height: 22,
            borderRadius: '5px',
            background: 'rgba(255,68,68,0.0)',
            border: '1px solid rgba(255,68,68,0.0)',
            color: '#555',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,68,68,0.12)'
            e.currentTarget.style.borderColor = 'rgba(255,68,68,0.3)'
            e.currentTarget.style.color = '#ff4444'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color = '#555'
          }}
        >
          <TrashIcon />
        </button>
      </div>

      {/* Config fields */}
      <div style={{ padding: '0.6rem 0.8rem 0.7rem' }}>
        {/* Destination parachain */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ color: '#555', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
            Destination
          </label>
          <select
            value={data.destinationParaId}
            onChange={e => data.onUpdate(id, { destinationParaId: Number(e.target.value) })}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              color: '#ccc',
              fontSize: '0.75rem',
              padding: '0.35rem 0.6rem',
              fontFamily: 'inherit',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
            }}
          >
            {PARACHAINS.map(p => (
              <option key={p.value} value={p.value} style={{ background: '#1a1a2e' }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom para ID input */}
        {isCustom && (
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              placeholder="Para ID"
              value={customParaId}
              onChange={e => {
                setCustomParaId(e.target.value)
                if (e.target.value) data.onUpdate(id, { destinationParaId: Number(e.target.value) })
              }}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${cfg.color}40`,
                borderRadius: '6px',
                color: '#ccc',
                fontSize: '0.75rem',
                padding: '0.35rem 0.6rem',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Gas limit */}
        <div>
          <label style={{ color: '#555', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
            Gas Limit
          </label>
          <input
            type="number"
            value={data.gasLimit}
            onChange={e => data.onUpdate(id, { gasLimit: Number(e.target.value) })}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              color: '#ccc',
              fontSize: '0.75rem',
              padding: '0.35rem 0.6rem',
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: cfg.color,
          border: `2px solid #0f0f1a`,
          width: 10, height: 10,
          bottom: -5,
        }}
      />
    </motion.div>
  )
}