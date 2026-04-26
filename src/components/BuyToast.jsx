import React, { useEffect } from 'react'
import { COMPANIES } from '../data/companies.js'

export default function BuyToast({ companyId, onDone }) {
  const co = COMPANIES.find(c => c.id === companyId)

  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [companyId])

  if (!co) return null

  return (
    <div style={{
      position: 'fixed',
      top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
      left: '50%', transform: 'translateX(-50%)',
      zIndex: 400,
      width: 'calc(100% - 32px)', maxWidth: 380,
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #14532D, #166534)',
        borderRadius: 18,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        animation: 'buyToastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        {/* Company badge */}
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${co.gradientFrom}, ${co.gradientTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {co.emoji}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: '#86EFAC',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            ✓ Added to Your Empire
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginTop: 1 }}>
            {co.name} is yours!
          </div>
        </div>

        <div style={{ fontSize: 24 }}>🎉</div>
      </div>
      <style>{`
        @keyframes buyToastIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
