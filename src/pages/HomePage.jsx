import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Radio, ArrowRight, Shield, Zap, Coins } from 'lucide-react'
import { fetchEpisodes } from '../lib/index'
import EpisodeCard from '../components/EpisodeCard'

export default function HomePage() {
  const { data: episodes } = useQuery({
    queryKey: ['episodes'],
    queryFn: () => fetchEpisodes(),
  })

  const recent = episodes?.slice(0, 3) ?? []

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 100 }}>
        <div style={{ animation: 'fadeUp 0.6s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 20,
            background: 'var(--accent-gold)12', border: '1px solid var(--accent-gold)33',
            marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.04em' }}>
              LIVE ON WALRUS + SUI
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 24,
          }}>
            Own your podcast.{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Forever.
            </span>
          </h1>

          <p className="serif" style={{ fontSize: '1.05rem', color: 'var(--ink-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
            Upload once to Walrus decentralised storage. AI generates transcripts and clips every viral moment.
            Listeners tip you directly in SUI — no middlemen.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/upload" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))',
              color: '#0a0a08', fontWeight: 700, fontSize: '0.95rem', transition: 'transform 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Start Publishing <ArrowRight size={16} />
            </Link>
            <Link to="/explore" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 8,
              border: '1px solid var(--bg-border)', color: 'var(--ink-secondary)',
              fontWeight: 600, fontSize: '0.95rem', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bg-border)')}
            >
              Explore Shows
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'fadeUp 0.6s 0.1s ease both' }}>
          {[
            { icon: <Shield size={20} color="var(--sui-blue)" />, title: 'Permanent Storage', body: 'Audio, transcripts and clips stored on Walrus — censorship-resistant forever.' },
            { icon: <Zap size={20} color="var(--accent-amber)" />, title: 'AI Viral Clips', body: 'Claude AI detects your best moments and generates ready-to-share clips automatically.' },
            { icon: <Coins size={20} color="var(--accent-gold)" />, title: 'SUI Tipping', body: 'Listeners tip directly to your wallet. Verified on-chain via Tatum RPC.' },
            { icon: <Radio size={20} color="var(--accent-green)" />, title: 'NFT Ownership', body: 'Mint each episode as a Sui NFT. Your creative work is provably yours.' },
          ].map(f => (
            <div key={f.title} style={{ padding: 20, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}>
              <div style={{ marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {recent.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em' }}>Latest Episodes</h2>
            <Link to="/explore" style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {recent.map((ep, i) => (
              <EpisodeCard key={ep.id} episode={ep} style={{ animation: `fadeUp 0.4s ${i * 0.08}s ease both` }} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}