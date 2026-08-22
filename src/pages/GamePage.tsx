import { useEffect, useCallback, useState } from 'react'
import { GameBoard } from '../components/GameBoard'
import { ProgramQueue } from '../components/ProgramQueue'
import { CommandButtons } from '../components/CommandButtons'
import { GameControls } from '../components/GameControls'
import { FailureModal } from '../components/FailureModal'
import { SuccessModal } from '../components/SuccessModal'
import { TutorialOverlay } from '../components/TutorialOverlay'
import { FinalSummary } from '../components/FinalSummary'
import { useGameState } from '../hooks/useGameState'
import { isMuted, setMuted } from '../utils/sound'
import { resetProgress } from '../utils/storage'
import { levels } from '../data/levels'

export function GamePage() {
  const {
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
  } = useGameState()

  const [muted, setMutedState] = useState(isMuted())
  const [showSettings, setShowSettings] = useState(false)

  const toggleMute = useCallback(() => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
  }, [muted])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        removeLastCommand()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [removeLastCommand])

  useEffect(() => {
    if (state.phase !== 'running') return
    executionTimer.current = setTimeout(executeNextStep, 500)
    return () => { if (executionTimer.current) clearTimeout(executionTimer.current) }
  }, [state.phase, state.executingIndex, executeNextStep, executionTimer])

  const handleDebug = useCallback(() => {
    resetRobot()
  }, [resetRobot])

  const handleRestart = useCallback(() => {
    resetProgress()
    goToLevel(0)
  }, [goToLevel])

  if (state.phase === 'game_complete') {
    return (
      <FinalSummary
        program={state.program}
        progress={state.progress}
        onRestart={handleRestart}
      />
    )
  }

  const isFailed = state.phase.startsWith('fail')
  const isRunning = state.phase === 'running'
  const tutorialSteps = currentLevel.tutorialSteps

  return (
    <div className="min-h-dvh bg-bg-dark flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex-1">
          <div className="text-[10px] font-bold text-primary-light uppercase tracking-widest">
            Level {currentLevel.id}
          </div>
          <div className="text-sm font-bold">
            {currentLevel.emoji} {currentLevel.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-text-secondary bg-bg-card rounded-lg px-2.5 py-1 border border-[#2a2a4a]">
            Attempt {state.attempts || '—'}
          </div>
          <button
            onClick={toggleMute}
            className="text-lg w-8 h-8 flex items-center justify-center rounded-lg bg-bg-card border border-[#2a2a4a]"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm w-8 h-8 flex items-center justify-center rounded-lg bg-bg-card border border-[#2a2a4a] text-text-secondary"
          >
            ⚙
          </button>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="w-full max-w-md px-4 mb-2">
          <div className="bg-bg-card rounded-xl border border-[#2a2a4a] p-3 space-y-2">
            <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Select Level
            </div>
            <div className="flex flex-wrap gap-1.5">
              {levels.map((lvl, i) => {
                const unlocked = i === 0 || state.progress.completedLevels[lvl.id - 1]
                  || (state.progress.currentLevel > i)
                const completed = state.progress.completedLevels[lvl.id]
                return (
                  <button
                    key={lvl.id}
                    disabled={!unlocked}
                    onClick={() => { goToLevel(i); setShowSettings(false) }}
                    className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center border transition-colors ${
                      i === state.levelIndex
                        ? 'bg-primary border-primary text-white'
                        : unlocked
                          ? 'bg-bg-card-hover border-[#3a3a5a] text-text-primary'
                          : 'bg-bg-dark border-[#2a2a3a] text-[#3a3a5a] cursor-not-allowed'
                    }`}
                  >
                    {completed ? '⭐' : lvl.id}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => { handleRestart(); setShowSettings(false) }}
              className="text-xs text-red-400 mt-2 active:text-red-300"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      )}

      {/* Objective */}
      <div className="w-full max-w-md px-4 mb-2">
        <div className="bg-bg-card border border-[#2a2a4a] rounded-lg px-3 py-2 text-center">
          <div className="text-sm font-semibold text-text-primary">
            {currentLevel.objective}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="w-full max-w-md px-4 mb-3">
        <GameBoard
          level={currentLevel}
          robot={state.robot}
          pickedUp={state.pickedUp}
          phase={state.phase}
        />
      </div>

      {/* Concept card - inline, auto-hidden once user adds commands */}
      {currentLevel.conceptCard && state.phase === 'idle' && state.attempts === 0 && state.program.length === 0 && !state.showTutorial && (
        <div className="w-full max-w-md px-4 mb-2">
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-2.5 text-center" onClick={dismissConcept}>
            <div className="text-[10px] font-bold text-primary-light uppercase tracking-wider mb-0.5">
              💡 {currentLevel.conceptCard.title}
            </div>
            <div className="text-sm font-bold text-text-primary">{currentLevel.conceptCard.term}</div>
            <div className="text-xs text-text-secondary">{currentLevel.conceptCard.definition}</div>
          </div>
        </div>
      )}

      {/* Program Queue */}
      <div className="w-full max-w-md px-4 mb-2">
        <ProgramQueue
          program={state.program}
          executingIndex={state.executingIndex}
          isRunning={isRunning}
          onRemove={removeCommand}
          onMove={moveCommand}
        />
      </div>

      {/* Command Buttons */}
      <div className="w-full max-w-md px-4 mb-2">
        <CommandButtons onAdd={addCommand} disabled={isRunning} />
      </div>

      {/* Game Controls */}
      <div className="w-full max-w-md px-4 pb-6">
        <GameControls
          onRun={runProgram}
          onReset={resetRobot}
          onClear={clearProgram}
          onUndoLast={removeLastCommand}
          canRun={state.program.length > 0}
          isRunning={isRunning}
        />
      </div>

      {/* Tutorial */}
      {state.showTutorial && tutorialSteps && (
        <TutorialOverlay
          show={state.showTutorial}
          step={tutorialSteps[state.tutorialStep]}
          stepIndex={state.tutorialStep}
          totalSteps={tutorialSteps.length}
          onNext={nextTutorialStep}
          onSkip={skipTutorial}
        />
      )}

      {/* Failure Modal */}
      {isFailed && (
        <FailureModal
          phase={state.phase}
          onDebug={handleDebug}
          conceptCard={currentLevel.failureConceptCard}
          showConcept={state.showConcept}
          onDismissConcept={dismissConcept}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        show={state.phase === 'success'}
        commandsUsed={state.program.length}
        optimalCommands={currentLevel.optimalCommands}
        attempts={state.attempts}
        stars={state.stars}
        onNext={nextLevel}
        conceptCard={currentLevel.successConceptCard}
        showConcept={state.showConcept}
        onDismissConcept={dismissConcept}
      />
    </div>
  )
}
