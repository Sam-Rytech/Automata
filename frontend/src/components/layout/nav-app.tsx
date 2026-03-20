'use client'
declare global { interface Window { ethereum?: any } }
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SkeuoButton } from '@/components/ui/skeuo-button'

const WalletIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 00-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
  </svg>
)

const DisconnectIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
    <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68" />
    <path d="M12 2v4M2 12h4" />
  </svg>
)

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function NavApp() {
  const pathname = usePathname()
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)

  // Check if already connected on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts.length > 0) setAddress(accounts[0])
    })
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      alert('MetaMask not found. Please install it.')
      return
    }
    setConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0])

      // Check network — Moonbase Alpha is 1287 (0x507)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId !== '0x507') {
        setWrongNetwork(true)
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x507' }],
          })
          setWrongNetwork(false)
        } catch {
          // Chain not added — add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x507',
              chainName: 'Moonbase Alpha',
              nativeCurrency: { name: 'DEV', symbol: 'DEV', decimals: 18 },
              rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
              blockExplorerUrls: ['https://moonbase.moonscan.io'],
            }],
          })
          setWrongNetwork(false)
        }
      }
    } catch (err) {
      console.error('Wallet connect failed', err)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => setAddress(null)

  const navLinks = [
    { label: 'Build', href: '/build' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'History', href: '/history' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        padding: '0.9rem 2.5rem',
        background: 'rgba(15,15,26,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Left — Logo */}
      <Link
        href="/"
        className="no-underline flex-shrink-0"
        style={{
          fontWeight: 800,
          fontSize: '0.95rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#fff',
        }}
      >
        Automata
      </Link>

      {/* Center — Nav links */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
        {navLinks.map(({ label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className="no-underline transition-colors duration-200 text-xs uppercase tracking-widest"
              style={{
                color: active ? '#fff' : '#666',
                letterSpacing: '0.14em',
                fontSize: '0.75rem',
                fontWeight: active ? 600 : 400,
                position: 'relative',
              }}
            >
              {label}
              {active && (
                <span
                  className="absolute -bottom-1 left-0 right-0"
                  style={{
                    height: '1px',
                    background: '#e91e8c',
                    display: 'block',
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Right — Wallet button */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {wrongNetwork && (
          <span style={{
            fontSize: '0.7rem',
            color: '#ff4444',
            border: '1px solid rgba(255,68,68,0.3)',
            padding: '0.25rem 0.7rem',
            borderRadius: '999px',
            background: 'rgba(255,68,68,0.08)',
          }}>
            Wrong network
          </span>
        )}

        {address ? (
          <div className="flex items-center gap-2">
            {/* Connected address pill */}
            <div
              className="flex items-center gap-2"
              style={{
                background: 'rgba(29,185,84,0.06)',
                border: '1px solid rgba(29,185,84,0.25)',
                borderRadius: '8px',
                padding: '0.5rem 0.9rem',
              }}
            >
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#1db954',
                animation: 'pulse-dot 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}>
                {truncateAddress(address)}
              </span>
            </div>
            {/* Disconnect */}
            <button
              onClick={disconnect}
              className="flex items-center gap-1 transition-colors duration-200"
              style={{
                color: '#555',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.4rem',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
              title="Disconnect"
            >
              <DisconnectIcon />
            </button>
          </div>
        ) : (
          <SkeuoButton size="sm" onClick={connect}>
            {connecting ? (
              <span>Connecting...</span>
            ) : (
              <>
                <WalletIcon />
                <span>Connect Wallet</span>
              </>
            )}
          </SkeuoButton>
        )}
      </div>
    </header>
  )
}