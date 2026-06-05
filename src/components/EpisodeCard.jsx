import { Link } from 'react-router-dom'
import { Play, Coins, Clock } from 'lucide-react'
import { formatDuration, formatDate, processingMeta } from '../lib/utils'

export default function EpisodeCard({ episode, creatorName, style }) {
  const { label, color } = processingMeta(episode.processing_status)
  const isLive = episode.processing_status === 'complete'

  return (
    <Link
      to={`/episode/${episode.id}`}
      style={{
        display: 'block',
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderRadius: 10, padding: '20px 24px',
        transition: 'all 0.2s', cursor: 'pointer', textDecoration: 'none',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-gold)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--bg-border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent-gold)22, var(--accent-amber)22)',
          border: '1px solid var(--accent-gold)44',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Play size={16} color="var(--accent-gold)" fill="var(--accent-gold)" />
        </div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
          color, background: `${color}18`, border: `1px solid ${color}44`,
          padding: '3px 8px', borderRadius: 4,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {episode.processing_status !== 'complete' && episode.processing_status !== 'failed' && (
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, animation: 'pulse 1.4s infinite' }} />
          )}
          {label}
        </span>
      </div>

      <h3 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.3 }}>
        {episode.title}
      </h3>

      {creatorName && (
        <p style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginBottom: 14 }}>
          {creatorName}
        </p>
      )}

      {isLive && (
        <div style={{ display: 'flex', gap: 16, marginTop: 'auto' }}>
          <StatPill icon={<Play size={11} />} value={episode.play_count.toLocaleString()} />
          <StatPill icon={<Coins size={11} />} value={episode.tip_count.toLocaleString()} />
          {episode.duration_seconds && (
            <StatPill icon={<Clock size={11} />} value={formatDuration(episode.duration_seconds)} />
          )}
        </div>
      )}

      <p style={{ marginTop: 12, fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
        {formatDate(episode.created_at)}
      </p>
    </Link>
  )
}

function StatPill({ icon, value }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--ink-secondary)', fontFamily: 'var(--font-mono)' }}>
      {icon}{value}
    </span>
  )
}