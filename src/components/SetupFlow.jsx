import React from 'react'
import Chip from './Chip.jsx'

const DIFFICULTY_OPTIONS = [
  {
    id: 'easy',
    label: 'Easy 🌱',
    color: '#22C55E',
    perks: [
      { emoji: '💰', text: '3% cash interest/turn' },
      { emoji: '🎲', text: '20% Wild Card chance' },
      { emoji: '📈', text: 'More economic booms' },
      { emoji: '🛡️', text: 'No negative setbacks' },
    ],
  },
  {
    id: 'normal',
    label: 'Normal ⚖️',
    color: '#1D4ED8',
    perks: [
      { emoji: '💰', text: '2% cash interest/turn' },
      { emoji: '🎲', text: '12% Wild Card chance' },
      { emoji: '📊', text: 'Balanced economy' },
      { emoji: '🛡️', text: 'No negative setbacks' },
    ],
  },
  {
    id: 'hard',
    label: 'Hard 🔥',
    color: '#EF4444',
    perks: [
      { emoji: '💰', text: '1% cash interest/turn' },
      { emoji: '🎲', text: '8% Wild Card chance' },
      { emoji: '📉', text: 'More slowdowns' },
      { emoji: '💥', text: 'Setbacks can occur!' },
    ],
  },
]

const CHIP_INTRO_STEPS = [
  {
    mood: 'excited',
    title: "Hi! I'm Chip 🤖",
    text: "Your robot investing coach! We're going from $10 Million to $1 Billion together. Let's absolutely crush it! 💪",
  },
  {
    mood: 'happy',
    title: 'Collect Profits Each Turn',
    text: "Every turn, your companies earn profit — money straight into your pocket. Hit End Turn to collect and watch your empire grow!",
  },
  {
    mood: 'thinking',
    title: 'Profit × Multiplier = Value',
    text: "A company earning $200K/turn with a 20× multiplier is worth $4 Million. Simple math — big money! More locations = more profit.",
  },
  {
    mood: 'excited',
    title: 'Race to $1 Billion!',
    text: "Your Net Worth = cash + all your company values. Grow it from $10M to $1 Billion to win. That's 100× your starting cash!",
  },
  {
    mood: 'happy',
    title: 'Diversify to Dominate',
    text: "Own companies in different sectors so one bad market can't wipe you out. Now go build that billion-dollar empire! 🏙️",
  },
]

