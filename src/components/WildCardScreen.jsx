import React from 'react'
import Chip from './Chip.jsx'
import { formatMoney } from '../game/engine.js'

function getEffectPillText(wildCard) {
  if (wildCard.type !== 'setback') {
    return `+${Math.round(wildCard.effect * 100)}% bonus earnings this turn! 🚀`
  }
  switch (wildCard.effectType) {
    case 'valuationDrop':
      return 'P/E Ratio drops 15% — permanent devaluation! 📉'
    case 'emergencyFine':
      return `Emergency fine: ${formatMoney(wildCard.fineAmount || 0)} paid immediately`
    default:
      return `Earnings down ${Math.round(Math.abs(wildCard.effect) * 100)}% this turn`
  }
}

// Deterministic confetti pieces — same layout every render, no random jitter
const CONFETTI_PIECES = [
  { left: 8,  delay: 0.0, dur: 2.6, color: '#FCD34D', shape: 'circle', size: 10 },
  { left: 18, delay: 0.3, dur: 3.0, color: '#86EFAC', shape: 'rect',   size: 8  },
  { left: 28, delay: 0.1, dur: 2.4, color: '#93C5FD', shape: 'circle', size: 7  },
  { left: 38, delay: 0.5, dur: 2.8, color: '#F9A8D4', shape: 'rect',   size: 9  },
  { left: 50, delay: 0.2, dur: 3.1, color: '#FCD34D', shape: 'circle', size: 11 },
  { left: 60, delay: 0.4, dur: 2.5, color: '#C4B5FD', shape: 'rect',   size: 8  },
  { left: 70, delay: 0.1, dur: 2.9, color: '#86EFAC', shape: 'circle', size: 9  },
  { left: 80, delay: 0.6, dur: 2.7, color: '#FCA5A5', shape: 'rect',   size: 7  },
  { left: 90, delay: 0.3, dur: 3.2, color: '#FCD34D', shape: 'circle', size: 10 },
  { left: 12, delay: 0.7, dur: 2.3, color: '#93C5FD', shape: 'rect',   size: 9  },
  { left: 44, delay: 0.8, dur: 3.0, color: '#F9A8D4', shape: 'circle', size: 7  },
  { left: 65, delay: 0.2, dur: 2.6, color: '#C4B5FD', shape: 'rect',   size: 11 },
]

