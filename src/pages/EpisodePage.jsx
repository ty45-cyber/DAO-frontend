import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Coins, ExternalLink, Loader, AlertCircle } from 'lucide-react'
import { fetchEpisode, fetchClips, fetchCreator } from '../lib/index'
import AudioPlayer from '../components/AudioPlayer'
import ClipCard from '../components/ClipCard'
import TipModal from '../components/TipModal'
import WalrusStorageBadge from '../components/WalrusStorageBadge'
import { formatDate, shortAddress } from '../lib/utils'

export default function EpisodePage() {
  const { id } = useParams()
  const [showTip, setShowTip] = useState(false)

  const { data: episode, isLoading } = useQuery({
    queryKey: ['episode', id],
    queryFn: () => fetchEpisode(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const s = query.state.data?.processing_status
      return s && !['complete', 'failed'].includes(s) ? 4000 : false
    },
  })

  const { data: creator } = useQuery({
    queryKey: ['creator-by-ep', episode?.creator_id],
    queryFn: () => fetchCreator(episode.creator_id),
    enabled: !!episode?.creator_id,
  })

  const { data: clips } = useQuery({
    queryKey: ['clips', id],
    queryFn: () => fetchClips(id),
    enabled: !!id && episode?.processing_status === 'complete',
  })

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Loader size={32} color="var(--ink-muted)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )
  if (!episode) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'var(--ink-secondary)' }}>Episode not found.</p>
    </div>
  )

  const isProcessing = !['complete', 'failed'].includes(episode.processing_status)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: 32 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Episode</p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
              {episode.title}
            </h1>
            {episode.description && (
              <p className="serif" style={{ fontSize: '0.95rem', color: 'var(--ink-secondary)', lineHeight: 1.65, maxWidth: 560 }}>
                {episode.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <Meta label="Published" value={formatDate(episode.created_at)} />
              <Meta label="Plays"     value={episode.play_count.toLocaleString()} />
              <Meta label="Tips"      value={episode.tip_count.toLocaleString()} />
            </div>
          </div>

          <button onClick={() => setShowTip(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 22px', borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))',
            border: 'none', color: '#0a0a08', fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', transition: 'transform 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Coins size={15} /> Tip Creator
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <WalrusStorageBadge blobId={episode.audio_walrus_blob_id} label="Audio on Walrus" />
        </div>
      </div>

      {isProcessing && (
        <div style={{ padding: '20px 24px', borderRadius: 10, marginBottom: 32, background: 'var(--sui-blue)10', border: '1px solid var(--sui-blue)33', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Loader size={18} color="var(--sui-blue)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--sui-blue)', marginBottom: 2 }}>Processing your episode…</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>Claude AI is generating transcripts and viral clips — usually 1–3 minutes.</p>
          </div>
        </div>
      )}

      {episode.processing_status === 'failed' && (
        <div style={{ padding: '20px 24px', borderRadius: 10, marginBottom: 32, background: 'var(--accent-red)10', border: '1px solid var(--accent-red)33', display: 'flex', gap: 12 }}>
          <AlertCircle size={18} color="var(--accent-red)" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--accent-red)', marginBottom: 2 }}>Processing failed</p>
            {episode.processing_error && <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>{episode.processing_error}</p>}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        <div>
          <AudioPlayer src={episode.audio_url} chapters={episode.chapters} />

          {episode.sui_nft_object_id && (
            <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--sui-blue)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ExternalLink size={12} color="var(--sui-blue)" />
              </div>
              <div>
                <p style={{ fontSize: '0.68rem', color: 'var(--sui-blue)', fontWeight: 600, marginBottom: 1 }}>Minted on Sui</p>
                <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>{shortAddress(episode.sui_nft_object_id)}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16, letterSpacing: '-0.02em' }}>⚡ Viral Clips</h2>
          {clips && clips.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {clips.map(clip => <ClipCard key={clip.id} clip={clip} />)}
            </div>
          ) : (
            <div style={{ padding: 24, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', textAlign: 'center' }}>
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.82rem' }}>{isProcessing ? 'Clips generating…' : 'No clips yet.'}</p>
            </div>
          )}
        </div>
      </div>

      {showTip && creator && (
        <TipModal creator={creator} episodeId={episode.id} onClose={() => setShowTip(false)} />
      )}
    </div>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '0.65rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{label}</p>
      <p className="mono" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{value}</p>
    </div>
  )
}