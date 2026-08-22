import { motion, AnimatePresence } from 'framer-motion'
import type { ConceptCard as ConceptCardType } from '../types/game'
import type { GamePhase } from '../hooks/useGameState'
import { ConceptCard } from './ConceptCard'

interface Props {
  phase: GamePhase
  onDebug: () => void
  conceptCard?: ConceptCardType
  showConcept: boolean
  onDismissConcept: () => void
}

const FAILURE_DATA: Record<string, { emoji: string; title: string; message: string; hint: string }> = {
  fail_wall: {
    emoji: '💥',
    title: 'BONK!',
    message: 'Your robot crashed into a wall!',
    hint: 'Try turning before moving forward.',
  },
  fail_hazard: {
    emoji: '⚡',
    title: 'ZAP!',
    message: 'Your robot hit a hazard!',
    hint: 'Plan a path around the danger zone.',
  },
  fail_pickup: {
    emoji: '🤷',
    title: 'NOTHING HERE!',
    message: "There's nothing to pick up at this spot.",
    hint: 'Move to the battery first, then pick up.',
  },
  fail_incomplete: {
    emoji: '🛑',
    title: 'PROGRAM FINISHED',
    message: 'Your program ended but the mission isn\'t complete.',
    hint: 'You need more commands to reach the goal.',
  },
}

export function FailureModal({ phase, onDebug, conceptCard, showConcept, onDismissConcept }: Props) {
  const data = FAILURE_DATA[phase]
  if (!data) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-bg-card border border-hazard/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
        >
          <div className="text-5xl mb-3">{data.emoji}</div>
          <div className="text-2xl font-black text-hazard mb-2">{data.title}</div>
          <div className="text-sm text-text-primary mb-2">{data.message}</div>
          <div className="text-xs text-text-secondary mb-4 italic">💡 {data.hint}</div>

          {showConcept && conceptCard && (
            <div className="mb-4">
              <ConceptCard card={conceptCard} onDismiss={onDismissConcept} />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onDebug}
            className="w-full bg-accent rounded-xl py-3 text-white font-bold text-base shadow-lg shadow-accent/25"
          >
            🔧 DEBUG PROGRAM
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
