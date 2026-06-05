import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react'
import { formatDuration } from '../lib/utils'

const WAVEFORM_HEIGHTS = [30,60,45,80,55,40,70,50,90,35,65,75,45,55,85,40,70,60,50,95,35,65,80,45,55,70,40,85,50,65,75,45,90,35,60,70,55,80,40,65,50,85,45,70,60,35,90,55]

export default function AudioPlayer({ src, chapters, onChapterChange }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const mockTimerRef = useRef(null)

  const [playing, setPlaying]           = useState(false)
  const [currentTime, setCurrentTime]   = useState(0)
  const [duration, setDuration]         = useState(0)
  const [muted, setMuted]               = useState(false)
  const [activeChapter, setActiveChapter] = useState(null)

  const isMock = !src || src === 'null' || src === ''

  // Set mock duration from chapters or fallback
  useEffect(() => {
    if (isMock && !duration) {
      const lastChapter = chapters?.at(-1)
      setDuration(lastChapter?.end_seconds ?? 5847)
    }
  }, [isMock, duration, chapters])

  // Mock playback timer
  useEffect(() => {
    if (!isMock) return
    if (playing) {
      mockTimerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.5
          if (next >= duration) { setPlaying(false); return 0 }
          return next
        })
      }, 500)
    } else {
      clearInterval(mockTimerRef.current)
    }
    return () => clearInterval(mockTimerRef.current)
  }, [playing, isMock, duration])

  // Chapter detection on time change
  useEffect(() => {
    if (!chapters) return
    const ch = chapters.find(c => currentTime >= c.start_seconds && currentTime < c.end_seconds)
    if (ch && ch.index !== activeChapter?.index) {
      setActiveChapter(ch)
      onChapterChange?.(ch)
    }
  }, [currentTime, chapters, activeChapter, onChapterChange])

  // Real audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isMock) return
    const onTime   = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onEnded  = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
    }
  }, [isMock])

  const togglePlay = useCallback(() => {
    if (isMock) { setPlaying(p => !p); return }
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause(); else audio.play()
    setPlaying(p => !p)
  }, [playing, isMock])

  const seek = (e) => {
    if (!duration) return
    const bar = progressRef.current
    const rect = bar.getBoundingClientRect()
    const newTime = ((e.clientX - rect.left) / rect.width) * duration
    setCurrentTime(newTime)
    if (!isMock && audioRef.current) audioRef.current.currentTime = newTime
  }

  const skipSeconds = (s) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + s))
    setCurrentTime(newTime)
    if (!isMock && audioRef.current) audioRef.current.currentTime = newTime
  }

  const seekToChapter = (chapter) => {
    setCurrentTime(chapter.start_seconds)
    if (!isMock && audioRef.current) audioRef.current.currentTime = chapter.start_seconds
    setPlaying(true)
    if (!isMock && audioRef.current) audioRef.current.play()
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '20px 24px', border: '1px solid var(--bg-border)' }}>
      {!isMock && <audio ref={audioRef} src={src} preload="metadata" />}

      {/* Waveform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 36, marginBottom: 18 }}>
        {WAVEFORM_HEIGHTS.map((h, i) => {
          const filled = (i / WAVEFORM_HEIGHTS.length) * 100 <= progress
          return (
            <div key={i} style={{
              flex: 1, height: `${h}%`, borderRadius: 2,
              background: filled ? 'var(--accent-gold)' : 'var(--bg-border)',
              transition: 'background 0.1s',
              animation: playing && filled ? `waveform ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate` : 'none',
            }} />
          )
        })}
      </div>

      {/* Progress bar */}
      <div ref={progressRef} onClick={seek} style={{ height: 4, borderRadius: 2, background: 'var(--bg-border)', cursor: 'pointer', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-amber))', borderRadius: 2, transition: 'width 0.1s' }} />
        {chapters && duration > 0 && chapters.map(ch => (
          <div key={ch.index} title={ch.title} style={{
            position: 'absolute', top: -3, bottom: -3, width: 2, borderRadius: 1,
            left: `${(ch.start_seconds / duration) * 100}%`,
            background: 'var(--ink-muted)',
          }} />
        ))}
      </div>

      {/* Time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-secondary)' }}>{formatDuration(Math.floor(currentTime))}</span>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{duration ? formatDuration(Math.floor(duration)) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <ControlBtn onClick={() => skipSeconds(-15)}><SkipBack size={16} /></ControlBtn>
        <button
          onClick={togglePlay}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: 'none', transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {playing
            ? <Pause size={20} color="#0a0a08" fill="#0a0a08" />
            : <Play  size={20} color="#0a0a08" fill="#0a0a08" style={{ marginLeft: 2 }} />}
        </button>
        <ControlBtn onClick={() => skipSeconds(15)}><SkipForward size={16} /></ControlBtn>
        <ControlBtn onClick={() => {
          if (!isMock && audioRef.current) { audioRef.current.muted = !muted }
          setMuted(m => !m)
        }}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </ControlBtn>
      </div>

      {/* Active chapter pill */}
      {activeChapter && (
        <div style={{ marginTop: 18, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 8, borderLeft: '2px solid var(--accent-gold)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: 2 }}>Chapter {activeChapter.index + 1}</p>
          <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{activeChapter.title}</p>
        </div>
      )}

      {/* Chapter list */}
      {chapters && chapters.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Chapters
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {chapters.map(ch => (
              <button key={ch.index} onClick={() => seekToChapter(ch)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 6, border: 'none',
                background: activeChapter?.index === ch.index ? 'var(--bg-surface)' : 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                borderLeft: activeChapter?.index === ch.index ? '2px solid var(--accent-gold)' : '2px solid transparent',
              }}>
                <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', minWidth: 36 }}>
                  {formatDuration(ch.start_seconds)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: activeChapter?.index === ch.index ? 600 : 400 }}>
                  {ch.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ControlBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--ink-secondary)', transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink-primary)'; e.currentTarget.style.borderColor = 'var(--accent-gold)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-secondary)'; e.currentTarget.style.borderColor = 'var(--bg-border)' }}
    >
      {children}
    </button>
  )
}