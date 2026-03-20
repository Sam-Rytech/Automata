'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.735-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)
const DiscordIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
  </svg>
)

export function NavLanding() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        padding: '1.4rem 3rem',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        background: scrolled ? 'rgba(15,15,26,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
      }}
    >
      {/* Left — nav links */}
      <nav className="flex items-center gap-10">
        {['Build', 'Recipes', 'History'].map(label => (
          <Link
            key={label}
            href={`/${label.toLowerCase()}`}
            className="nav-link"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Center — logo (absolutely centered) */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 no-underline"
        style={{
          fontWeight: 800,
          fontSize: '1rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#fff',
        }}
      >
        Automata
      </Link>

      {/* Right — socials */}
      <div className="flex items-center gap-6">
        {[
          { href: 'https://twitter.com', icon: <TwitterIcon />, label: 'Twitter' },
          { href: 'https://github.com', icon: <GithubIcon />, label: 'GitHub' },
          { href: 'https://discord.com', icon: <DiscordIcon />, label: 'Discord' },
        ].map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex items-center transition-all duration-200"
            style={{ color: '#666' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#666'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {icon}
          </a>
        ))}
      </div>
    </header>
  )
}