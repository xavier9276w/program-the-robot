export type Direction = 'N' | 'E' | 'S' | 'W'

export type Command = 'FORWARD' | 'LEFT' | 'RIGHT' | 'PICKUP'

export interface Position {
  x: number
  y: number
}

export interface RobotState {
  x: number
  y: number
  direction: Direction
}

export type TileType = 'empty' | 'wall' | 'target' | 'hazard' | 'destination' | 'box'

export interface Level {
  id: number
  title: string
  subtitle: string
  emoji: string
  gridSize: number
  robot: RobotState
  walls: Position[]
  targets: Position[]
  hazards: Position[]
  boxes: Position[]
  destination: Position | null
  objective: string
  optimalCommands: number
  starThresholds: [number, number, number]
  tutorialSteps?: TutorialStep[]
  conceptCard?: ConceptCard
  failureConceptCard?: ConceptCard
  successConceptCard?: ConceptCard
}

export interface TutorialStep {
  message: string
  highlight?: 'commands' | 'program' | 'run' | 'board'
  position?: 'top' | 'center' | 'bottom'
}

export interface ConceptCard {
  title: string
  term: string
  definition: string
  emoji: string
}

export type ExecutionResult =
  | { type: 'success' }
  | { type: 'wall_collision'; step: number }
  | { type: 'hazard'; step: number }
  | { type: 'pickup_empty'; step: number }
  | { type: 'incomplete'; step: number }
  | { type: 'running' }

export interface GameProgress {
  currentLevel: number
  completedLevels: Record<number, { stars: number; bestCommands: number; attempts: number }>
}
