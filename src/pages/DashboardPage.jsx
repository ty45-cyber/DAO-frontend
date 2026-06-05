import { useCurrentAccount } from '@mysten/dapp-kit'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, Coins, Play, Radio, TrendingUp } from 'lucide-react'
import { fetchCreator, fetchEpisodes, getCreatorTips } from '../lib/index'
import EpisodeCard from '../components/EpisodeCard'
import TatumVerifiedBadge from '../components/TatumVerifiedBadge'
import { shortAddress } from '../lib/utils'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL
const DEMO_WALLET = '0x4f3a8b2c1d9e6f7a8b3c4d5e6f7a8b9c0d1e2f3a'

export default function DashboardPage() {
  const account      = useCurrentAccount()
  const walletAddr   = account?.address ?? (USE_MOCK ? DEMO_WALLET : null)

  const { data: creator } = useQuery({
    queryKey: ['creator', walletAddr],
    queryFn: () => fetchCreator(walletAddr),
    enabled: !!walletAddr,
    retry: false,
  })

  const { data: episodes } = useQuery({
    queryKey: ['episodes', creator?.id],
    queryFn: () => fetchEpisodes(creator.id),
    enabled: !!creator?.id,
  })

  const { data: tips } = useQuery({
    queryKey: ['tips', walletAddr],
    queryFn: () => getCreatorTips(walletAddr),
    enabled: !!walletAddr,
  })

  if (!walletAddr) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
      <LayoutDashboard size={40} color="var(--ink-muted)" />
      <p style={{ color: 'var(--ink-secondary)' }}>Connect your wallet to view your studio</p>
    </div>
  )

  const totalPlays      = episodes?.reduce((s, e) => s + e.play_count, 0) ?? 0
  const completeEpisodes = episodes?.filter(e => e.processing_status === 'complete').length ?? 0

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.4s ease' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>Creator Studio</p>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 4 }}>{creator?.display_name ?? 'Your Studio'}</h1>
        <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{shortAddress(walletAddr)}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48, animation: 'fadeUp 0.4s 0.1s ease both' }}>
        {[
          { icon: <Radio size={18} color="var(--accent-gold)" />,   label: 'Episodes',      value: episodes?.length ?? 0 },
          { icon: <Play size={18} color="var(--sui-blue)" />,       label: 'Total Plays',   value: totalPlays.toLocaleString() },
          { icon: <Coins size={18} color="var(--accent-green)" />,  label: 'SUI Earned',    value: `${(creator?.total_tips_received_sui ?? 0).toFixed(3)}` },
          { icon: <TrendingUp size={18} color="var(--accent-amber)" />, label: 'Live Episodes', value: completeEpisodes },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '20px 22px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
            <div style={{ marginBottom: 12 }}>{stat.icon}</div>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{stat.value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 48, animation: 'fadeUp 0.4s 0.2s ease both' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: 20 }}>Your Episodes</h2>
        {episodes && episodes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
          </div>
        ) : (
          <div style={{ padding: 40, borderRadius: 10, textAlign: 'center', background: 'var(--bg-surface)', border: '1px dashed var(--bg-border)' }}>
            <p style={{ color: 'var(--ink-muted)' }}>No episodes yet.</p>
          </div>
        )}
      </div>

      {tips && tips.length > 0 && (
        <div style={{ animation: 'fadeUp 0.4s 0.3s ease both' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', marginBottom: 20 }}>Recent Tips</h2>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 10, overflow: 'hidden' }}>
            {tips.slice(0, 10).map((tip, i) => (
              <div key={tip.id} style={{
                padding: '14px 20px',
                borderBottom: i < tips.length - 1 ? '1px solid var(--bg-border)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', marginBottom: 4 }}>
                    {shortAddress(tip.tipper_wallet)}
                  </p>
                  {tip.message && (
                    <p className="serif" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>"{tip.message}"</p>
                  )}
                  <div style={{ marginTop: 4 }}>
                    <TatumVerifiedBadge txDigest={tip.sui_tx_digest} verified={tip.verified} />
                  </div>
                </div>
                <p style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.9rem', flexShrink: 0 }}>
                  +{tip.amount_sui.toFixed(4)} SUI
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}