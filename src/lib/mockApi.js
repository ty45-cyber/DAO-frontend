import { MOCK_CREATORS, MOCK_EPISODES, MOCK_CLIPS, MOCK_TIPS } from './mockData'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))
const rand  = ()          => delay(300 + Math.random() * 500)

// In-memory store for uploaded episodes this session
const SESSION_EPISODES = []
const AUDIO_URLS = {}

export const fetchCreator = async (walletOrId) => {
  await rand()
  const c = MOCK_CREATORS.find(
    c => c.wallet_address === walletOrId || c.id === walletOrId
  )
  if (!c) throw new Error('Creator not found')
  return c
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
  await rand()
  const all = [...MOCK_EPISODES, ...SESSION_EPISODES]
  if (creator_id) return all.filter(e => e.creator_id === creator_id)
  return all
}

export const fetchEpisode = async (id) => {
  await rand()
  const ep =
    SESSION_EPISODES.find(e => e.id === id) ||
    MOCK_EPISODES.find(e => e.id === id)
  if (!ep) throw new Error('Episode not found')
  // Attach local object URL if available
  return { ...ep, audio_url: AUDIO_URLS[id] ?? ep.audio_url }
}

export const uploadEpisode = async (formData) => {
  await delay(1200)

  const audioFile = formData.get('audio')
  const title     = formData.get('title') || 'Untitled Episode'
  const desc      = formData.get('description') || null
  const id        = `mock-ep-${Date.now()}`

  // Create a browser object URL from the real file — no network needed
  let audioUrl = null
  if (audioFile && audioFile instanceof File) {
    audioUrl = URL.createObjectURL(audioFile)
    AUDIO_URLS[id] = audioUrl
  }

  const ep = {
    id,
    creator_id:            MOCK_CREATORS[0].id,
    title,
    description:           desc,
    audio_walrus_blob_id:  `blobMock${Date.now()}xyzWalrus`,
    audio_url:             audioUrl,
    sui_nft_object_id:     null,
    duration_seconds:      null,
    processing_status:     'generating_transcript',
    play_count:            0,
    tip_count:             0,
    chapters:              null,
    created_at:            new Date().toISOString(),
  }

  SESSION_EPISODES.push(ep)

  // Simulate AI processing — advance status after delays
  simulateProcessing(id)

  return ep
}

function simulateProcessing(id) {
  const steps = [
    { status: 'uploading_to_walrus',   ms: 1000 },
    { status: 'generating_transcript', ms: 2500 },
    { status: 'generating_chapters',   ms: 2500 },
    { status: 'extracting_clips',      ms: 2000 },
    { status: 'complete',              ms: 1000 },
  ]

  let total = 0
  for (const step of steps) {
    total += step.ms
    setTimeout(() => {
      const ep = SESSION_EPISODES.find(e => e.id === id)
      if (!ep) return
      ep.processing_status = step.status

      // Inject mock chapters and clips when complete
      if (step.status === 'complete') {
        ep.duration_seconds  = 3240
        ep.sui_nft_object_id = `0xmock${id.slice(-8)}nftobject`
        ep.chapters = [
          { index: 0, title: 'Introduction',         start_seconds: 0,    end_seconds: 540,  summary: 'Opening context and episode overview.' },
          { index: 1, title: 'Core Argument',        start_seconds: 540,  end_seconds: 1440, summary: 'The central thesis explored with examples.' },
          { index: 2, title: 'Evidence & Data',      start_seconds: 1440, end_seconds: 2160, summary: 'Supporting research and real-world cases.' },
          { index: 3, title: 'Implications',         start_seconds: 2160, end_seconds: 2880, summary: 'What this means for the ecosystem.' },
          { index: 4, title: 'Closing Thoughts',     start_seconds: 2880, end_seconds: 3240, summary: 'Summary, takeaways and next steps.' },
        ]
      }
    }, total)
  }
}

export const fetchClips = async (episodeId) => {
  await rand()
  return MOCK_CLIPS[episodeId] ?? []
}

export const searchEpisodes = async (q) => {
  await delay(500)
  const lower = q.toLowerCase()
  const all   = [...MOCK_EPISODES, ...SESSION_EPISODES]
  return all
    .filter(ep => {
      const text = [
        ep.title,
        ep.description ?? '',
        ...(ep.chapters ?? []).map(c => c.title + ' ' + c.summary),
      ].join(' ').toLowerCase()
      return text.includes(lower)
    })
    .map(ep => {
      const creator  = MOCK_CREATORS.find(c => c.id === ep.creator_id)
      const fullText = [ep.title, ep.description ?? '', ...(ep.chapters ?? []).map(c => c.title + ' ' + c.summary)].join(' ')
      const idx      = fullText.toLowerCase().indexOf(lower)
      const snippet  = idx >= 0
        ? fullText.slice(Math.max(0, idx - 60), idx + 140)
        : fullText.slice(0, 180)
      return {
        episode_id:           ep.id,
        title:                ep.title,
        creator_display_name: creator?.display_name ?? 'Unknown',
        snippet,
        relevance_score:      ep.title.toLowerCase().includes(lower) ? 1.0 : 0.72,
      }
    })
    .sort((a, b) => b.relevance_score - a.relevance_score)
}

export const recordTip = async (_data) => {
  await delay(800)
  return { id: `tip-${Date.now()}`, verified: true }
}

export const getCreatorTips = async (_wallet) => {
  await rand()
  return MOCK_TIPS
}