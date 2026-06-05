import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function mistToSui(mist) {
  return (mist / 1_000_000_000).toFixed(4)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function shortAddress(addr) {
  if (!addr || addr.length < 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function processingMeta(status) {
  const map = {
    pending:               { label: 'Queued',        color: '#9e9b91' },
    uploading_to_walrus:   { label: 'Uploading',     color: '#6eb3f7' },
    generating_transcript: { label: 'Transcribing',  color: '#6eb3f7' },
    generating_chapters:   { label: 'Analysing',     color: '#d4a853' },
    extracting_clips:      { label: 'Clipping',      color: '#d4a853' },
    minting_nft:           { label: 'Minting NFT',   color: '#4caf7a' },
    complete:              { label: 'Live',           color: '#4caf7a' },
    failed:                { label: 'Failed',         color: '#e05252' },
  }
  return map[status] ?? { label: status, color: '#9e9b91' }
}