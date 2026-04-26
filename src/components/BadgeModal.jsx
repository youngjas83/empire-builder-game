import React from 'react'
import Chip from './Chip.jsx'
import { BADGE_EXPLANATIONS } from '../data/companies.js'

// Badge category colors for visual identity
const BADGE_COLORS = {
  lowRisk:         { bg: '#F0FDF4', border: '#86EFAC', emoji: '🟢' },
  modRisk:         { bg: '#FEFCE8', border: '#FDE68A', emoji: '🟡' },
  highRisk:        { bg: '#FEF2F2', border: '#FCA5A5', emoji: '🔴' },
  wildRisk:        { bg: '#FEF2F2', border: '#FCA5A5', emoji: '🔴' },
  slowGrowth:      { bg: '#F8FAFC', border: '#CBD5E1', emoji: '⚪' },
  steadyGrowth:    { bg: '#EFF6FF', border: '#BFDBFE', emoji: '🔵' },
  fastGrowth:      { bg: '#F0FDF4', border: '#86EFAC', emoji: '🟢' },
  inDecline:       { bg: '#FEF2F2', border: '#FCA5A5', emoji: '🔴' },
  cashCow:         { bg: '#FEFCE8', border: '#FDE68A', emoji: '💛' },
  counterCyclical: { bg: '#F0FDFA', border: '#6EE7B7', emoji: '🟢' },
  fadAlert:        { bg: '#FFF7ED', border: '#FDBA74', emoji: '🟠' },
  ecommBoom:       { bg: '#EFF6FF', border: '#BFDBFE', emoji: '🔵' },
  stickyRevenue:   { bg: '#F5F3FF', border: '#C4B5FD', emoji: '🟣' },
}

export default function BadgeModal({ badgeId, onClose }) {
  const info = BADGE_EXPLANATIONS[badgeId]
  if (!info) return null

  const colors = BADGE_COLORS[badgeId] || { bg: '#F8FAFC', border: '#E2E8F0', emoji: '⚪' }
  const isDanger = badgeId === 'inDecline' || badgeId === 'wildRisk' || badgeId === 'highRisk'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,10,0.65)',
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
          padding: '8px 20px 40px',
          animation: 'slideUp 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '10px auto 20px' }} />

        {/* Badge hero pill */}
        <div style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: 16, padding: '12px 16px',
          marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {isDanger && (
            <div style={{
              background: '#EF4444', color: '#fff',
              fontSize: 10, fontWeight: 900,
              padding: '2px 8px', borderRadius: 6,
              letterSpacing: '0.08em',
            }}>
              WARNING
            </div>
          )}
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1E293B' }}>
            {info.title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flexShrink: 0, marginTop: -4 }}>
            <Chip mood={info.mood} size={76} />
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#374151', fontWeight: 500, flex: 1 }}>
            {info.text}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 22, width: '100%', padding: '14px',
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
