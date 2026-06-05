import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useQuery } from '@tanstack/react-query'
import { Upload, Music, X, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadEpisode, fetchCreator, registerCreator } from '../lib/index'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL

export default function UploadPage() {
  const account  = useCurrentAccount()
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  const [file, setFile]               = useState(null)
  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [status, setStatus]           = useState('idle')
  const [errorMsg, setErrorMsg]       = useState('')
  const [createdEpId, setCreatedEpId] = useState(null)

  const { data: creator, refetch: refetchCreator } = useQuery({
    queryKey: ['creator', account?.address],
    queryFn: () => fetchCreator(account.address),
    enabled: !!account?.address,
    retry: false,
  })

  const handleFile = (f) => {
    if (!f.type.startsWith('audio/')) { setErrorMsg('Please upload an audio file (MP3, WAV, M4A)'); return }
    if (f.size > 500 * 1024 * 1024) { setErrorMsg('File must be under 500 MB'); return }
    setFile(f); setErrorMsg('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async () => {
    if (!USE_MOCK && !account) return
    if (!file) return setErrorMsg('Please select an audio file')
    if (!title.trim()) return setErrorMsg('Title is required')
    setStatus('uploading'); setErrorMsg('')
    try {
      let creatorId = creator?.id
      if (!creatorId) {
        if (!displayName.trim()) { setStatus('idle'); setErrorMsg('Enter a display name to create your creator profile'); return }
        const nc = await registerCreator({ wallet_address: account?.address ?? 'demo-wallet', display_name: displayName.trim() })
        creatorId = nc.id
        await refetchCreator()
      }
      const form = new FormData()
      form.append('creator_id', creatorId)
      form.append('title', title.trim())
      form.append('description', description.trim())
      form.append('audio', file)
      const episode = await uploadEpisode(form)
      setCreatedEpId(episode.id); setStatus('success')
    } catch (err) {
      setStatus('error'); setErrorMsg(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  if (!account && !USE_MOCK) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <Music size={48} color="var(--ink-muted)" />
      <p style={{ color: 'var(--ink-secondary)', fontWeight: 600 }}>Connect your Sui wallet to upload</p>
    </div>
  )

  if (status === 'success' && createdEpId) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 20, padding: 32 }}>
      <CheckCircle size={56} color="var(--accent-green)" />
      <h2 style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Episode uploaded!</h2>
      <p style={{ color: 'var(--ink-secondary)', textAlign: 'center', maxWidth: 420 }}>
        Your audio is being stored on Walrus. Claude AI is generating the transcript and viral clips — usually 1–3 minutes.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => navigate(`/episode/${createdEpId}`)} style={{ padding: '11px 24px', borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', border: 'none', color: '#0a0a08', fontWeight: 700, cursor: 'pointer' }}>
          View Episode
        </button>
        <button onClick={() => { setFile(null); setTitle(''); setDescription(''); setStatus('idle'); setCreatedEpId(null) }} style={{ padding: '11px 24px', borderRadius: 8, border: '1px solid var(--bg-border)', color: 'var(--ink-secondary)', fontWeight: 600, cursor: 'pointer', background: 'none' }}>
          Upload Another
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ marginBottom: 36, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 6 }}>Upload Episode</h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '0.88rem' }}>Stored permanently on Walrus. AI processing begins immediately.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s 0.1s ease both' }}>
        {!creator && (
          <Field label="Creator Display Name">
            <input type="text" placeholder="Your name or podcast brand" value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ width: '100%' }} />
          </Field>
        )}

        <Field label="Episode Title *">
          <input type="text" placeholder="e.g. The Future of Decentralised Media" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} />
        </Field>

        <Field label="Description">
          <textarea placeholder="Show notes, guest names, links…" value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', resize: 'vertical' }} />
        </Field>

        <Field label="Audio File *">
          <div
            onDrop={handleDrop} onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${file ? 'var(--accent-gold)' : 'var(--bg-border)'}`,
              borderRadius: 10, padding: '32px 24px', textAlign: 'center',
              cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
              background: file ? 'var(--accent-gold)06' : 'var(--bg-elevated)',
            }}
          >
            <input ref={fileRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Music size={20} color="var(--accent-gold)" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{file.name}</p>
                  <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setFile(null) }} style={{ marginLeft: 8, color: 'var(--ink-muted)', padding: 2, background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={28} color="var(--ink-muted)" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Drop audio here or click to browse</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>MP3, WAV, M4A · Max 500 MB</p>
              </>
            )}
          </div>
        </Field>

        {errorMsg && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'var(--accent-red)10', border: '1px solid var(--accent-red)33', color: 'var(--accent-red)', fontSize: '0.82rem' }}>
            <AlertCircle size={14} />{errorMsg}
          </div>
        )}

        <button onClick={handleSubmit} disabled={status === 'uploading'} style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))',
          border: 'none', borderRadius: 8, color: '#0a0a08',
          fontWeight: 700, fontSize: '1rem',
          cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
          opacity: status === 'uploading' ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <Upload size={16} />
          {status === 'uploading' ? 'Uploading to Walrus…' : 'Upload & Process Episode'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}