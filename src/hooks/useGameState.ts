import { useCallback, useRef, useState } from 'react'
import type { Command, GameProgress, Position, RobotState } from '../types/game'
import { levels } from '../data/levels'
import { checkWinCondition, executeStep, getStars } from '../utils/engine'
import { loadProgress, saveProgress } from '../utils/storage'
import * as sfx from '../utils/sound'

export type GamePhase =
  | 'idle'
  | 'running'
  | 'success'
  | 'fail_wall'
  | 'fail_hazard'
  | 'fail_pickup'
  | 'fail_incomplete'
  | 'game_complete'

export interface GameState {
  levelIndex: number
  program: Command[]
  robot: RobotState
  pickedUp: Position[]
  phase: GamePhase
  executingIndex: number
  attempts: number
  stars: number
  showTutorial: boolean
  tutorialStep: number
  showConcept: boolean
  progress: GameProgress
}

export function useGameState() {
  const level = useRef(0)
  const [state, setState] = useState<GameState>(() => {
    const progress = loadProgress()
    const lvlIdx = Math.min(progress.currentLevel - 1, levels.length - 1)
    level.current = lvlIdx
    return {
      levelIndex: lvlIdx,
      program: [],
      robot: { ...levels[lvlIdx].robot },
      pickedUp: [],
      phase: 'idle',
      executingIndex: -1,
      attempts: 0,
      stars: 0,
      showTutorial: lvlIdx === 0,
      tutorialStep: 0,
      showConcept: false,
      progress,
    }
  })

  const executionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentLevel = levels[state.levelIndex]

  const addCommand = useCallback((cmd: Command) => {
    sfx.playButton()
    setState(s => {
      if (s.phase !== 'idle') return s
      return { ...s, program: [...s.program, cmd] }
    })
  }, [])

  const removeCommand = useCallback((index: number) => {
    setState(s => {
      if (s.phase !== 'idle') return s
      return { ...s, program: s.program.filter((_, i) => i !== index) }
    })
  }, [])

  const removeLastCommand = useCallback(() => {
    setState(s => {
      if (s.phase !== 'idle' || s.program.length === 0) return s
      return { ...s, program: s.program.slice(0, -1) }
    })
  }, [])

  const moveCommand = useCallback((from: number, to: number) => {
    setState(s => {
      if (s.phase !== 'idle') return s
      const program = [...s.program]
      const [item] = program.splice(from, 1)
      program.splice(to, 0, item)
      return { ...s, program }
    })
  }, [])

  const clearProgram = useCallback(() => {
    setState(s => {
      if (s.phase !== 'idle') return s
      return { ...s, program: [] }
    })
  }, [])

  const resetRobot = useCallback(() => {
    if (executionTimer.current) clearTimeout(executionTimer.current)
    setState(s => ({
      ...s,
      robot: { ...levels[s.levelIndex].robot },
      pickedUp: [],
      phase: 'idle',
      executingIndex: -1,
    }))
  }, [])

  const runProgram = useCallback(() => {
    setState(s => {
      if (s.phase !== 'idle' || s.program.length === 0) return s
      return {
        ...s,
        robot: { ...levels[s.levelIndex].robot },
        pickedUp: [],
        phase: 'running',
        executingIndex: 0,
        attempts: s.attempts + 1,
      }
    })
  }, [])

  const executeNextStep = useCallback(() => {
    setState(s => {
      if (s.phase !== 'running') return s
      const lvl = levels[s.levelIndex]
      const cmd = s.program[s.executingIndex]
      if (!cmd) {
        const won = checkWinCondition(s.robot, lvl, s.pickedUp)
        if (won) {
          sfx.playSuccess()
          const stars = getStars(s.program.length, lvl.starThresholds)
          const newProgress = { ...s.progress }
          const prev = newProgress.completedLevels[lvl.id]
          newProgress.completedLevels[lvl.id] = {
            stars: Math.max(stars, prev?.stars ?? 0),
            bestCommands: Math.min(s.program.length, prev?.bestCommands ?? Infinity),
            attempts: s.attempts,
          }
          if (s.levelIndex + 1 < levels.length) {
            newProgress.currentLevel = Math.max(newProgress.currentLevel, s.levelIndex + 2)
          }
          saveProgress(newProgress)
          const isLast = s.levelIndex >= levels.length - 1
          return {
            ...s,
            phase: isLast ? 'game_complete' : 'success',
            stars,
            showConcept: !!lvl.successConceptCard,
            progress: newProgress,
          }
        }
        sfx.playFail()
        return { ...s, phase: 'fail_incomplete', showConcept: false }
      }

      const result = executeStep(s.robot, cmd, lvl, s.pickedUp)

      if (result.status === 'wall') {
        sfx.playBonk()
        return {
          ...s,
          phase: 'fail_wall',
          showConcept: !!lvl.failureConceptCard,
        }
      }
      if (result.status === 'hazard') {
        sfx.playBonk()
        return { ...s, robot: result.robot, phase: 'fail_hazard', showConcept: false }
      }
      if (result.status === 'pickup_empty') {
        sfx.playFail()
        return { ...s, phase: 'fail_pickup', showConcept: false }
      }

      if (cmd === 'FORWARD') sfx.playMove()
      else if (cmd === 'LEFT' || cmd === 'RIGHT') sfx.playTurn()
      else if (cmd === 'PICKUP') sfx.playPickup()

      const nextIdx = s.executingIndex + 1

      if (checkWinCondition(result.robot, lvl, result.pickedUp)) {
        sfx.playSuccess()
        const stars = getStars(s.program.length, lvl.starThresholds)
        const newProgress = { ...s.progress }
        const prev = newProgress.completedLevels[lvl.id]
        newProgress.completedLevels[lvl.id] = {
          stars: Math.max(stars, prev?.stars ?? 0),
          bestCommands: Math.min(s.program.length, prev?.bestCommands ?? Infinity),
          attempts: s.attempts,
        }
        if (s.levelIndex + 1 < levels.length) {
          newProgress.currentLevel = Math.max(newProgress.currentLevel, s.levelIndex + 2)
        }
        saveProgress(newProgress)
        const isLast = s.levelIndex >= levels.length - 1
        return {
          ...s,
          robot: result.robot,
          pickedUp: result.pickedUp,
          phase: isLast ? 'game_complete' : 'success',
          executingIndex: nextIdx,
          stars,
          showConcept: !!lvl.successConceptCard,
          progress: newProgress,
        }
      }

      return {
        ...s,
        robot: result.robot,
        pickedUp: result.pickedUp,
        executingIndex: nextIdx,
      }
    })
  }, [])

  const goToLevel = useCallback((idx: number) => {
    if (executionTimer.current) clearTimeout(executionTimer.current)
    level.current = idx
    setState(s => ({
      ...s,
      levelIndex: idx,
      program: [],
      robot: { ...levels[idx].robot },
      pickedUp: [],
      phase: 'idle',
      executingIndex: -1,
      attempts: 0,
      stars: 0,
      showTutorial: idx === 0 && !s.progress.completedLevels[1],
      tutorialStep: 0,
      showConcept: false,
    }))
  }, [])

  const nextLevel = useCallback(() => {
    const next = state.levelIndex + 1
    if (next < levels.length) goToLevel(next)
  }, [state.levelIndex, goToLevel])

  const nextTutorialStep = useCallback(() => {
    setState(s => {
      const steps = levels[s.levelIndex].tutorialSteps
      if (!steps) return { ...s, showTutorial: false }
      if (s.tutorialStep + 1 >= steps.length) return { ...s, showTutorial: false }
      return { ...s, tutorialStep: s.tutorialStep + 1 }
    })
  }, [])

  const skipTutorial = useCallback(() => {
    setState(s => ({ ...s, showTutorial: false }))
  }, [])

  const dismissConcept = useCallback(() => {
    setState(s => ({ ...s, showConcept: false }))
  }, [])

  return {
    state,
    currentLevel,
    addCommand,
    removeCommand,
    removeLastCommand,
    moveCommand,
    clearProgram,
    resetRobot,
    runProgram,
    executeNextStep,
    goToLevel,
    nextLevel,
    nextTutorialStep,
    skipTutorial,
    dismissConcept,
    executionTimer,
  }
}
