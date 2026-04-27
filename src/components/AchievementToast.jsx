import React, { useEffect } from 'react'

export default function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [])

  if (!achievement) return null

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 60px)',
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 450,
        background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
        color: '#fff',
        padding: '10px 20px 10px 16px',
        borderRadius: 50,
        fontSize: 15, fontWeight: 900,
        boxShadow: '0 6px 28px rgba(29,78,216,0.55)',
        animation: 'achieveIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        maxWidth: '90vw',
      }}
    >
      <style>{`
        @keyframes achieveIn {
          from { transform: translateX(-50%) translateY(-20px) scale(0.8); opacity: 0 }
          to   { transform: translateX(-50%) translateY(0)     scale(1);   opacity: 1 }
        }
      `}</style>
      <span>Achievement!</span>
      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>
        {achievement.label}
      </span>
    </div>
  )
}