export default function SetupFlow({ setupStep, empireName, chipIntroStep, selectedDifficulty, onSetName, onSelectDifficulty, onAdvance }) {

  // ── Step 0: Name Your Empire ──────────────────────────────────────────────────
  if (setupStep === 0) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #1D4ED8 0%, #7C3AED 100%)',
        padding: '32px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(252,211,77,0.12)', filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ fontSize: 64, marginBottom: 6, filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.3))' }}>🏙️</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#FCD34D', marginBottom: 4, letterSpacing: '-1px', textShadow: '0 2px 20px rgba(252,211,77,0.4)' }}>
          EMPIRE BUILDER
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.65)', marginBottom: 44, textAlign: 'center' }}>
          Grow $10M into $1 Billion 🚀
        </div>

        <div style={{ width: '100%', maxWidth: 320, position: 'relative', zIndex: 1 }}>
          <label style={{ fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Name Your Empire
          </label>
          <input
            type="text"
            value={empireName}
            onChange={e => onSetName(e.target.value)}
            placeholder="e.g. Galaxy Corp"
            maxLength={24}
            autoFocus
            style={{
              width: '100%', padding: '15px 16px',
              background: 'rgba(255,255,255,0.14)',
              border: '2px solid rgba(255,255,255,0.28)',
              borderRadius: 16, color: '#fff',
              fontSize: 18, fontWeight: 700,
              fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6, textAlign: 'right', fontWeight: 700 }}>
            {empireName.length}/24
          </div>
        </div>

        <button
          onClick={onAdvance}
          disabled={empireName.trim().length === 0}
          style={{
            marginTop: 20,
            width: '100%', maxWidth: 320,
            padding: '16px',
            background: empireName.trim().length === 0
              ? 'rgba(255,255,255,0.18)'
              : 'linear-gradient(135deg, #FCD34D, #FBBF24)',
            color: empireName.trim().length === 0 ? 'rgba(255,255,255,0.4)' : '#1E293B',
            border: 'none', borderRadius: 16,
            fontSize: 18, fontWeight: 900,
            fontFamily: 'inherit',
            cursor: empireName.trim().length === 0 ? 'default' : 'pointer',
            boxShadow: empireName.trim().length > 0 ? '0 6px 24px rgba(252,211,77,0.45)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Continue →
        </button>
      </div>
    )
  }

  // ── Step 1: Choose Difficulty ─────────────────────────────────────────────────
  if (setupStep === 1) {
    const selected = DIFFICULTY_OPTIONS.find(o => o.id === selectedDifficulty)

    return (
      <div style={{
        minHeight: '100vh',
        background: '#EFF6FF',
        overflowY: 'auto',
        paddingBottom: 40,
      }}>
        <div style={{
          background: 'linear-gradient(150deg, #1D4ED8 0%, #4338CA 60%, #6D28D9 100%)',
          padding: 'calc(env(safe-area-inset-top, 0px) + 40px) 24px 28px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)', filter: 'blur(40px)',
          }} />
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
            Choose Your Challenge
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
            How hard do you want to work for that billion?
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          {DIFFICULTY_OPTIONS.map(opt => {
            const isSelected = selectedDifficulty === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => onSelectDifficulty(opt.id)}
                style={{
                  width: '100%',
                  background: isSelected ? '#fff' : '#fff',
                  border: `2px solid ${isSelected ? opt.color : '#E2E8F0'}`,
                  borderRadius: 18, padding: '16px',
                  marginBottom: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left',
                  boxShadow: isSelected ? `0 6px 20px ${opt.color}30` : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: isSelected ? opt.color : '#1E293B' }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: opt.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900,
                    }}>
                      ✓
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {opt.perks.map((p, i) => (
                    <div key={i} style={{
                      fontSize: 12, fontWeight: 700,
                      color: '#6B7280',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      <span>{p.emoji}</span>
                      <span>{p.text}</span>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ padding: '4px 16px 0' }}>
          <button
            onClick={onAdvance}
            style={{
              width: '100%', padding: '16px',
              background: selected
                ? `linear-gradient(135deg, ${selected.color}, ${selected.color}CC)`
                : 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
              color: '#fff',
              border: 'none', borderRadius: 16,
              fontSize: 17, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: selected ? `0 6px 20px ${selected.color}40` : '0 4px 16px rgba(29,78,216,0.35)',
            }}
          >
            Play as {selected ? selected.label : ''} →
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Meet Chip ─────────────────────────────────────────────────────────
  if (setupStep === 2) {
    const step = CHIP_INTRO_STEPS[chipIntroStep]
    const totalSteps = CHIP_INTRO_STEPS.length
    const isLast = chipIntroStep === totalSteps - 1

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        {/* Chip character */}
        <div style={{ filter: 'drop-shadow(0 8px 32px rgba(29,78,216,0.4))', position: 'relative', zIndex: 1 }}>
          <Chip mood={step.mood} size={140} />
        </div>

        {/* Message card */}
        <div style={{
          background: '#fff', borderRadius: 22,
          padding: '24px 22px', marginTop: 24, marginBottom: 28,
          width: '100%', maxWidth: 340,
          boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#1E293B', marginBottom: 10 }}>
            {step.title}
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', lineHeight: 1.6, margin: 0 }}>
            {step.text}
          </p>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, position: 'relative', zIndex: 1 }}>
          {CHIP_INTRO_STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === chipIntroStep ? 22 : 8, height: 8,
              borderRadius: 4,
              background: i === chipIntroStep ? '#FCD34D' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.25s ease',
            }} />
          ))}
        </div>

        <button
          onClick={onAdvance}
          style={{
            width: '100%', maxWidth: 300,
            padding: '16px',
            background: isLast
              ? 'linear-gradient(135deg, #16A34A, #22C55E)'
              : 'linear-gradient(135deg, #FCD34D, #FBBF24)',
            color: isLast ? '#fff' : '#1E293B',
            border: 'none', borderRadius: 16,
            fontSize: 17, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: isLast
              ? '0 6px 24px rgba(34,197,94,0.45)'
              : '0 6px 24px rgba(252,211,77,0.45)',
            position: 'relative', zIndex: 1,
            transition: 'all 0.2s',
          }}
        >
          {isLast ? "Let's Go! 🚀" : "Next →"}
        </button>
      </div>
    )
  }

  return null
}
