import { MOCK_CREATORS, MOCK_EPISODES, MOCK_CLIPS, MOCK_TIPS } from './mockData'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))
const randomDelay = () => delay(300 + Math.random() * 500)

export const fetchCreator = async (walletOrId) => {
  await randomDelay()
  const creator = MOCK_CREATORS.find(
    c => c.wallet_address === walletOrId || c.id === walletOrId
  )
  if (!creator) throw new Error('Creator not found')
  return creator
}

export const registerCreator = async (data) => {
  await delay(600)
  return {
    id: `mock-${Date.now()}`,
    wallet_address: data.wallet_address,
    display_name: data.display_name,
    bio: data.bio ?? null,
    sui_object_id: null,
    total_tips_received_sui: 0,
    episode_count: 0,
    created_at: new Date().toISOString(),
  }
}

export const fetchEpisodes = async (creator_id) => {
  await randomDelay()
  if (creator_id) return MOCK_EPISODES.filter(e => e.creator_id === creator_id)
  return MOCK_EPISODES
}

export const fetchEpisode = async (id) => {
  await randomDelay()
  const ep = MOCK_EPISODES.find(e => e.id === id)
  if (!ep) throw new Error('Episode not found')
  return ep
}

export const uploadEpisode = async (_form) => {
  await delay(1200)
  return {
    id: `mock-ep-${Date.now()}`,
    creator_id: MOCK_CREATORS[0].id,
    title: 'Your Episode (Processing…)',
    description: null,
    audio_walrus_blob_id: `blobMock${Date.now()}`,
    audio_url: null,
    sui_nft_object_id: null,
    duration_seconds: null,
    processing_status: 'generating_transcript',
    play_count: 0,
    tip_count: 0,
    chapters: null,
    created_at: new Date().toISOString(),
  }
}

export const fetchClips = async (episodeId) => {
  await randomDelay()
  return MOCK_CLIPS[episodeId] ?? []
}

export const searchEpisodes = async (q) => {
  await delay(500)
  const lower = q.toLowerCase()
  return MOCK_EPISODES
    .filter(ep => {
      const text = [
        ep.title,
        ep.description ?? '',
        ...(ep.chapters ?? []).map(c => c.title + ' ' + c.summary),
      ].join(' ').toLowerCase()
      return text.includes(lower)
    })
    .map(ep => {
      const creator = MOCK_CREATORS.find(c => c.id === ep.creator_id)
      const fullText = [ep.title, ep.description ?? '', ...(ep.chapters ?? []).map(c => c.title + ' ' + c.summary)].join(' ')
      const idx = fullText.toLowerCase().indexOf(lower)
      const snippet = idx >= 0
        ? fullText.slice(Math.max(0, idx - 60), idx + 140)
        : fullText.slice(0, 180)
      return {
        episode_id: ep.id,
        title: ep.title,
        creator_display_name: creator?.display_name ?? 'Unknown',
        snippet,
        relevance_score: ep.title.toLowerCase().includes(lower) ? 1.0 : 0.72,
      }
    })
    .sort((a, b) => b.relevance_score - a.relevance_score)
}

export const recordTip = async (_data) => {
  await delay(800)
  return { id: `tip-${Date.now()}`, verified: true }
}

export const getCreatorTips = async (_wallet) => {
  await randomDelay()
  return MOCK_TIPS
}