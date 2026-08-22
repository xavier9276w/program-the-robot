import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { ConceptCard as ConceptCardType } from '../types/game'
import { ConceptCard } from './ConceptCard'

interface Props {
  show: boolean
  commandsUsed: number
  optimalCommands: number
  attempts: number
  stars: number
  onNext: () => void
  conceptCard?: ConceptCardType
  showConcept: boolean
  onDismissConcept: () => void
}

export function SuccessModal({
  show,
  commandsUsed,
  optimalCommands,
  attempts,
  stars,
  onNext,
  conceptCard,
  showConcept,
  onDismissConcept,
}: Props) {
  useEffect(() => {
    if (!show) return
    const duration = 2000
    const end = Date.now() + duration
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#22c55e', '#6366f1', '#f59e0b', '#00d4ff'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#22c55e', '#6366f1', '#f59e0b', '#00d4ff'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-card border border-success/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-2xl font-black text-success mb-3">LEVEL COMPLETE!</div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4 text-3xl">
              {[1, 2, 3].map(i => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2, type: 'spring' }}
                >
                  {i <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-bg-dark rounded-lg p-2">
                <div className="text-lg font-bold text-text-primary">{commandsUsed}</div>
                <div className="text-[10px] text-text-secondary">Commands</div>
              </div>
              <div className="bg-bg-dark rounded-lg p-2">
                <div className="text-lg font-bold text-primary-light">{optimalCommands}</div>
                <div className="text-[10px] text-text-secondary">Optimal</div>
              </div>
              <div className="bg-bg-dark rounded-lg p-2">
                <div className="text-lg font-bold text-accent">{attempts}</div>
                <div className="text-[10px] text-text-secondary">Attempts</div>
              </div>
            </div>

            {showConcept && conceptCard && (
              <div className="mb-4">
                <ConceptCard card={conceptCard} onDismiss={onDismissConcept} />
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-full bg-success rounded-xl py-3 text-white font-bold text-base shadow-lg shadow-success/25"
            >
              NEXT LEVEL →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
