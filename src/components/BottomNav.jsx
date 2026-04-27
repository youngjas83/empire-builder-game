import React from 'react'

const TABS = [
  { id: 'empire',  emoji: '🏙️', label: 'Empire'  },
  { id: 'news',    emoji: '📰', label: 'News'    },
  { id: 'market',  emoji: '📊', label: 'Stats'   },
  { id: 'chip',    emoji: '🤖', label: 'Help'    },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(255,255,255,0.95)',
      borderTop: '1px solid rgba(0,0,0,0.08)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 200,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '10px 0 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              fontFamily: 'inherit',
              position: 'relative',
            }}
          >
            {/* Active indicator dot above tab */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 28, height: 3,
                background: 'linear-gradient(90deg, #1D4ED8, #7C3AED)',
                borderRadius: '0 0 3px 3px',
              }} />
            )}

            {/* Emoji in a tinted bubble when active */}
            <div style={{
              width: 36, height: 30,
              background: isActive ? 'linear-gradient(135deg, #EFF6FF, #E0E7FF)' : 'transparent',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.emoji}</span>
            </div>

            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 900 : 600,
              color: isActive ? '#1D4ED8' : '#94A3B8',
              transition: 'color 0.15s',
              letterSpacing: '0.01em',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
