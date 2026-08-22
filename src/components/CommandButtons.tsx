import { motion } from 'framer-motion'
import type { Command } from '../types/game'

interface Props {
  onAdd: (cmd: Command) => void
  disabled: boolean
}

const COMMANDS: { cmd: Command; label: string; icon: string; color: string }[] = [
  { cmd: 'FORWARD', label: 'FORWARD', icon: '⬆️', color: 'bg-cmd-forward shadow-cmd-forward/25' },
  { cmd: 'LEFT', label: 'LEFT', icon: '↩️', color: 'bg-cmd-left shadow-cmd-left/25' },
  { cmd: 'RIGHT', label: 'RIGHT', icon: '↪️', color: 'bg-cmd-right shadow-cmd-right/25' },
  { cmd: 'PICKUP', label: 'PICK UP', icon: '✋', color: 'bg-cmd-pickup shadow-cmd-pickup/25' },
]

export function CommandButtons({ onAdd, disabled }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {COMMANDS.map(({ cmd, label, icon, color }) => (
        <motion.button
          key={cmd}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAdd(cmd)}
          disabled={disabled}
          className={`${color} rounded-xl py-3 text-white font-bold text-xs shadow-lg active:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center gap-1`}
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </motion.button>
      ))}
    </div>
  )
}
