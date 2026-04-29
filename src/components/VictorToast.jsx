import React, { useEffect } from 'react'

const VICTOR_LINES = [
  "He moves fast. You snooze, you lose.",
  "Victor never hesitates. Neither should you.",
  "The early bird gets the flash sale.",
  "He had his eye on it too.",
]

export default function VictorToast({ victorSnatched, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4500)
    return () => clearTimeout(t)
  }, [])

  if (!victorSnatched) return null

  const line = VICTOR_LINES[Math.floor(Math.random() * VICTOR_LINES.length)]

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 420,
        background: 'linear-gradient(135deg, #1C1917 0%, #3B0A0A 100%)',
        border: '1.5px solid #DC2626',
        borderRadius: 18,
        padding: '14px 18px',
        maxWidth: 320,
        width: 'calc(100% - 48px)',
        boxShadow: '0 8px 32px rgba(220,38,38,0.35)',
        animation: 'victorIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <style>{`
        @keyframes victorIn {
          from { transform: translateX(-50%) translateY(24px) scale(0.88); opacity: 0 }
          to   { transform: translateX(-50%) translateY(0)    scale(1);    opacity: 1 }
        }
      `}</style>

      <div style={{ fontSize: 34, flexShrink: 0, lineHeight: 1 }}>😤</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 900,
          color: '#FCA5A5',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}>
          Rival Investor
        </div>
        <div style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.3,
          marginBottom: 4,
        }}>
          Victor snatched the {victorSnatched.companyEmoji} {victorSnatched.companyName} flash sale!
        </div>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#94A3B8',
          lineHeight: 1.35,
          fontStyle: 'italic',
        }}>
          "{line}"
        </div>
      </div>
    </div>
  )
}
