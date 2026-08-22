import { motion, AnimatePresence } from 'framer-motion'
import type { TutorialStep } from '../types/game'

interface Props {
  show: boolean
  step: TutorialStep
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onSkip: () => void
}

export function TutorialOverlay({ show, step, stepIndex, totalSteps, onNext, onSkip }: Props) {
  const isLast = stepIndex === totalSteps - 1

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={onNext}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-bg-card border border-primary/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-base leading-relaxed whitespace-pre-line mb-4">
              {step.message}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === stepIndex ? 'bg-primary' : 'bg-[#3a3a5a]'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onSkip}
                className="flex-1 py-2.5 text-sm text-text-secondary rounded-xl border border-[#3a3a5a] active:bg-bg-card-hover"
              >
                Skip
              </button>
              <button
                onClick={onNext}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-primary rounded-xl active:bg-primary/80"
              >
                {isLast ? "LET'S GO!" : 'NEXT'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
