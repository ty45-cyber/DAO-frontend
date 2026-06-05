import { Link, useLocation } from 'react-router-dom'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Radio, Upload, LayoutDashboard } from 'lucide-react'

export default function Nav() {
  const location = useLocation()
  const account = useCurrentAccount()

  const links = [
    { href: '/explore', label: 'Explore' },
    { href: '/upload',  label: 'Upload',  icon: <Upload size={14} /> },
    ...(account ? [{ href: '/dashboard', label: 'Studio', icon: <LayoutDashboard size={14} /> }] : []),
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--nav-height)',
      borderBottom: '1px solid var(--bg-border)',
      background: 'rgba(10,10,8,0.92)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 32,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Radio size={14} color="#0a0a08" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
          ProofCast
        </span>
      </Link>

      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {links.map(link => (
          <Link key={link.href} to={link.href} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 6,
            fontSize: '0.85rem', fontWeight: 500,
            color: location.pathname === link.href ? 'var(--ink-primary)' : 'var(--ink-secondary)',
            background: location.pathname === link.href ? 'var(--bg-elevated)' : 'transparent',
            transition: 'all 0.15s',
          }}>
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      <div className="sui-connect">
        <ConnectButton />
      </div>

      <style>{`
        .sui-connect button {
          background: var(--bg-elevated) !important;
          border: 1px solid var(--bg-border) !important;
          color: var(--ink-primary) !important;
          font-family: var(--font-display) !important;
          font-size: 0.82rem !important;
          font-weight: 600 !important;
          border-radius: 6px !important;
          padding: 7px 14px !important;
          cursor: pointer !important;
          transition: border-color 0.15s !important;
        }
        .sui-connect button:hover { border-color: var(--accent-gold) !important; }
      `}</style>
    </nav>
  )
}