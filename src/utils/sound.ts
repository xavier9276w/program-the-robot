let audioCtx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export function isMuted(): boolean {
  return muted
}

export function setMuted(val: boolean) {
  muted = val
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
  if (muted) return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch { /* ignore audio errors */ }
}

export function playMove() {
  playTone(440, 0.08, 'square', 0.1)
}

export function playTurn() {
  playTone(330, 0.06, 'sine', 0.1)
}

export function playBonk() {
  playTone(100, 0.3, 'sawtooth', 0.2)
}

export function playPickup() {
  if (muted) return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 523
    osc.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.15)
    gain.gain.value = 0.15
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
  } catch { /* ignore */ }
}

export function playSuccess() {
  if (muted) return
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 100)
  })
}

export function playFail() {
  playTone(200, 0.4, 'sawtooth', 0.15)
}

export function playButton() {
  playTone(600, 0.04, 'sine', 0.05)
}
