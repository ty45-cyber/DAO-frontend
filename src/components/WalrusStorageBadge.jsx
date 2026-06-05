export default function WalrusStorageBadge({ blobId, label = 'Walrus' }) {
  if (!blobId) return null
  const displayId = blobId.length > 24 ? `${blobId.slice(0, 12)}…${blobId.slice(-8)}` : blobId

  return (
    <a
      href={`https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`}
      target="_blank" rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 5,
        background: '#6eb3f712', border: '1px solid #6eb3f733',
        textDecoration: 'none', transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#6eb3f720')}
      onMouseLeave={e => (e.currentTarget.style.background = '#6eb3f712')}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#6eb3f7" strokeWidth="2"/>
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="#6eb3f7"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#6eb3f7' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#6eb3f799' }}>{displayId}</span>
    </a>
  )
}