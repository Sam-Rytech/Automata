'use client'
import { motion, useInView } from 'framer-motion'
import React , { useRef }from 'react'


interface RevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
}

/**
 * Wraps children in a scroll-triggered reveal animation.
 * Elements slide up and fade in when entering the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-8% 0px' })

  const initial = {
    y: direction === 'up' ? 50 : 0,
    x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
    opacity: 0,
  }

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={initial}
        animate={inView ? { y: 0, x: 0, opacity: 1 } : initial}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Reveals each word with a staggered line-mask effect.
 * Great for hero headlines.
 */
export function RevealText({
  text,
  delay = 0,
  className,
  tag: Tag = 'span',
}: {
  text: string
  delay?: number
  className?: string
  tag?: keyof React.JSX.IntrinsicElements
 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  const words = text.split(' ')

  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            className={className}
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}

/**
 * Staggered reveal for a list of children (e.g. cards, steps).
 */
export function RevealGroup({
  children,
  stagger = 0.12,
  delay = 0,
  className,
}: {
  children: React.ReactNode[]
  stagger?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}