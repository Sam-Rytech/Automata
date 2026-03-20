import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Left */}
      <div>
        <p style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
          Automata
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
          Built on Polkadot · {new Date().getFullYear()}
        </p>
      </div>

      {/* Center */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {[
          { label: 'Build', href: '/build' },
          { label: 'Recipes', href: '/recipes' },
          { label: 'History', href: '/history' },
        ].map(link => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        XCM v3 · Moonbeam · Polkadot
      </p>
    </footer>
  )
}