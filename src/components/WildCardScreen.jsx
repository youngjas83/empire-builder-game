import React from 'react'
import Chip from './Chip.jsx'
import { formatMoney } from '../game/engine.js'

export default function WildCardScreen({ wildCard, onContinue }) {
  if (!wildCard) return null

  const isSetback = wildCard.type === 'setback'
  const mood = isSetback ? 'worried' : 'excited'

  // Calculate actual dollar amounts
  const bonusPct = Math.abs(wildCard.effect)
  // We don't have the exact profit here, but we can show the effect percentage clearly
  // The actual amount was already applied — show a celebration/commiseration message

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
      `}</style>

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
        {isSetback
          ? `Earnings down ${Math.round(Math.abs(wildCard.effect) * 100)}% this turn`
          : `+${Math.round(wildCard.effect * 100)}% bonus earnings this turn! 🚀`}
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
