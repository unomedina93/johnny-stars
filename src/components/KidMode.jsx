import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import useStore from '../store'
import StickerBoard from './StickerBoard'
import RewardShop from './RewardShop'
import RewardBag from './RewardBag'

// Animated number counter
function AnimatedBalance({ value }) {
  const count = useMotionValue(value)
  const rounded = useTransform(count, Math.round)
  const prevRef = useRef(value)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: 'easeOut',
    })
    prevRef.current = value
    return controls.stop
  }, [value])

  return (
    <motion.span style={{ fontFamily: 'Fredoka One, cursive' }}>
      {rounded}
    </motion.span>
  )
}

// Floating ⭐ celebration when points are earned
function StarBurst({ trigger }) {
  const [stars, setStars] = useState([])

  useEffect(() => {
    if (!trigger) return
    const newStars = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 8) * 360,
    }))
    setStars(newStars)
    setTimeout(() => setStars([]), 1200)
  }, [trigger])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <AnimatePresence>
        {stars.map((s) => {
          const rad = (s.angle * Math.PI) / 180
          const x = Math.cos(rad) * 120
          const y = Math.sin(rad) * 120
          return (
            <motion.div
              key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
              animate={{ x, y, opacity: 0, scale: 1.5 }}
              exit={{}}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                fontSize: '1.8rem',
                pointerEvents: 'none',
              }}
            >
              ⭐
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Home screen
function HomeScreen({ onShop, onBag, onParent }) {
  const { balance, bag, todayStickers } = useStore()
  const [burst, setBurst] = useState(0)
  const prevBalance = useRef(balance)

  // Trigger burst animation when balance increases
  useEffect(() => {
    if (balance > prevBalance.current) {
      setBurst((v) => v + 1)
    }
    prevBalance.current = balance
  }, [balance])

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 24px 20px',
        gap: 24,
      }}
    >
      <StarBurst trigger={burst} />

      {/* Title */}
      <div style={{
        fontFamily: 'Fredoka One, cursive',
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#ffd740',
        textShadow: '0 0 20px rgba(255,215,64,0.5)',
      }}>
        🌟 Johnny's Stars 🌟
      </div>

      {/* Balance Globe */}
      <motion.div
        className="glass-card"
        style={{
          padding: '32px 48px',
          textAlign: 'center',
          minWidth: 240,
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(255,215,64,0.3)',
            '0 0 40px rgba(255,215,64,0.5)',
            '0 0 20px rgba(255,215,64,0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          fontSize: '5rem',
          fontWeight: 900,
          color: '#ffd740',
          lineHeight: 1,
          textShadow: '0 0 30px rgba(255,215,64,0.6)',
        }}>
          <AnimatedBalance value={balance} />
        </div>
        <div style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: '1.2rem',
          color: '#90a4ae',
          marginTop: 6,
          letterSpacing: 2,
        }}>
          ⭐ STARS ⭐
        </div>
      </motion.div>

      {/* Sticker Board */}
      <div className="glass-card" style={{ padding: '20px 28px', width: '100%', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: '1rem',
          color: '#90a4ae',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          Today's Stickers
        </div>
        <StickerBoard readOnly />
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: 16,
        width: '100%',
        maxWidth: 400,
      }}>
        <motion.button
          className="btn btn-primary"
          style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onShop}
        >
          🛍️ Shop
        </motion.button>

        <motion.button
          className="btn btn-accent"
          style={{ flex: 1, padding: '16px', fontSize: '1.1rem', position: 'relative' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBag}
        >
          🎒 My Bag
          {bag.length > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#ffd740',
              color: '#1a237e',
              borderRadius: '50%',
              width: 22,
              height: 22,
              fontSize: '0.75rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {bag.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Subtle parent button */}
      <button
        onClick={onParent}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.7rem',
          cursor: 'pointer',
          marginTop: 'auto',
          padding: '4px 12px',
        }}
      >
        Parent
      </button>
    </motion.div>
  )
}

export default function KidMode({ onParentAccess }) {
  const [screen, setScreen] = useState('home') // 'home' | 'shop' | 'bag'

  return (
    <div style={{ height: '100vh', position: 'relative', zIndex: 1 }}>
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <HomeScreen
            key="home"
            onShop={() => setScreen('shop')}
            onBag={() => setScreen('bag')}
            onParent={onParentAccess}
          />
        )}
        {screen === 'shop' && (
          <RewardShop key="shop" onBack={() => setScreen('home')} />
        )}
        {screen === 'bag' && (
          <RewardBag key="bag" onBack={() => setScreen('home')} />
        )}
      </AnimatePresence>
    </div>
  )
}
