export default function TatumVerifiedBadge({ txDigest, verified }) {
  if (!verified) return null
  return (
    <a
      href={`https://suiexplorer.com/txblock/${txDigest}`}
      target="_blank" rel="noreferrer"
      title="Verified via Tatum RPC"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 8px', borderRadius: 4,
        background: '#4caf7a12', border: '1px solid #4caf7a33',
        textDecoration: 'none',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#4caf7a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4caf7a' }}>Tatum verified</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: '#4caf7a88' }}>{txDigest.slice(0, 8)}…</span>
    </a>
  )
}