import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { X, Coins, CheckCircle, AlertCircle } from 'lucide-react'
import { recordTip } from '../lib/index'
import { mistToSui } from '../lib/utils'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL

const TIP_PRESETS = [
  { label: '0.1 SUI', mist: 100_000_000 },
  { label: '0.5 SUI', mist: 500_000_000 },
  { label: '1 SUI',   mist: 1_000_000_000 },
  { label: '5 SUI',   mist: 5_000_000_000 },
]

export default function TipModal({ creator, episodeId, onClose }) {
  const account = useCurrentAccount()
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  const [selectedMist, setSelectedMist] = useState(500_000_000)
  const [message, setMessage]           = useState('')
  const [status, setStatus]             = useState('idle')
  const [errorMsg, setErrorMsg]         = useState('')

  const sendTip = async () => {
    if (!USE_MOCK && !account) return
    setStatus('sending')
    setErrorMsg('')
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 1800))
        setStatus('success')
        return
      }
      const tx = new Transaction()
      const [coin] = tx.splitCoins(tx.gas, [selectedMist])
      tx.transferObjects([coin], creator.wallet_address)
      const result = await signAndExecute({ transaction: tx })
      await recordTip({
        creator_wallet: creator.wallet_address,
        episode_id: episodeId,
        tipper_wallet: account.address,
        amount_mist: selectedMist,
        sui_tx_digest: result.digest,
        message: message.trim() || undefined,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Transaction failed')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
        borderRadius: 16, padding: 32, width: 400, maxWidth: '90vw',
        animation: 'fadeUp 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: 2 }}>Support creator</p>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>{creator.display_name}</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--ink-secondary)', padding: 4 }}><X size={20} /></button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Tip sent on-chain!</p>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.85rem' }}>
              {mistToSui(selectedMist)} SUI sent to {creator.display_name}
            </p>
            <button onClick={onClose} style={{
              marginTop: 20, padding: '10px 24px', background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)', borderRadius: 8,
              color: 'var(--ink-primary)', fontWeight: 600, cursor: 'pointer',
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {TIP_PRESETS.map(preset => (
                <button key={preset.mist} onClick={() => setSelectedMist(preset.mist)} style={{
                  padding: '10px 4px', borderRadius: 8, fontWeight: 600, fontSize: '0.8rem',
                  border: selectedMist === preset.mist ? '1px solid var(--accent-gold)' : '1px solid var(--bg-border)',
                  background: selectedMist === preset.mist ? 'var(--accent-gold)18' : 'var(--bg-elevated)',
                  color: selectedMist === preset.mist ? 'var(--accent-gold)' : 'var(--ink-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Leave a message (optional)"
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={200}
              rows={3}
              style={{ width: '100%', resize: 'none', marginBottom: 20, fontSize: '0.85rem' }}
            />

            {status === 'error' && (
              <div style={{
                display: 'flex', gap: 8, alignItems: 'center',
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                background: 'var(--accent-red)12', border: '1px solid var(--accent-red)33',
                color: 'var(--accent-red)', fontSize: '0.82rem',
              }}>
                <AlertCircle size={14} />{errorMsg}
              </div>
            )}

            {!account && !USE_MOCK ? (
              <p style={{ color: 'var(--ink-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
                Connect your Sui wallet to tip
              </p>
            ) : (
              <button onClick={sendTip} disabled={status === 'sending'} style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))',
                border: 'none', borderRadius: 8, color: '#0a0a08',
                fontWeight: 700, fontSize: '0.95rem',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                opacity: status === 'sending' ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Coins size={16} />
                {status === 'sending' ? 'Sending…' : `Tip ${mistToSui(selectedMist)} SUI`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}