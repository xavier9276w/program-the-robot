import { motion } from 'framer-motion'
import type { Level, Position, RobotState } from '../types/game'
import type { GamePhase } from '../hooks/useGameState'
import { Robot } from './Robot'

interface Props {
  level: Level
  robot: RobotState
  pickedUp: Position[]
  phase: GamePhase
}

function getTileContent(x: number, y: number, level: Level, pickedUp: Position[]): string | null {
  if (level.walls.some(w => w.x === x && w.y === y)) return '🧱'
  if (level.hazards.some(h => h.x === x && h.y === y)) return '⚡'
  if (level.destination && level.destination.x === x && level.destination.y === y) return '🏁'
  const isTarget = level.targets.some(t => t.x === x && t.y === y)
  const isPickedUp = pickedUp.some(p => p.x === x && p.y === y)
  if (isTarget && !isPickedUp) return '🔋'
  return null
}

export function GameBoard({ level, robot, pickedUp, phase }: Props) {
  const size = level.gridSize
  const cellPct = 100 / size

  const tiles: React.ReactNode[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isWall = level.walls.some(w => w.x === x && w.y === y)
      const content = getTileContent(x, y, level, pickedUp)
      tiles.push(
        <div
          key={`${x}-${y}`}
          className={`flex items-center justify-center text-lg sm:text-xl border border-[#1e1e3a] rounded-sm ${
            isWall ? 'bg-wall/40' : 'bg-grid-tile'
          }`}
        >
          {content}
        </div>
      )
    }
  }

  const isBonk = phase === 'fail_wall'

  return (
    <div
      className={`relative bg-grid-bg rounded-xl border border-[#2a2a4a] overflow-hidden aspect-square ${
        isBonk ? 'animate-[bonk-shake_0.4s_ease-in-out]' : ''
      }`}
    >
      {/* Grid tiles */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          gap: '1px',
          padding: '2px',
        }}
      >
        {tiles}
      </div>

      {/* Robot overlay */}
      <motion.div
        className="absolute z-10"
        style={{
          width: `${cellPct}%`,
          height: `${cellPct}%`,
        }}
        animate={{
          left: `${robot.x * cellPct}%`,
          top: `${robot.y * cellPct}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          mass: 0.8,
        }}
      >
        <Robot direction={robot.direction} />
      </motion.div>
    </div>
  )
}
