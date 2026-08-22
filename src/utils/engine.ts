import type { Command, Direction, Level, Position, RobotState } from '../types/game'

const DIRECTION_DELTAS: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 },
}

const TURN_LEFT: Record<Direction, Direction> = { N: 'W', W: 'S', S: 'E', E: 'N' }
const TURN_RIGHT: Record<Direction, Direction> = { N: 'E', E: 'S', S: 'W', W: 'N' }

export function directionToAngle(dir: Direction): number {
  const angles: Record<Direction, number> = { N: 0, E: 90, S: 180, W: 270 }
  return angles[dir]
}

function isBlocked(x: number, y: number, level: Level): boolean {
  if (x < 0 || y < 0 || x >= level.gridSize || y >= level.gridSize) return true
  return level.walls.some(w => w.x === x && w.y === y)
}

function isHazard(x: number, y: number, level: Level): boolean {
  return level.hazards.some(h => h.x === x && h.y === y)
}

function hasTarget(x: number, y: number, level: Level, pickedUp: Position[]): boolean {
  return level.targets.some(t =>
    t.x === x && t.y === y && !pickedUp.some(p => p.x === t.x && p.y === t.y)
  )
}

export interface StepResult {
  robot: RobotState
  pickedUp: Position[]
  status: 'ok' | 'wall' | 'hazard' | 'pickup_empty'
}

export function executeStep(
  robot: RobotState,
  cmd: Command,
  level: Level,
  pickedUp: Position[]
): StepResult {
  switch (cmd) {
    case 'FORWARD': {
      const delta = DIRECTION_DELTAS[robot.direction]
      const nx = robot.x + delta.dx
      const ny = robot.y + delta.dy
      if (isBlocked(nx, ny, level)) {
        return { robot, pickedUp, status: 'wall' }
      }
      if (isHazard(nx, ny, level)) {
        return { robot: { ...robot, x: nx, y: ny }, pickedUp, status: 'hazard' }
      }
      return { robot: { ...robot, x: nx, y: ny }, pickedUp, status: 'ok' }
    }
    case 'LEFT':
      return { robot: { ...robot, direction: TURN_LEFT[robot.direction] }, pickedUp, status: 'ok' }
    case 'RIGHT':
      return { robot: { ...robot, direction: TURN_RIGHT[robot.direction] }, pickedUp, status: 'ok' }
    case 'PICKUP': {
      if (hasTarget(robot.x, robot.y, level, pickedUp)) {
        return {
          robot,
          pickedUp: [...pickedUp, { x: robot.x, y: robot.y }],
          status: 'ok',
        }
      }
      return { robot, pickedUp, status: 'pickup_empty' }
    }
  }
}

export function checkWinCondition(
  robot: RobotState,
  level: Level,
  pickedUp: Position[]
): boolean {
  const allTargetsPickedUp = level.targets.every(t =>
    pickedUp.some(p => p.x === t.x && p.y === t.y)
  )
  if (!allTargetsPickedUp) return false
  if (level.destination) {
    return robot.x === level.destination.x && robot.y === level.destination.y
  }
  return true
}

export function getStars(commandsUsed: number, thresholds: [number, number, number]): number {
  if (commandsUsed <= thresholds[0]) return 3
  if (commandsUsed <= thresholds[1]) return 2
  return 1
}
