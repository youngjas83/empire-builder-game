import React from 'react'
import Chip from './Chip.jsx'
import { formatMoney, formatMoneyPrecise } from '../game/engine.js'

export default function WinScreen({ state, onPlayAgain }) {
  const { empireName, turn, netWorthHistory, portfolio, cash } = state
  const netWorth = netWorthHistory[netWorthHistory.length - 1] || 0
  const companiesOwned = Object.keys(portfolio).length

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'linear-gradient(160deg, #1D4ED8 0%, #7C3AED 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      padding: '40px 24px 40px',
      animation: 'winIn 0.5s ease',
    }}>
      <style>{`
        @keyframes winIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>

      {/* Confetti emoji */}
      <div style={{ fontSize: 40, marginBottom: 8 }}>🎉🏆🎊</div>

      {/* Title */}
      <div style={{
        fontSize: 34, fontWeight: 900, color: '#FCD34D',
        textShadow: '0 2px 12px rgba(0,0,0,0.4)',
        marginBottom: 4, textAlign: 'center',
      }}>
        BILLIONAIRE!
      </div>
      <div style={{
        fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
        marginBottom: 24, textAlign: 'center',
      }}>
        {empireName} Empire conquered Wall Street
      </div>

      {/* Chip excited */}
      <Chip mood="excited" size={110} />

      {/* Net Worth */}
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        borderRadius: 20, padding: '20px 32px',
        textAlign: 'center', marginTop: 20, marginBottom: 20,
        backdropFilter: 'blur(10px)',
        width: '100%', maxWidth: 320,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Final Net Worth
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: '#FCD34D', marginTop: 4 }}>
          {formatMoney(netWorth)}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 12, width: '100%', maxWidth: 320, marginBottom: 28,
      }}>
        {[
          { label: 'Turns Taken', value: turn - 1 },
          { label: 'Companies Owned', value: companiesOwned },
          { label: 'Cash on Hand', value: formatMoney(cash) },
          { label: 'Started With', value: '$10M' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 14, padding: '14px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 14, padding: '16px',
        width: '100%', maxWidth: 320,
        textAlign: 'center', marginBottom: 28,
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
          "You grew ${10}M into {formatMoney(netWorth)} in just {turn - 1} turns. Real investors would be jealous!"
        </p>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: 600 }}>
          — Chip 🤖
        </div>
      </div>

      <button
        onClick={onPlayAgain}
        style={{
          width: '100%', maxWidth: 320,
          padding: '16px',
          background: '#FCD34D', color: '#1E293B',
          border: 'none', borderRadius: 14,
          fontSize: 18, fontWeight: 900,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        Play Again 🔄
      </button>
    </div>
  )
}
