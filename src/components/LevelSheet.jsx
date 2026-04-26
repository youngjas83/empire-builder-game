import React from 'react'
import { LEVELS } from '../data/companies.js'
import { formatMoney } from '../game/engine.js'

export default function LevelSheet({ currentLevel, netWorth, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 40px',
          maxHeight: '75vh',
          overflowY: 'auto',
          animation: 'slideUp 0.25s ease',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 40, height: 4, background: '#E5E7EB', borderRadius: 2, margin: '0 auto 18px' }} />
        <div style={{ fontSize: 18, fontWeight: 900, color: '#1E293B', marginBottom: 18 }}>
          🏆 Your Journey
        </div>

        {LEVELS.map(lvl => {
          const isCompleted = currentLevel > lvl.level
          const isCurrent = currentLevel === lvl.level
          const isLocked = currentLevel < lvl.level

          let bgColor = '#F8FAFC'
          let borderColor = '#E2E8F0'
          if (isCurrent) { bgColor = '#EFF6FF'; borderColor = '#1D4ED8' }
          if (isCompleted) { bgColor = '#F0FDF4'; borderColor = '#22C55E' }

          const progress = isCurrent && lvl.level < 5
            ? Math.min(1, (netWorth - lvl.requirement) / ((LEVELS[lvl.level] ? LEVELS[lvl.level].requirement : lvl.requirement) - lvl.requirement))
            : 0

          return (
            <div
              key={lvl.level}
              style={{
                background: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 10,
                opacity: isLocked ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isCompleted ? '#22C55E' : isCurrent ? '#1D4ED8' : '#E2E8F0',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800,
                  }}>
                    {isCompleted ? '✓' : lvl.level}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>
                      {lvl.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                      {lvl.requirement === 0 ? 'Starting level' : `Reach ${formatMoney(lvl.requirement)}`}
                    </div>
                  </div>
                </div>
                {isCurrent && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#1D4ED8',
                    background: '#DBEAFE', padding: '3px 8px', borderRadius: 6,
                  }}>
                    CURRENT
                  </span>
                )}
              </div>

              {isCurrent && lvl.level < 5 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{
                    height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.round(progress * 100)}%`,
                      background: '#1D4ED8',
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: 600 }}>
                    {formatMoney(netWorth)} / {formatMoney(LEVELS[lvl.level] ? LEVELS[lvl.level].requirement : 1000000000)}
                  </div>
                </div>
              )}

              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6, fontWeight: 600 }}>
                🔓 {lvl.unlocks}
              </div>
            </div>
          )
        })}

        <button
          onClick={onClose}
          style={{
            marginTop: 8, width: '100%', padding: '13px',
            background: '#1D4ED8', color: '#fff',
            border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
