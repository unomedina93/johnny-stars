import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import useStore from '../store'
import PinModal from './PinModal'

function BagItem({ item, onRedeem }) {
  return (
    <motion.div
      className="glass-card"
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
      }}
    >
      <div style={{ fontSize: '2.8rem', lineHeight: 1 }}>{item.reward.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: '1.1rem',
          lineHeight: 1.2,
        }}>
          {item.reward.name}
        </div>
        <div style={{ color: '#90a4ae', fontSize: '0.75rem', marginTop: 2 }}>
          Earned {new Date(item.purchasedAt).toLocaleDateString()}
        </div>
      </div>
      <motion.button
        className="btn btn-accent"
        style={{ padding: '10px 18px', fontSize: '0.9rem' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRedeem(item)}
      >
        USE IT! 🎊
      </motion.button>
    </motion.div>
  )
}

function RedeemModal({ item, onConfirm, onCancel }) {
  const [showPin, setShowPin] = useState(false)

  if (showPin) {
    return (
      <PinModal
        onSuccess={onConfirm}
        onCancel={() => setShowPin(false)}
      />
    )
  }

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
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>{item.reward.emoji}</div>
        <div style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: '1.5rem',
          marginBottom: 8,
        }}>
          {item.reward.name}
        </div>
        <div style={{ color: '#90a4ae', marginBottom: 24, fontSize: '0.95rem' }}>
          Ask Momma or Dadda to unlock! 👨‍👩‍👦
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
            Not yet
          </button>
          <button
            className="btn btn-accent"
            style={{ flex: 1 }}
            onClick={() => setShowPin(true)}
          >
            Unlock 🔓
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function RewardBag({ onBack }) {
  const { bag, redeemReward } = useStore()
  const [redeemTarget, setRedeemTarget] = useState(null)

  const handleRedeemConfirm = () => {
    if (!redeemTarget) return
    redeemReward(redeemTarget.id)
    confetti({
      particleCount: 200,
      spread: 120,
      colors: ['#ffd740', '#ff7043', '#42a5f5', '#66bb6a', '#ffffff'],
      origin: { y: 0.4 },
    })
    setRedeemTarget(null)
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
          🎒 Johnny's Bag
        </div>
        <div className="badge badge-yellow" style={{ marginLeft: 'auto' }}>
          {bag.length} item{bag.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '0 20px 20px' }}>
        <AnimatePresence>
          {bag.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#90a4ae',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎒</div>
              <div style={{
                fontFamily: 'Fredoka One, cursive',
                fontSize: '1.3rem',
                marginBottom: 8,
                color: 'white',
              }}>
                Bag is empty!
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                Go to the shop and spend your ⭐ stars
              </div>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bag.map((item) => (
                <BagItem key={item.id} item={item} onRedeem={setRedeemTarget} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Redeem modal */}
      <AnimatePresence>
        {redeemTarget && (
          <RedeemModal
            item={redeemTarget}
            onConfirm={handleRedeemConfirm}
            onCancel={() => setRedeemTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
