import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import useStore from '../store'
import StickerBoard from './StickerBoard'
import {
  CHORES,
  GOOD_BEHAVIOR,
  LESSONS,
  NEGATIVE_BEHAVIORS,
  STICKER_GOAL,
} from '../data'

// ─── Toast Notification ────────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Accordion Section ─────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button className="accordion-header" onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▾
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="accordion-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Action Button ─────────────────────────────────────────────────────────────
function ActionBtn({ item, onPress }) {
  const isNeg = item.points < 0
  return (
    <motion.button
      className="action-btn"
      whileTap={{ scale: 0.97 }}
      onClick={() => onPress(item)}
    >
      <span style={{ fontSize: '1.3rem' }}>{item.emoji}</span>
      <span>{item.label}</span>
      <span className={`pts ${isNeg ? 'pts-negative' : 'pts-positive'}`}>
        {isNeg ? '' : '+'}{item.points} ⭐
      </span>
    </motion.button>
  )
}

// ─── GitHub Settings Panel ─────────────────────────────────────────────────────
function GitHubSettings() {
  const raw = localStorage.getItem('johnny-github-settings')
  const saved = raw ? JSON.parse(raw) : {}
  const [token, setToken] = useState(saved.token || '')
  const [username, setUsername] = useState(saved.username || 'unomedina93')
  const [repo, setRepo] = useState(saved.repo || 'johnny-stars')
  const [status, setStatus] = useState('')

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.07)',
    color: 'white',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: 10,
  }

  const save = () => {
    localStorage.setItem(
      'johnny-github-settings',
      JSON.stringify({ token, username, repo })
    )
    setStatus('✅ Saved!')
    setTimeout(() => setStatus(''), 2000)
  }

  return (
    <div style={{ padding: '4px 0 8px' }}>
      <div style={{ color: '#90a4ae', fontSize: '0.8rem', marginBottom: 12 }}>
        Phone dashboard syncs automatically when WiFi is available.
      </div>
      <input
        style={inputStyle}
        placeholder="GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Repo name (e.g. johnny-stars)"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <input
        style={{ ...inputStyle, fontFamily: 'monospace' }}
        placeholder="GitHub Personal Access Token"
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <div style={{ color: '#90a4ae', fontSize: '0.75rem', marginBottom: 12 }}>
        Token needs <code>repo</code> scope. Dashboard URL after setup:
        <br />
        <span style={{ color: '#42a5f5' }}>
          https://{username || 'you'}.github.io/{repo || 'repo'}/
        </span>
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={save}>
        Save Settings
      </button>
      {status && (
        <div style={{ color: '#66bb6a', textAlign: 'center', marginTop: 8, fontWeight: 700 }}>
          {status}
        </div>
      )}
    </div>
  )
}

// ─── History Log ───────────────────────────────────────────────────────────────
function HistoryLog() {
  const { history } = useStore()

  const fmt = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {history.length === 0 ? (
        <div style={{ color: '#90a4ae', textAlign: 'center', padding: 20 }}>
          No history yet
        </div>
      ) : (
        history.slice(0, 30).map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-emoji">{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="history-label">{item.label}</div>
              <div className="history-date">{fmt(item.date)}</div>
            </div>
            <div
              className="history-pts"
              style={{
                color: item.points > 0
                  ? '#81c784'
                  : item.points < 0
                  ? '#ef9a9a'
                  : '#90a4ae',
              }}
            >
              {item.points > 0 ? '+' : ''}{item.points !== 0 ? `${item.points} ⭐` : '🎊'}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ─── Parent Mode Root ──────────────────────────────────────────────────────────
export default function ParentMode({ onExit }) {
  const {
    balance,
    todayStickers,
    addPoints,
    addSticker,
    removeSticker,
    resetDay,
  } = useStore()

  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const handleAction = (item) => {
    addPoints(item.points, item.label, item.emoji)
    if (item.points > 0) {
      confetti({
        particleCount: 60,
        spread: 55,
        colors: ['#ffd740', '#42a5f5', '#66bb6a'],
        origin: { y: 0.7 },
      })
      showToast(`${item.emoji} +${item.points} stars for ${item.label}!`)
    } else {
      showToast(`${item.emoji} ${item.points} stars — ${item.label}`)
    }
  }

  const handleAddSticker = () => {
    if (todayStickers >= STICKER_GOAL) {
      showToast('⭐ All stickers already earned today!')
      return
    }
    addSticker()
    showToast(`⭐ Sticker added! (${todayStickers + 1}/${STICKER_GOAL})`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Toast msg={toast} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '1.4rem' }}>
            🔑 Parent Mode
          </div>
          <div style={{ color: '#90a4ae', fontSize: '0.85rem' }}>
            Johnny's balance:
            <strong style={{ color: '#ffd740', marginLeft: 6 }}>⭐ {balance}</strong>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onExit}>
          Exit ✕
        </button>
      </div>

      {/* Content */}
      <div className="scroll-area" style={{ padding: '16px 24px 24px' }}>

        {/* Sticker Board */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 16 }}>
          <div className="section-title">⭐ Today's Stickers</div>
          <StickerBoard />
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-yellow" style={{ flex: 1 }} onClick={handleAddSticker}>
              + Add Sticker
            </button>
            <button className="btn btn-ghost" onClick={removeSticker}>
              Remove
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => { resetDay(); showToast('🌅 New day started!') }}
            >
              New Day
            </button>
          </div>
        </div>

        {/* Chores */}
        <div className="glass-card" style={{ padding: '8px 16px', marginBottom: 12 }}>
          <Accordion title="🧹 Chores" defaultOpen>
            {CHORES.map((item) => (
              <ActionBtn key={item.id} item={item} onPress={handleAction} />
            ))}
          </Accordion>
        </div>

        {/* Good Behavior */}
        <div className="glass-card" style={{ padding: '8px 16px', marginBottom: 12 }}>
          <Accordion title="😇 Good Behavior" defaultOpen>
            {GOOD_BEHAVIOR.map((item) => (
              <ActionBtn key={item.id} item={item} onPress={handleAction} />
            ))}
          </Accordion>
        </div>

        {/* Lessons */}
        <div className="glass-card" style={{ padding: '8px 16px', marginBottom: 12 }}>
          <Accordion title="📚 Lessons" defaultOpen>
            {LESSONS.map((item) => (
              <ActionBtn key={item.id} item={item} onPress={handleAction} />
            ))}
          </Accordion>
        </div>

        {/* Deductions — collapsed by default, minimal */}
        <div className="glass-card" style={{ padding: '8px 16px', marginBottom: 12 }}>
          <Accordion title="⚠️ Deductions">
            <div style={{
              color: '#90a4ae',
              fontSize: '0.8rem',
              padding: '4px 0 8px',
            }}>
              Use sparingly. Johnny works hard! 💙
            </div>
            {NEGATIVE_BEHAVIORS.map((item) => (
              <ActionBtn key={item.id} item={item} onPress={handleAction} />
            ))}
          </Accordion>
        </div>

        {/* History */}
        <div className="glass-card" style={{ padding: '8px 16px', marginBottom: 12 }}>
          <Accordion title="📋 History">
            <HistoryLog />
          </Accordion>
        </div>

        {/* GitHub Settings */}
        <div className="glass-card" style={{ padding: '8px 16px', marginBottom: 12 }}>
          <Accordion title="📱 Phone Dashboard (GitHub Pages)">
            <GitHubSettings />
          </Accordion>
        </div>

      </div>
    </motion.div>
  )
}
