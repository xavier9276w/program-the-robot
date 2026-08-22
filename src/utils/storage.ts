import type { GameProgress } from '../types/game'

const STORAGE_KEY = 'program-the-robot-progress'

const DEFAULT_PROGRESS: GameProgress = {
  currentLevel: 1,
  completedLevels: {},
}

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    return JSON.parse(raw) as GameProgress
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(progress: GameProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch { /* ignore */ }
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}
