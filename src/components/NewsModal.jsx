import React from 'react'
import Chip from './Chip.jsx'

export default function NewsModal({ turn, currentNews, economy, onClose }) {
  if (!currentNews) return null

  const { headlines, chipTake } = currentNews

  const tierConfig = {
    economy: { label: '🌍 Economy', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    sector:  { label: '🏭 Sector',  color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD' },
    gossip:  { label: '📣 Gossip',  color: '#EA580C', bg: '#FFF7ED', border: '#FDBA74' },
  }

  const chipMood = economy.state === 'booming' ? 'excited'
    : economy.state === 'slowdown' ? 'worried'
    : 'happy'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(0,0,16,0.65)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>

        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '12px auto 0', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          margin: '12px 12px 0',
          borderRadius: 18,
          padding: '14px 16px',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
              📰 Empire Gazette
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              Turn {turn} · Breaking Headlines
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: 'none',
              fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable headlines */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}>
          {headlines.map((item, i) => {
            const cfg = tierConfig[item.tier] || { label: item.tier, color: '#6B7280', bg: '#F8FAFC', border: '#E2E8F0' }
            return (
              <div
                key={i}
                style={{
                  background: cfg.bg,
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 8,
                }}
              >
                <div style={{
                  display: 'inline-block',
                  fontSize: 10, fontWeight: 900,
                  color: cfg.color,
                  background: cfg.color + '15',
                  border: `1px solid ${cfg.color}30`,
                  borderRadius: 6,
                  padding: '2px 8px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: 6,
                }}>
                  {cfg.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.45 }}>
                  {item.text}
                </div>
              </div>
            )
          })}

          {/* Chip's Take */}
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF, #E0E7FF)',
            border: '1.5px solid #BFDBFE',
            borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            marginBottom: 4,
          }}>
            <div style={{ flexShrink: 0, marginTop: -4 }}>
              <Chip mood={chipMood} size={54} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#1D4ED8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>
                🤖 Chip's Take
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.55, margin: 0 }}>
                {chipTake}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '10px 12px 14px', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
              color: '#fff',
              border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(29,78,216,0.35)',
              letterSpacing: '0.01em',
            }}
          >
            Start Turn {turn} →
          </button>
        </div>
      </div>
    </div>
  )
}
