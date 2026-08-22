import { motion } from 'framer-motion'

interface Props {
  onRun: () => void
  onReset: () => void
  onClear: () => void
  onUndoLast: () => void
  canRun: boolean
  isRunning: boolean
}

export function GameControls({ onRun, onReset, onClear, onUndoLast, canRun, isRunning }: Props) {
  return (
    <div className="flex gap-2 w-full">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRun}
        disabled={!canRun || isRunning}
        className="flex-1 bg-success rounded-xl py-3.5 text-white font-bold text-base shadow-lg shadow-success/25 active:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span className="text-xl">▶</span>
        <span>RUN PROGRAM</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onUndoLast}
        disabled={isRunning || !canRun}
        className="bg-bg-card border border-[#3a3a5a] rounded-xl px-3 py-3.5 text-text-secondary font-medium text-sm active:bg-bg-card-hover disabled:opacity-40"
        title="Undo last command (Backspace)"
      >
        ⌫
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="bg-bg-card border border-[#3a3a5a] rounded-xl px-3 py-3.5 text-text-secondary font-medium text-sm active:bg-bg-card-hover"
        title="Reset robot to start"
      >
        🔄
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClear}
        disabled={isRunning}
        className="bg-bg-card border border-[#3a3a5a] rounded-xl px-3 py-3.5 text-text-secondary font-medium text-sm active:bg-bg-card-hover disabled:opacity-40"
      >
        🗑
      </motion.button>
    </div>
  )
}
