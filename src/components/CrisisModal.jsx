import React from 'react'
import Chip from './Chip.jsx'
import { formatMoney } from '../game/engine.js'

export default function CrisisModal({ crisis, cash, onPay, onIgnore }) {
  if (!crisis) return null

  const canAfford = cash >= crisis.payAmount

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'linear-gradient(160deg, #1C0A0A 0%, #431407 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
      animation: 'crisisIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes crisisIn {
          from { transform: scale(0.85); opacity: 0 }
          to   { transform: scale(1);    opacity: 1 }
        }
        @keyframes crisisGlow {
          0%, 100% { box-shadow: inset 0 0 60px rgba(239,68,68,0.15) }
          50%       { box-shadow: inset 0 0 90px rgba(239,68,68,0.30) }
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'crisisGlow 2.5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Header badge */}
      <div style={{
        background: '#DC2626', color: '#fff',
        padding: '8px 28px', borderRadius: 50,
        fontSize: 20, fontWeight: 900,
        marginBottom: 22,
        boxShadow: '0 4px 24px rgba(220,38,38,0.6)',
        letterSpacing: '0.04em',
        position: 'relative',
      }}>
        ⚠️ CRISIS ALERT
      </div>

      {/* Chip — worried */}
      <div style={{
        marginBottom: 18,
        filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.5))',
        position: 'relative',
      }}>
        <Chip mood="worried" size={110} />
      </div>

      {/* Company */}
      <div style={{ textAlign: 'center', marginBottom: 14, position: 'relative' }}>
        <div style={{
          fontSize: 52,
          filter: 'drop-shadow(0 0 14px rgba(239,68,68,0.7))',
          marginBottom: 6,
        }}>
          {crisis.companyEmoji}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>
          {crisis.companyName}
        </div>
      </div>

      {/* Crisis description */}
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 18, padding: '16px 20px',
        marginBottom: 20, maxWidth: 360, width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        position: 'relative',
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.5, margin: 0 }}>
          {crisis.text}
        </p>
      </div>

      {/* Two choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 360, position: 'relative' }}>

        {/* Pay option */}
        <button
          onClick={canAfford ? onPay : undefined}
          style={{
            padding: '16px 20px',
            background: canAfford
              ? 'linear-gradient(135deg, #16A34A, #22C55E)'
              : 'rgba(255,255,255,0.08)',
            border: canAfford ? 'none' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: 16, color: '#fff',
            fontSize: 15, fontWeight: 900,
            fontFamily: 'inherit',
            cursor: canAfford ? 'pointer' : 'default',
            opacity: canAfford ? 1 : 0.5,
            boxShadow: canAfford ? '0 4px 18px rgba(34,197,94,0.45)' : 'none',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.8, marginBottom: 3 }}>
            ✅ Contain the crisis
          </div>
          <div>
            Pay {formatMoney(crisis.payAmount)} → company protected
          </div>
          {!canAfford && (
            <div style={{ fontSize: 12, marginTop: 4, color: '#FCA5A5' }}>
              Need {formatMoney(crisis.payAmount - cash)} more cash
            </div>
          )}
        </button>

        {/* Ignore option */}
        <button
          onClick={onIgnore}
          style={{
            padding: '16px 20px',
            background: 'rgba(220,38,38,0.25)',
            border: '1.5px solid rgba(239,68,68,0.5)',
            borderRadius: 16, color: '#FCA5A5',
            fontSize: 15, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.8, marginBottom: 3 }}>
            ❌ Ignore it
          </div>
          <div>
            Keep cash → {crisis.companyName} loses {Math.round(crisis.penaltyPct * 100)}% value
          </div>
        </button>
      </div>

    </div>
  )
}
