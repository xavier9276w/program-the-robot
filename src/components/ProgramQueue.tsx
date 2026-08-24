import { motion, AnimatePresence } from 'framer-motion'
import type { Command } from '../types/game'

interface Props {
  program: Command[]
  executingIndex: number
  isRunning: boolean
  onRemove: (index: number) => void
  onMove: (from: number, to: number) => void
}

const CMD_COLORS: Record<Command, string> = {
  FORWARD: 'bg-cmd-forward/20 border-cmd-forward/50 text-cmd-forward',
  LEFT: 'bg-cmd-left/20 border-cmd-left/50 text-cmd-left',
  RIGHT: 'bg-cmd-right/20 border-cmd-right/50 text-cmd-right',
  PICKUP: 'bg-cmd-pickup/20 border-cmd-pickup/50 text-cmd-pickup',
}

const CMD_ICONS: Record<Command, string> = {
  FORWARD: '⬆️',
  LEFT: '↩️',
  RIGHT: '↪️',
  PICKUP: '✋',
}

export function ProgramQueue({ program, executingIndex, isRunning, onRemove, onMove }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Your Program
        </div>
        <div className="text-xs text-text-secondary">
          {program.length} command{program.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-[#2a2a4a] p-2 min-h-[48px] max-h-[76px] overflow-y-auto">
        {program.length === 0 ? (
          <div className="text-text-secondary text-xs text-center py-2 opacity-50">
            Tap commands below to build your program
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            <AnimatePresence mode="popLayout">
              {program.map((cmd, i) => {
                const isExecuting = isRunning && i === executingIndex
                const isExecuted = isRunning && i < executingIndex
                return (
                  <motion.div
                    key={`${i}-${cmd}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isExecuted ? 0.4 : 1,
                      scale: isExecuting ? 1.1 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`relative flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${CMD_COLORS[cmd]} ${
                      isExecuting ? 'ring-2 ring-white/50 shadow-lg' : ''
                    }`}
                  >
                    <span>{CMD_ICONS[cmd]}</span>
                    <span className="text-[10px]">{i + 1}</span>
                    {!isRunning && (
                      <div className="flex gap-0.5 ml-1">
                        {i > 0 && (
                          <button
                            onClick={() => onMove(i, i - 1)}
                            className="text-[10px] opacity-50 hover:opacity-100 active:opacity-100"
                          >
                            ◀
                          </button>
                        )}
                        {i < program.length - 1 && (
                          <button
                            onClick={() => onMove(i, i + 1)}
                            className="text-[10px] opacity-50 hover:opacity-100 active:opacity-100"
                          >
                            ▶
                          </button>
                        )}
                        <button
                          onClick={() => onRemove(i)}
                          className="text-[10px] opacity-50 hover:opacity-100 active:opacity-100 ml-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
