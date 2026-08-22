import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Command, GameProgress } from '../types/game'

interface Props {
  program: Command[]
  progress: GameProgress
  onRestart: () => void
}

const CONCEPTS = [
  { emoji: '📐', term: 'Algorithm', definition: 'A step-by-step plan to solve a problem' },
  { emoji: '🐛', term: 'Debugging', definition: 'Finding and fixing mistakes in code' },
  { emoji: '💻', term: 'Programming', definition: 'Writing instructions for a computer' },
  { emoji: '🧩', term: 'Problem Solving', definition: 'Breaking big problems into small steps' },
]

function programToPseudoCode(program: Command[]): string {
  return program
    .map((cmd, i) => {
      const line = i + 1
      switch (cmd) {
        case 'FORWARD': return `${line}. Move forward one step`
        case 'LEFT': return `${line}. Turn left 90°`
        case 'RIGHT': return `${line}. Turn right 90°`
        case 'PICKUP': return `${line}. Pick up item`
      }
    })
    .join('\n')
}

function programToJS(program: Command[]): string {
  const lines = program.map(cmd => {
    switch (cmd) {
      case 'FORWARD': return '  robot.moveForward();'
      case 'LEFT': return '  robot.turnLeft();'
      case 'RIGHT': return '  robot.turnRight();'
      case 'PICKUP': return '  robot.pickUp();'
    }
  })
  return `async function solve(robot) {\n${lines.join('\n')}\n}`
}

export function FinalSummary({ program, progress, onRestart }: Props) {
  const [showCode, setShowCode] = useState(false)
  const [codeMode, setCodeMode] = useState<'pseudo' | 'js'>('pseudo')

  const totalStars = Object.values(progress.completedLevels).reduce(
    (sum, lvl) => sum + lvl.stars, 0
  )

  return (
    <div className="min-h-dvh bg-bg-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-7xl mb-4"
      >
        🏆
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-6"
      >
        <div className="text-3xl font-black text-text-primary mb-2">
          MISSION COMPLETE!
        </div>
        <div className="text-text-secondary">
          You earned {totalStars} / 15 ⭐
        </div>
      </motion.div>

      {/* Concept cards */}
      <div className="w-full max-w-sm mb-6 space-y-2">
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider text-center mb-2">
          You learned about...
        </div>
        {CONCEPTS.map((concept, i) => (
          <motion.div
            key={concept.term}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className="bg-bg-card border border-[#2a2a4a] rounded-xl p-3 flex items-center gap-3"
          >
            <span className="text-2xl">{concept.emoji}</span>
            <div>
              <div className="text-sm font-bold text-text-primary">{concept.term}</div>
              <div className="text-xs text-text-secondary">{concept.definition}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="w-full max-w-sm text-center mb-6"
      >
        <div className="text-lg font-bold text-primary-light mb-1">
          That's programming! 🎉
        </div>
        <div className="text-sm text-text-secondary">
          You just did what software engineers do every day — break problems into steps, test, debug, and improve.
        </div>
      </motion.div>

      {/* Show Code button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCode(!showCode)}
        className="w-full max-w-sm bg-primary rounded-xl py-3 text-white font-bold text-base shadow-lg shadow-primary/25 mb-3"
      >
        {showCode ? 'HIDE CODE' : '👨‍💻 SHOW ME THE CODE'}
      </motion.button>

      {showCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full max-w-sm mb-4"
        >
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setCodeMode('pseudo')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                codeMode === 'pseudo'
                  ? 'bg-primary text-white'
                  : 'bg-bg-card text-text-secondary border border-[#3a3a5a]'
              }`}
            >
              Pseudocode
            </button>
            <button
              onClick={() => setCodeMode('js')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
                codeMode === 'js'
                  ? 'bg-primary text-white'
                  : 'bg-bg-card text-text-secondary border border-[#3a3a5a]'
              }`}
            >
              JavaScript
            </button>
          </div>
          <pre className="bg-[#0d0d20] border border-[#2a2a4a] rounded-xl p-4 text-xs text-cmd-forward font-mono overflow-x-auto whitespace-pre-wrap">
            {codeMode === 'pseudo' ? programToPseudoCode(program) : programToJS(program)}
          </pre>
        </motion.div>
      )}

      <button
        onClick={onRestart}
        className="text-sm text-text-secondary active:text-text-primary"
      >
        Play Again
      </button>
    </div>
  )
}
