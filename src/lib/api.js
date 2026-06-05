import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: BASE,
  timeout: 30_000,
})

export const fetchEpisodes = (creator_id) =>
  api.get('/api/episodes', { params: creator_id ? { creator_id } : {} }).then(r => r.data)

export const fetchEpisode = (id) =>
  api.get(`/api/episodes/${id}`).then(r => r.data)

export const fetchCreator = (wallet) =>
  api.get(`/api/creators/${wallet}`).then(r => r.data)

export const fetchClips = (episodeId) =>
  api.get(`/api/episodes/${episodeId}/clips`).then(r => r.data)

export const searchEpisodes = (q) =>
  api.get('/api/search', { params: { q } }).then(r => r.data)

export const registerCreator = (data) =>
  api.post('/api/creators', data).then(r => r.data)

export const uploadEpisode = (formData) =>
  api.post('/api/episodes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)

export const recordTip = (data) =>
  api.post('/api/tips', data).then(r => r.data)

export const getCreatorTips = (wallet) =>
  api.get(`/api/creators/${wallet}/tips`).then(r => r.data)