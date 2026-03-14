import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import { STICKER_GOAL } from '../data'

export default function StickerBoard({ readOnly = false }) {
  const { todayStickers, stickerGoalMet } = useStore()

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        gap: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        {Array.from({ length: STICKER_GOAL }, (_, i) => {
          const filled = i < todayStickers
          return (
            <motion.div
              key={i}
              animate={filled
                ? { scale: [1, 1.4, 1], rotate: [0, 15, -10, 0] }
                : {}}
              transition={{ duration: 0.5, delay: filled ? i * 0.08 : 0 }}
              style={{ fontSize: readOnly ? '2.2rem' : '2.6rem', lineHeight: 1 }}
            >
              {filled ? '⭐' : '☆'}
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {stickerGoalMet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              color: '#ffd740',
              fontFamily: 'Fredoka One, cursive',
              fontSize: '1.1rem',
              marginTop: 4,
            }}
          >
            Amazing! All stickers! 🎉
          </motion.div>
        )}
        {!stickerGoalMet && (
          <motion.div
            style={{ color: '#90a4ae', fontSize: '0.85rem', marginTop: 4 }}
          >
            {todayStickers} / {STICKER_GOAL} stickers today
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
