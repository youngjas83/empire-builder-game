import React from 'react'
import { TERMS } from '../data/terms.js'

const TERM_COLORS = {
  pe_ratio:         { bg: '#FFFBEB', border: '#FCD34D', accent: '#92400E' },
  recession:        { bg: '#FEF2F2', border: '#FCA5A5', accent: '#991B1B' },
  expansion:        { bg: '#F0FDF4', border: '#86EFAC', accent: '#14532D' },
  stable:           { bg: '#EFF6FF', border: '#93C5FD', accent: '#1E40AF' },
  volatility:       { bg: '#FFF7ED', border: '#FDBA74', accent: '#9A3412' },
  earnings:         { bg: '#F0FDF4', border: '#86EFAC', accent: '#14532D' },
  defensive:        { bg: '#F0FDF4', border: '#86EFAC', accent: '#14532D' },
  cyclical:         { bg: '#FEF2F2', border: '#FCA5A5', accent: '#991B1B' },
  growth:           { bg: '#EFF6FF', border: '#93C5FD', accent: '#1E40AF' },
  declining:        { bg: '#F8FAFC', border: '#CBD5E1', accent: '#475569' },
  speculative:      { bg: '#FDF4FF', border: '#E9D5FF', accent: '#6B21A8' },
  leading_indicator:{ bg: '#FFFBEB', border: '#FCD34D', accent: '#92400E' },
  sector_expansion: { bg: '#F0FDF4', border: '#86EFAC', accent: '#14532D' },
  sector_downturn:  { bg: '#FEF2F2', border: '#FCA5A5', accent: '#991B1B' },
}

export default function TermModal({ termId, onClose }) {
  const info = TERMS[termId]
  if (!info) return null

  const colors = TERM_COLORS[termId] || { bg: '#F8FAFC', border: '#E2E8F0', accent: '#374151' }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 250,
        background: 'rgba(0,0,10,0.60)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)',
          animation: 'termSlideUp 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <style>{`@keyframes termSlideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '10px auto 20px' }} />

        {/* Term hero */}
        <div style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: 16, padding: '14px 16px',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Financial Term
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1E293B', marginBottom: 4 }}>
            {info.term}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.accent }}>
            {info.plain}
          </div>
        </div>

        {/* Definition */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            What it means
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', lineHeight: 1.6, margin: 0 }}>
            {info.definition}
          </p>
        </div>

        {/* Example */}
        <div style={{
          background: colors.bg,
          border: `1.5px solid ${colors.border}`,
          borderRadius: 12, padding: '12px 14px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
            📌 In this game
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', lineHeight: 1.55, margin: 0 }}>
            {info.example}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(29,78,216,0.3)',
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  )
}
