'use client'
import { useState } from 'react'

interface SkeuoButtonProps {
  children: React.ReactNode
  onClick?: () => void
  size?: 'md' | 'sm'
  type?: 'button' | 'submit'
  style?: React.CSSProperties
}

export function SkeuoButton({
  children,
  onClick,
  size = 'md',
  type = 'button',
  style,
}: SkeuoButtonProps) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const pad = size === 'sm'
    ? { padding: '0.75rem 1.6rem', fontSize: '0.8rem', borderRadius: '8px' }
    : { padding: '1.1rem 3rem', fontSize: '0.95rem', borderRadius: '10px' }

  const shadowNormal = `
    0 1px 0 0 rgba(233,30,140,0.95) inset,
    1px 0 0 0 rgba(255,255,255,0.05) inset,
    -1px 0 0 0 rgba(0,0,0,0.35) inset,
    0 -5px 0 0 rgba(0,0,0,0.55) inset,
    0 0 0 1px rgba(233,30,140,0.2),
    0 7px 0 0 #080310,
    0 10px 24px rgba(0,0,0,0.65),
    0 0 50px rgba(233,30,140,0.08)
  `
  const shadowHover = `
    0 1px 0 0 rgba(233,30,140,1) inset,
    1px 0 0 0 rgba(255,255,255,0.08) inset,
    -1px 0 0 0 rgba(0,0,0,0.35) inset,
    0 -5px 0 0 rgba(0,0,0,0.55) inset,
    0 0 0 1px rgba(233,30,140,0.5),
    0 7px 0 0 #080310,
    0 14px 32px rgba(0,0,0,0.7),
    0 0 80px rgba(233,30,140,0.25)
  `
  const shadowPressed = `
    0 1px 0 0 rgba(233,30,140,0.6) inset,
    1px 0 0 0 rgba(255,255,255,0.03) inset,
    -1px 0 0 0 rgba(0,0,0,0.35) inset,
    0 -2px 0 0 rgba(0,0,0,0.55) inset,
    0 0 0 1px rgba(233,30,140,0.15),
    0 2px 0 0 #080310,
    0 4px 8px rgba(0,0,0,0.5),
    0 0 20px rgba(233,30,140,0.06)
  `

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.55rem',
        fontFamily: 'inherit',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#fff',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        userSelect: 'none',
        background: hovered
          ? 'linear-gradient(180deg, #321f3c 0%, #201428 45%, #180f20 100%)'
          : 'linear-gradient(180deg, #2a1a2e 0%, #1a0f22 45%, #130c1a 100%)',
        boxShadow: pressed ? shadowPressed : hovered ? shadowHover : shadowNormal,
        transform: pressed ? 'translateY(5px)' : 'translateY(0px)',
        transition: 'box-shadow 0.08s ease, transform 0.08s ease, background 0.2s ease',
        ...pad,
        ...style,
      }}
    >
      {children}
    </button>
  )
}