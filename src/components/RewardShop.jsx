import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import useStore from '../store'
import { DEFAULT_REWARDS } from '../data'

function RewardCard({ reward, balance, onBuy }) {
  const canAfford = balance >= reward.cost
  const pct = Math.min(100, Math.round((balance / reward.cost) * 100))

  return (
    <motion.div
      className="glass-card"
      style={{
        padding: '20px 16px',
        textAlign: 'center',
        cursor: canAfford ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      animate={canAfford ? {
        boxShadow: [
          '0 0 12px rgba(255,215,64,0.3)',
          '0 0 28px rgba(255,215,64,0.6)',
          '0 0 12px rgba(255,215,64,0.3)',
        ],
      } : { boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}
      transition={{ duration: 2, repeat: canAfford ? Infinity : 0, ease: 'easeInOut' }}
      whileHover={canAfford ? { scale: 1.04 } : {}}
      whileTap={canAfford ? { scale: 0.97 } : {}}
      onClick={() => canAfford && onBuy(reward)}
    >
      {canAfford && (
        <div
          className="badge badge-yellow"
          style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.7rem' }}
        >
          READY!
        </div>
      )}

      <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: 8 }}>
        {reward.emoji}
      </div>

      <div style={{
        fontFamily: 'Fredoka One, cursive',
        fontSize: '1rem',
        marginBottom: 6,
        lineHeight: 1.2,
      }}>
        {reward.name}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        color: '#ffd740',
        fontWeight: 900,
        fontSize: '0.95rem',
        marginBottom: 10,
      }}>
        ⭐ {reward.cost}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div style={{ fontSize: '0.7rem', color: '#90a4ae', marginTop: 4 }}>
        {canAfford ? '✅ Tap to buy!' : `${balance} / ${reward.cost} ⭐`}
      </div>
    </motion.div>
  )
}

// Confirm purchase modal
function ConfirmModal({ reward, onConfirm, onCancel }) {
  return (
    <div className="pin-overlay" onClick={onCancel}>
      <motion.div
        className="pin-box"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: 340 }}
      >
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>{reward.emoji}</div>
        <div style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: '1.5rem',
          marginBottom: 8,
        }}>
          {reward.name}
        </div>
        <div style={{ color: '#90a4ae', marginBottom: 24, fontSize: '0.95rem' }}>
          Spend <strong style={{ color: '#ffd740' }}>⭐ {reward.cost}</strong> stars?
          <br />
          It'll go in your bag!
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
            Nope!
          </button>
          <button className="btn btn-yellow" style={{ flex: 1 }} onClick={onConfirm}>
            Yes! 🎉
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function RewardShop({ onBack }) {
  const { balance, purchaseReward } = useStore()
  const [confirm, setConfirm] = useState(null)

  const handleBuy = (reward) => setConfirm(reward)

  const handleConfirm = () => {
    if (!confirm) return
    const success = purchaseReward(confirm)
    if (success) {
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#ffd740', '#ff7043', '#42a5f5', '#66bb6a'],
        origin: { y: 0.5 },
      })
    }
    setConfirm(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 24px 16px',
      }}>
        <button className="btn btn-ghost" style={{ padding: '8px 16px' }} onClick={onBack}>
          ← Back
        </button>
        <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: '1.6rem' }}>
          🛍️ Reward Shop
        </div>
        <div style={{ marginLeft: 'auto', color: '#ffd740', fontWeight: 900 }}>
          ⭐ {balance}
        </div>
      </div>

      {/* Grid */}
      <div className="scroll-area" style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14,
        }}>
          {DEFAULT_REWARDS.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <RewardCard reward={reward} balance={balance} onBuy={handleBuy} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            reward={confirm}
            onConfirm={handleConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
