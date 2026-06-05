import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { Coins, Radio, ExternalLink, Loader } from 'lucide-react'
import { fetchCreator, fetchEpisodes } from '../lib/index'
import EpisodeCard from '../components/EpisodeCard'
import TipModal from '../components/TipModal'
import { shortAddress, formatDate } from '../lib/utils'

export default function CreatorPage() {
  const { wallet } = useParams()
  const account    = useCurrentAccount()
  const [showTip, setShowTip] = useState(false)

  const { data: creator, isLoading } = useQuery({
    queryKey: ['creator', wallet],
    queryFn: () => fetchCreator(wallet),
    enabled: !!wallet,
  })

  const { data: episodes } = useQuery({
    queryKey: ['episodes', creator?.id],
    queryFn: () => fetchEpisodes(creator.id),
    enabled: !!creator?.id,
  })

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Loader size={28} color="var(--ink-muted)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )
  if (!creator) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'var(--ink-secondary)' }}>Creator not found.</p>
    </div>
  )

  const isOwnProfile = account?.address === creator.wallet_address

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, animation: 'fadeUp 0.4s ease' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent-gold)44, var(--accent-amber)44)', border: '2px solid var(--accent-gold)44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Radio size={28} color="var(--accent-gold)" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.04em', marginBottom: 4 }}>{creator.display_name}</h1>
            <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginBottom: 8 }}>{shortAddress(creator.wallet_address)}</p>
            {creator.bio && <p className="serif" style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', lineHeight: 1.6, maxWidth: 480 }}>{creator.bio}</p>}
            <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: 8 }}>Member since {formatDate(creator.created_at)}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {creator.sui_object_id && (
            <a href={`https://suiexplorer.com/object/${creator.sui_object_id}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, border: '1px solid var(--bg-border)', color: 'var(--sui-blue)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ExternalLink size={13} /> Sui NFT
            </a>
          )}
          {!isOwnProfile && (
            <button onClick={() => setShowTip(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', border: 'none', color: '#0a0a08', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
              <Coins size={14} /> Tip
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 32, marginBottom: 40, padding: '20px 28px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', animation: 'fadeUp 0.4s 0.1s ease both' }}>
        {[
          { label: 'Episodes', value: creator.episode_count },
          { label: 'SUI Earned', value: `${creator.total_tips_received_sui.toFixed(3)} SUI` },
        ].map(s => (
          <div key={s.label}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{s.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: 20, animation: 'fadeUp 0.4s 0.2s ease both' }}>Episodes</h2>
      {episodes && episodes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, animation: 'fadeUp 0.4s 0.25s ease both' }}>
          {episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
        </div>
      ) : (
        <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>No episodes yet.</p>
      )}

      {showTip && <TipModal creator={creator} onClose={() => setShowTip(false)} />}
    </div>
  )
}