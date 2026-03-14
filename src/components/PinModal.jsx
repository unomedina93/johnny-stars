import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PARENT_PIN } from '../data'

export default function PinModal({ onSuccess, onCancel }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleKey = (digit) => {
    if (input.length >= 4) return
    const next = input + digit
    setInput(next)
    setError(false)

    if (next.length === 4) {
      setTimeout(() => {
        if (next === PARENT_PIN) {
          onSuccess()
        } else {
          setError(true)
          setTimeout(() => {
            setInput('')
            setError(false)
          }, 700)
        }
      }, 150)
    }
  }

  const handleBackspace = () => {
    setInput((v) => v.slice(0, -1))
    setError(false)
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="pin-overlay" onClick={onCancel}>
      <motion.div
        className="pin-box"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pin-title">🔒 Parent Access</div>
        <div className="pin-subtitle">Enter your PIN to continue</div>

        {/* Dots */}
        <motion.div
          className="pin-dots"
          animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${i < input.length ? (error ? 'error' : 'filled') : ''}`}
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <div className="pin-keypad">
          {keys.map((k, i) => (
            <button
              key={i}
              className="pin-key"
              style={k === '' ? { visibility: 'hidden' } : {}}
              onClick={() => (k === '⌫' ? handleBackspace() : k !== '' && handleKey(k))}
            >
              {k}
            </button>
          ))}
        </div>

        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onCancel}>
          Cancel
        </button>
      </motion.div>
    </div>
  )
}
