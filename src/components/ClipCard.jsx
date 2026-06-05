import { Zap, Share2 } from 'lucide-react'
import { formatDuration } from '../lib/utils'

export default function ClipCard({ clip, onSeek }) {
  const handleShare = async (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/episode/${clip.episode_id}?t=${clip.start_seconds}`
    if (navigator.share) await navigator.share({ title: clip.title, url })
    else await navigator.clipboard.writeText(url)
  }

  return (
    <div
      onClick={() => onSeek?.(clip.start_seconds)}
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
        borderRadius: 10, padding: '16px 20px',
        cursor: onSeek ? 'pointer' : 'default', transition: 'all 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bg-border)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={13} color="var(--accent-amber)" fill="var(--accent-amber)" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {(clip.virality_score * 100).toFixed(0)}% viral
          </span>
        </div>
        <button onClick={handleShare} style={{ color: 'var(--ink-muted)', padding: 2, background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-secondary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
        >
          <Share2 size={13} />
        </button>
      </div>

      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>
        {clip.title}
      </h4>

      <p className="serif" style={{
        fontSize: '0.83rem', color: 'var(--ink-secondary)', lineHeight: 1.55,
        fontStyle: 'italic', marginBottom: 12,
        borderLeft: '2px solid var(--accent-gold)44', paddingLeft: 10,
      }}>
        "{clip.highlight_text}"
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
          {formatDuration(clip.start_seconds)} → {formatDuration(clip.end_seconds)}
          <span style={{ marginLeft: 8 }}>({clip.duration_seconds}s)</span>
        </span>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
          {clip.share_count.toLocaleString()} shares
        </span>
      </div>

      <div style={{ marginTop: 10, height: 2, borderRadius: 1, background: 'var(--bg-border)' }}>
        <div style={{
          height: '100%', borderRadius: 1,
          width: `${clip.virality_score * 100}%`,
          background: 'linear-gradient(90deg, var(--accent-amber), var(--accent-gold))',
        }} />
      </div>
    </div>
  )
}