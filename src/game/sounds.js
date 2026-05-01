// Empire Builder Sound Engine — Web Audio API, no external deps

let ctx = null
let muted = false

try { muted = localStorage.getItem('empireBuilderMuted') === 'true' } catch(e) {}

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      return null
    }
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, type, startTime, duration, gainVal, fadeOut = true) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(gainVal, startTime)
  if (fadeOut) gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.01)
}

function playSequence(notes, globalGain = 0.18) {
  if (muted) return
  const c = getCtx()
  if (!c) return
  let t = c.currentTime + 0.05
  notes.forEach(([freq, dur, type = 'sine']) => {
    tone(freq, type, t, dur, globalGain)
    t += dur * 0.85
  })
}

// Haptic feedback (mobile) — respects mute
function vibrate(pattern) {
  if (muted) return
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern) } catch (e) {}
  }
}

export const SFX = {
  setMuted(val) {
    muted = val
    try { localStorage.setItem('empireBuilderMuted', val ? 'true' : 'false') } catch(e) {}
    if (!val && navigator.vibrate) {
      try { navigator.vibrate(20) } catch(e) {} // confirm unmute with a tap
    }
  },
  isMuted() { return muted },

  buy() {
    // Cash register cha-ching
    playSequence([
      [880, 0.07, 'triangle'],
      [1100, 0.07, 'triangle'],
      [1320, 0.12, 'triangle'],
    ], 0.22)
    vibrate([30, 10, 30])
  },

  sell() {
    // Swoosh + coins
    playSequence([
      [660, 0.08, 'triangle'],
      [880, 0.08, 'triangle'],
      [550, 0.12, 'triangle'],
    ], 0.20)
    vibrate([20])
  },

  earn() {
    // Small coin shimmer
    playSequence([
      [440, 0.06, 'sine'],
      [554, 0.06, 'sine'],
      [659, 0.10, 'sine'],
    ], 0.14)
  },

  earnBig() {
    // Larger coin shower — for big profits
    playSequence([
      [440, 0.07, 'sine'],
      [554, 0.07, 'sine'],
      [659, 0.07, 'sine'],
      [880, 0.12, 'sine'],
    ], 0.20)
    vibrate([20, 10, 20])
  },

  openLocation() {
    // Construction tap
    playSequence([
      [220, 0.05, 'square'],
      [330, 0.05, 'square'],
      [440, 0.10, 'square'],
    ], 0.15)
    vibrate([15, 5, 15])
  },

  sellLocation() {
    // Soft pop
    playSequence([
      [440, 0.08, 'triangle'],
      [330, 0.10, 'triangle'],
    ], 0.16)
    vibrate([10])
  },

  endTurn() {
    // Satisfying tick
    playSequence([
      [300, 0.04, 'sine'],
      [400, 0.08, 'sine'],
    ], 0.18)
  },

  levelUp() {
    // Short fanfare
    playSequence([
      [523, 0.12, 'triangle'],
      [659, 0.12, 'triangle'],
      [784, 0.12, 'triangle'],
      [1047, 0.22, 'triangle'],
    ], 0.28)
    vibrate([50, 20, 50, 20, 100])
  },

  win() {
    // Full celebration jingle
    playSequence([
      [523, 0.10, 'triangle'],
      [659, 0.10, 'triangle'],
      [784, 0.10, 'triangle'],
      [1047, 0.10, 'triangle'],
      [784, 0.10, 'triangle'],
      [1047, 0.20, 'triangle'],
    ], 0.30)
    vibrate([100, 30, 100, 30, 200])
  },

  flashSale() {
    // Notification ding
    playSequence([
      [880, 0.10, 'sine'],
      [1100, 0.14, 'sine'],
    ], 0.22)
    vibrate([30])
  },

  wildCard() {
    // Dramatic sting
    playSequence([
      [220, 0.08, 'sawtooth'],
      [330, 0.08, 'sawtooth'],
      [440, 0.08, 'sawtooth'],
      [660, 0.18, 'triangle'],
    ], 0.22)
    vibrate([40, 20, 40])
  },

  downturn() {
    // Descending warning tone
    playSequence([
      [440, 0.12, 'sine'],
      [370, 0.12, 'sine'],
      [294, 0.18, 'sine'],
    ], 0.18)
    vibrate([20, 10, 40])
  },

  cantAfford() {
    // Thud
    playSequence([
      [120, 0.15, 'square'],
    ], 0.20)
    vibrate([30])
  },

  newsOpen() {
    // Paper rustle — soft high noise burst
    playSequence([
      [800, 0.04, 'triangle'],
      [900, 0.04, 'triangle'],
      [750, 0.06, 'triangle'],
    ], 0.10)
  },

  achievement() {
    // Achievement unlocked chime
    playSequence([
      [659, 0.08, 'triangle'],
      [784, 0.08, 'triangle'],
      [1047, 0.16, 'triangle'],
    ], 0.24)
    vibrate([20, 10, 50])
  },

  sectorUnlock() {
    // Big reveal
    playSequence([
      [261, 0.10, 'triangle'],
      [330, 0.10, 'triangle'],
      [392, 0.10, 'triangle'],
      [523, 0.10, 'triangle'],
      [659, 0.10, 'triangle'],
      [784, 0.24, 'triangle'],
    ], 0.28)
    vibrate([30, 15, 30, 15, 80])
  },

  // ── New sounds ───────────────────────────────────────────────────────────────

  profitCascade() {
    // Coin shimmer sweep — plays as profit particles cascade
    playSequence([
      [523, 0.06, 'sine'],
      [659, 0.06, 'sine'],
      [784, 0.06, 'sine'],
      [1047, 0.10, 'sine'],
    ], 0.12)
    vibrate([10])
  },

  flashPulse() {
    // Flash sale tap — punchy double-ping
    playSequence([
      [1200, 0.05, 'triangle'],
      [1400, 0.08, 'triangle'],
    ], 0.18)
    vibrate([15, 5, 25])
  },

  buyLand() {
    // Soft thud when emoji lands in portfolio
    playSequence([
      [180, 0.06, 'triangle'],
      [260, 0.10, 'triangle'],
    ], 0.14)
    vibrate([20])
  },

  opportunity() {
    // Rising positive sting for new opportunity event
    playSequence([
      [440, 0.07, 'triangle'],
      [554, 0.07, 'triangle'],
      [659, 0.07, 'triangle'],
      [880, 0.12, 'triangle'],
      [1100, 0.16, 'triangle'],
    ], 0.20)
    vibrate([20, 10, 20, 10, 50])
  },

  swipeBack() {
    // Quick swoosh haptic for swipe-to-go-back
    vibrate([15])
  },
}
