import { motion } from 'framer-motion'
import type { Direction } from '../types/game'
import { directionToAngle } from '../utils/engine'

interface Props {
  direction: Direction
}

export function Robot({ direction }: Props) {
  const angle = directionToAngle(direction)

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      animate={{ rotate: angle }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))' }}
    >
      <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
        {/* Body */}
        <rect x="20" y="35" width="60" height="45" rx="8" fill="#1a2744" stroke="#00d4ff" strokeWidth="2.5" />
        {/* Head */}
        <rect x="25" y="20" width="50" height="25" rx="6" fill="#1a2744" stroke="#00d4ff" strokeWidth="2.5" />
        {/* Eyes */}
        <circle cx="38" cy="32" r="5" fill="#00d4ff">
          <animate attributeName="opacity" values="1;1;0.3;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="62" cy="32" r="5" fill="#00d4ff">
          <animate attributeName="opacity" values="1;1;0.3;1" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="50" cy="6" r="3" fill="#00d4ff">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Direction arrow */}
        <polygon points="50,88 42,80 58,80" fill="#00d4ff" opacity="0.7" transform="rotate(180 50 84)" />
        {/* Chest panel */}
        <rect x="35" y="45" width="30" height="15" rx="3" fill="#0d1b2a" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="50" x2="55" y2="50" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        <line x1="40" y1="54" x2="50" y2="54" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
      </svg>
    </motion.div>
  )
}
