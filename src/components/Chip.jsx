import React from 'react'

// Chip the Robot Coach — Pixar-style SVG with 4 mood states
// Moods: happy | excited | worried | thinking

export default function Chip({ mood = 'happy', size = 120 }) {
  const scale = size / 120

  // Mood-driven expression values
  const moods = {
    happy: {
      // Eyes: normal rectangles
      eyeColor: '#7DF9FF',
      eyeGlow: '#00E5FF',
      // Eyebrows: flat, slightly arched
      leftBrow:  { x1: 28, y1: 31, x2: 45, y2: 29 },
      rightBrow: { x1: 55, y1: 29, x2: 72, y2: 31 },
      // Mouth: gentle curve smile
      mouth: 'M 35 62 Q 48 70 65 62',
      mouthFill: 'none',
      // Arms: relaxed down
      leftArm:  'M 22 96 L 8 108 L 10 120',
      rightArm: 'M 98 96 L 112 108 L 110 120',
      // Thought bubbles: none
      bubbles: [],
    },
    excited: {
      eyeColor: '#FFE566',
      eyeGlow: '#FFD700',
      leftBrow:  { x1: 26, y1: 27, x2: 45, y2: 25 },
      rightBrow: { x1: 55, y1: 25, x2: 74, y2: 27 },
      mouth: 'M 32 60 Q 48 74 68 60',
      mouthFill: 'none',
      // Arms: raised in excitement
      leftArm:  'M 22 88 L 6 72 L 8 58',
      rightArm: 'M 98 88 L 114 72 L 112 58',
      bubbles: [],
    },
    worried: {
      eyeColor: '#FF8A80',
      eyeGlow: '#FF5252',
      // Eyebrows angled down toward center (worried V shape)
      leftBrow:  { x1: 28, y1: 29, x2: 45, y2: 33 },
      rightBrow: { x1: 55, y1: 33, x2: 72, y2: 29 },
      // Mouth: frown
      mouth: 'M 35 68 Q 48 60 65 68',
      mouthFill: 'none',
      // Arms: out to sides, tense
      leftArm:  'M 22 96 L 4 88 L 2 100',
      rightArm: 'M 98 96 L 116 88 L 118 100',
      bubbles: [],
    },
    thinking: {
      eyeColor: '#B2DFDB',
      eyeGlow: '#80CBC4',
      // One eyebrow raised (left), one flat
      leftBrow:  { x1: 28, y1: 27, x2: 45, y2: 31 },
      rightBrow: { x1: 55, y1: 31, x2: 72, y2: 31 },
      // Mouth: flat
      mouth: 'M 35 64 L 65 64',
      mouthFill: 'none',
      // Arms: one up for thinking gesture
      leftArm:  'M 22 96 L 8 108 L 10 120',
      rightArm: 'M 98 90 L 110 72 L 104 60',
      bubbles: [
        { cx: 78, cy: 44, r: 4 },
        { cx: 86, cy: 36, r: 6 },
        { cx: 96, cy: 26, r: 8 },
      ],
    },
  }

  const m = moods[mood] || moods.happy

  return (
    <svg
      viewBox="0 0 120 170"
      width={size}
      height={size * (170 / 120)}
      style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
    >
      <defs>
        <radialGradient id={`eyeGlow_${mood}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={m.eyeColor} />
          <stop offset="100%" stopColor={m.eyeGlow} />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78909C" />
          <stop offset="100%" stopColor="#37474F" />
        </linearGradient>
        <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90A4AE" />
          <stop offset="100%" stopColor="#546E7A" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A237E" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
      </defs>

      {/* ── Antenna (Y-shape) ─────────────────── */}
      <line x1="60" y1="20" x2="60" y2="5" stroke="#90A4AE" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="10" x2="50" y2="2" stroke="#90A4AE" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="10" x2="70" y2="2" stroke="#90A4AE" strokeWidth="2.5" strokeLinecap="round" />
      {/* Antenna tips */}
      <circle cx="50" cy="2" r="3" fill="#2196F3" />
      <circle cx="50" cy="2" r="1.5" fill="#90CAF9" />
      <circle cx="70" cy="2" r="3" fill="#2196F3" />
      <circle cx="70" cy="2" r="1.5" fill="#90CAF9" />

      {/* ── Left Arm ──────────────────────────── */}
      <path d={m.leftArm} stroke="#546E7A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={m.leftArm} stroke="#78909C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* ── Right Arm ─────────────────────────── */}
      <path d={m.rightArm} stroke="#546E7A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={m.rightArm} stroke="#78909C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* ── Body ──────────────────────────────── */}
      <rect x="18" y="85" width="84" height="72" rx="10" fill="url(#bodyGrad)" />
      {/* Body shine */}
      <rect x="22" y="89" width="76" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Shoulder pads */}
      <rect x="10" y="85" width="16" height="20" rx="4" fill="#455A64" />
      <rect x="94" y="85" width="16" height="20" rx="4" fill="#455A64" />

      {/* ── Chest Panel ───────────────────────── */}
      <rect x="30" y="100" width="60" height="40" rx="6" fill="#263238" />
      {/* Mini portfolio bar chart */}
      <rect x="35" y="125" width="7" height="8"  fill="#4CAF50" rx="1" />
      <rect x="45" y="119" width="7" height="14" fill="#2196F3" rx="1" />
      <rect x="55" y="122" width="7" height="11" fill="#FFC107" rx="1" />
      <rect x="65" y="116" width="7" height="17" fill="#4CAF50" rx="1" />
      {/* Chart baseline */}
      <line x1="33" y1="134" x2="75" y2="134" stroke="#455A64" strokeWidth="1" />
      {/* Chest buttons */}
      <circle cx="38" cy="108" r="4" fill="#FDD835" />
      <circle cx="38" cy="108" r="2" fill="#F9A825" />
      <circle cx="50" cy="108" r="4" fill="#F44336" />
      <circle cx="50" cy="108" r="2" fill="#C62828" />
      <circle cx="62" cy="108" r="4" fill="#00BCD4" />
      <circle cx="62" cy="108" r="2" fill="#006064" />

      {/* ── Head ──────────────────────────────── */}
      <rect x="20" y="20" width="80" height="66" rx="10" fill="url(#headGrad)" />
      {/* Head shine */}
      <rect x="24" y="24" width="72" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />

      {/* ── Visor / Face Plate ────────────────── */}
      <rect x="24" y="28" width="72" height="50" rx="6" fill="url(#visorGrad)" />
      {/* Visor inner glow */}
      <rect x="26" y="30" width="68" height="46" rx="5" fill="none" stroke="rgba(33,150,243,0.3)" strokeWidth="1" />

      {/* ── Eyebrows ──────────────────────────── */}
      <line
        x1={m.leftBrow.x1} y1={m.leftBrow.y1}
        x2={m.leftBrow.x2} y2={m.leftBrow.y2}
        stroke={m.eyeColor} strokeWidth="2.5" strokeLinecap="round"
      />
      <line
        x1={m.rightBrow.x1} y1={m.rightBrow.y1}
        x2={m.rightBrow.x2} y2={m.rightBrow.y2}
        stroke={m.eyeColor} strokeWidth="2.5" strokeLinecap="round"
      />

      {/* ── Eyes (LED rectangles) ─────────────── */}
      {/* Left eye */}
      <rect x="29" y="36" width="20" height="12" rx="2" fill="#0D1B2A" />
      <rect x="30" y="37" width="18" height="10" rx="1.5" fill={`url(#eyeGlow_${mood})`} opacity="0.9" />
      <rect x="32" y="38" width="6" height="3" rx="1" fill="rgba(255,255,255,0.6)" />

      {/* Right eye */}
      <rect x="71" y="36" width="20" height="12" rx="2" fill="#0D1B2A" />
      <rect x="72" y="37" width="18" height="10" rx="1.5" fill={`url(#eyeGlow_${mood})`} opacity="0.9" />
      <rect x="74" y="38" width="6" height="3" rx="1" fill="rgba(255,255,255,0.6)" />

      {/* ── Cheeks ────────────────────────────── */}
      <circle cx="33" cy="58" r="6" fill="#EF9A9A" opacity="0.5" />
      <circle cx="87" cy="58" r="6" fill="#EF9A9A" opacity="0.5" />

      {/* ── Mouth ─────────────────────────────── */}
      <path
        d={m.mouth}
        stroke={m.eyeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill={m.mouthFill}
      />

      {/* ── Thought Bubbles (thinking mode) ───── */}
      {m.bubbles.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="rgba(255,255,255,0.85)" stroke="#90CAF9" strokeWidth="1" />
      ))}
    </svg>
  )
}
