import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader } from 'lucide-react'
import { fetchEpisodes, searchEpisodes } from '../lib/index'
import EpisodeCard from '../components/EpisodeCard'

export default function ExplorePage() {
  const [query, setQuery]               = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const handleInput = (val) => {
    setQuery(val)
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => setDebouncedQuery(val.trim()), 350)
  }

  const { data: allEpisodes, isLoading: loadingAll } = useQuery({
    queryKey: ['episodes'],
    queryFn: () => fetchEpisodes(),
    enabled: !debouncedQuery,
  })

  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchEpisodes(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  })

  const loading = loadingAll || loadingSearch

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 6 }}>Explore</h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem' }}>Every episode stored permanently on Walrus.</p>
      </div>

      <div style={{ position: 'relative', maxWidth: 520, marginBottom: 40 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search titles, transcripts, topics…"
          value={query}
          onChange={e => handleInput(e.target.value)}
          style={{ width: '100%', paddingLeft: 40, paddingRight: 16, height: 44, fontSize: '0.9rem' }}
        />
        {loading && (
          <Loader size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', animation: 'spin 1s linear infinite' }} />
        )}
      </div>

      {debouncedQuery && searchResults && (
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{debouncedQuery}"
          </p>
          {searchResults.length === 0 ? (
            <p style={{ color: 'var(--ink-secondary)' }}>No episodes found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {searchResults.map(result => (
                <div key={result.episode_id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 10, padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{result.title}</h3>
                    <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', background: 'var(--accent-gold)14', padding: '2px 6px', borderRadius: 3 }}>
                      {(result.relevance_score * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', marginBottom: 6 }}>by {result.creator_display_name}</p>
                  <p className="serif" style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.55, fontStyle: 'italic' }}>…{result.snippet}…</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!debouncedQuery && (
        loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <Loader size={28} color="var(--ink-muted)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {allEpisodes?.map((ep, i) => (
              <EpisodeCard key={ep.id} episode={ep} style={{ animation: `fadeUp 0.4s ${i * 0.05}s ease both` }} />
            ))}
          </div>
        )
      )}
    </div>
  )
}