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
      background: 'rgba(8,13,26,0.96)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 200,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '8px 0 6px',
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
            {/* Active glow line at top */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 32, height: 2,
                background: 'linear-gradient(90deg, #6366F1, #A78BFA)',
                borderRadius: '0 0 3px 3px',
                boxShadow: '0 0 10px rgba(99,102,241,0.7)',
              }} />
            )}

            {/* Icon bubble */}
            <div style={{
              width: 40, height: 28,
              background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
              boxShadow: isActive ? '0 0 14px rgba(99,102,241,0.25)' : 'none',
            }}>
              <span style={{ fontSize: 19, lineHeight: 1 }}>{tab.emoji}</span>
            </div>

            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#818CF8' : 'rgba(255,255,255,0.28)',
              transition: 'color 0.15s',
              letterSpacing: '0.02em',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