export default function WildCardScreen({ wildCard, onContinue, onOpportunityAccept, onOpportunityDecline, cash }) {
  if (!wildCard) return null

  // ── Opportunity choice screen ─────────────────────────────────────────────
  if (wildCard.type === 'opportunity') {
    const subtypeLabels = {
      ma_offer:       '🤝 ACQUISITION OFFER',
      product_launch: '🚀 PRODUCT LAUNCH',
      partnership:    '🌟 PARTNERSHIP DEAL',
    }
    const headerText = subtypeLabels[wildCard.subtype] || '💡 OPPORTUNITY'

    const canAfford = wildCard.subtype !== 'product_launch' || (cash || 0) >= (wildCard.launchCost || 0)

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'linear-gradient(160deg, #080D1A 0%, #0C1A3A 50%, #1A0C3A 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        animation: 'wildCardIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes wildCardIn {
            from { transform: scale(0.8); opacity: 0 }
            to   { transform: scale(1);   opacity: 1 }
          }
          @keyframes oppGlow {
            0%, 100% { box-shadow: 0 0 30px rgba(252,211,77,0.2) }
            50%       { box-shadow: 0 0 60px rgba(252,211,77,0.45) }
          }
        `}</style>

        {/* Gold glow ring */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 0 80px rgba(252,211,77,0.08)',
          pointerEvents: 'none',
        }} />

        {/* Header badge */}
        <div style={{
          background: 'linear-gradient(135deg, #92400E, #FCD34D)',
          color: '#1C0A0A',
          padding: '9px 28px', borderRadius: 50,
          fontSize: 18, fontWeight: 900,
          marginBottom: 24,
          boxShadow: '0 4px 24px rgba(252,211,77,0.4)',
          letterSpacing: '0.02em',
        }}>
          {headerText}
        </div>

        {/* Company */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            fontSize: 64,
            filter: 'drop-shadow(0 0 20px rgba(252,211,77,0.6))',
            marginBottom: 6,
            animation: 'oppGlow 2.2s ease-in-out infinite',
          }}>
            {wildCard.companyEmoji}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>
            {wildCard.companyName}
          </div>
        </div>

        {/* Opportunity text */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 18,
          padding: '14px 20px',
          marginBottom: 24,
          maxWidth: 340, width: '100%',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.5, margin: 0 }}>
            {wildCard.text}
          </p>
        </div>

        {/* Choice buttons */}
        <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={canAfford ? onOpportunityAccept : undefined}
            style={{
              padding: '15px 20px',
              background: canAfford
                ? 'linear-gradient(135deg, #92400E, #D97706)'
                : 'rgba(255,255,255,0.08)',
              color: canAfford ? '#fff' : 'rgba(255,255,255,0.3)',
              border: canAfford ? 'none' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              boxShadow: canAfford ? '0 6px 24px rgba(217,119,6,0.45)' : 'none',
              textAlign: 'center',
            }}
          >
            {wildCard.acceptLabel}
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, marginTop: 3 }}>
              {canAfford ? wildCard.acceptDetail : "Can't afford right now"}
            </div>
          </button>

          <button
            onClick={onOpportunityDecline}
            style={{
              padding: '13px 20px',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              fontSize: 15, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            {wildCard.declineLabel}
          </button>
        </div>
      </div>
    )
  }

  // ── Standard wildCard / setback screen ────────────────────────────────────
  const isSetback = wildCard.type === 'setback'
  const mood = isSetback ? 'worried' : 'excited'

  const headerText = isSetback ? '💥 SETBACK!' : '🃏 WILD CARD!'

  const theme = isSetback ? {
    bg: 'linear-gradient(160deg, #1C0A0A 0%, #450A0A 100%)',
    glow: '#EF4444',
    badgeBg: '#DC2626',
    badgeText: '#FFF',
    accentColor: '#FCA5A5',
    effectBg: '#7F1D1D',
    effectText: '#FCA5A5',
    btnBg: 'linear-gradient(135deg, #DC2626, #EF4444)',
  } : {
    bg: 'linear-gradient(160deg, #0C1A08 0%, #14532D 100%)',
    glow: '#22C55E',
    badgeBg: '#FCD34D',
    badgeText: '#1C0A0A',
    accentColor: '#FCD34D',
    effectBg: '#14532D',
    effectText: '#86EFAC',
    btnBg: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: theme.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
      animation: 'wildCardIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes wildCardIn {
          from { transform: scale(0.8); opacity: 0 }
          to   { transform: scale(1);   opacity: 1 }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 30px ${theme.glow}40 }
          50%       { box-shadow: 0 0 60px ${theme.glow}80 }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1 }
          80%  { opacity: 1 }
          100% { transform: translateY(105vh) rotate(540deg); opacity: 0 }
        }
      `}</style>

      {/* Confetti (wins only) */}
      {!isSetback && CONFETTI_PIECES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: -16, left: `${p.left}%`,
          width: p.size, height: p.size,
          borderRadius: p.shape === 'circle' ? '50%' : 2,
          background: p.color,
          animation: `confettiFall ${p.dur}s ${p.delay}s ease-in infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* Glow ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 0,
        boxShadow: `inset 0 0 80px ${theme.glow}20`,
        pointerEvents: 'none',
      }} />

      {/* Header badge */}
      <div style={{
        background: theme.badgeBg, color: theme.badgeText,
        padding: '9px 28px', borderRadius: 50,
        fontSize: 22, fontWeight: 900,
        marginBottom: 28,
        boxShadow: `0 4px 24px ${theme.badgeBg}80`,
        letterSpacing: '0.02em',
      }}>
        {headerText}
      </div>

      {/* Chip */}
      <div style={{
        marginBottom: 20,
        filter: `drop-shadow(0 0 20px ${theme.glow}60)`,
        animation: 'glowPulse 2s ease-in-out infinite',
      }}>
        <Chip mood={mood} size={130} />
      </div>

      {/* Company */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          fontSize: 56,
          filter: `drop-shadow(0 0 16px ${theme.glow}80)`,
          marginBottom: 6,
        }}>
          {wildCard.companyEmoji}
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
          {wildCard.companyName}
        </div>
      </div>

      {/* Event text */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        border: `1px solid rgba(255,255,255,0.15)`,
        borderRadius: 18,
        padding: '16px 22px',
        marginBottom: 14,
        maxWidth: 340, width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.45 }}>
          {wildCard.text}
        </p>
      </div>

      {/* Effect pill */}
      <div style={{
        background: theme.effectBg,
        borderRadius: 10, padding: '10px 20px',
        marginBottom: 36,
        fontSize: 15, fontWeight: 800,
        color: theme.effectText,
        border: `1px solid ${theme.accentColor}40`,
      }}>
        {getEffectPillText(wildCard)}
      </div>

      <button
        onClick={onContinue}
        style={{
          padding: '15px 52px',
          background: theme.btnBg,
          color: '#fff',
          border: 'none', borderRadius: 16,
          fontSize: 17, fontWeight: 900,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        }}
      >
        Continue →
      </button>
    </div>
  )
}
