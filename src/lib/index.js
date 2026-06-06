const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  import.meta.env.MODE === 'demo' ||
  !import.meta.env.VITE_API_URL

const mod = USE_MOCK
  ? await import('./mockApi')
  : await import('./api')

export const fetchEpisodes   = mod.fetchEpisodes
export const fetchEpisode    = mod.fetchEpisode
export const fetchCreator    = mod.fetchCreator
export const fetchClips      = mod.fetchClips
export const searchEpisodes  = mod.searchEpisodes
export const registerCreator = mod.registerCreator
export const uploadEpisode   = mod.uploadEpisode
export const recordTip       = mod.recordTip
export const getCreatorTips  = mod.getCreatorTips