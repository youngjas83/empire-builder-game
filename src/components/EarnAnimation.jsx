import React, { useEffect } from 'react'
import { formatMoney } from '../game/engine.js'

export default function EarnAnimation({ amount, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [])

  if (!amount || amount <= 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
      left: '50%', transform: 'translateX(-50%)',
      zIndex: 350,
      pointerEvents: 'none',
    }}>
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        color: '#22C55E',
        textShadow: '0 2px 16px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.3)',
        whiteSpace: 'nowrap',
        animation: 'earnFloat 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        fontFamily: 'Nunito, sans-serif',
      }}>
        +{formatMoney(amount)}
      </div>
      <style>{`
        @keyframes earnFloat {
          0%   { opacity: 0; transform: translateY(0px) scale(0.7); }
          15%  { opacity: 1; transform: translateY(-10px) scale(1.15); }
          40%  { opacity: 1; transform: translateY(-28px) scale(1); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.9); }
        }
      `}</style>
    </div>
  )
}
