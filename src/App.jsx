import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import PinModal from './components/PinModal'
import ParentMode from './components/ParentMode'
import KidMode from './components/KidMode'
import useStore, { syncFromGitHub } from './store'

// Randomized starfield — memoized so stars don't move on re-render
function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 4,
      })),
    []
  )

  return (
    <div className="starfield">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="star-dot"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('kid')   // 'kid' | 'parent'
  const [showPin, setShowPin] = useState(false)
  const { setState } = useStore

  // Sync from GitHub on startup and every 2 minutes while the app is open
  useEffect(() => {
    const run = () => syncFromGitHub(useStore.setState, useStore.getState)
    run()
    const interval = setInterval(run, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleParentAccess = () => setShowPin(true)

  const handlePinSuccess = () => {
    setShowPin(false)
    setMode('parent')
  }

  const handlePinCancel = () => setShowPin(false)

  return (
    <div className="app">
      <Starfield />

      <AnimatePresence mode="wait">
        {mode === 'kid' ? (
          <KidMode key="kid" onParentAccess={handleParentAccess} />
        ) : (
          <ParentMode key="parent" onExit={() => setMode('kid')} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPin && (
          <PinModal onSuccess={handlePinSuccess} onCancel={handlePinCancel} />
        )}
      </AnimatePresence>
    </div>
  )
}
