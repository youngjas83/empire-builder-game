import React from 'react'
import Chip from './Chip.jsx'
import { formatMoney } from '../game/engine.js'

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('empireBuilderLeaderboard')) || { billion: [], netWorth: [] }
  } catch (e) { return { billion: [], netWorth: [] } }
}

export default function BillionScreen({ state, onKeepPlaying, onNewGame }) {
  const { empireName, billionTurn, netWorthHistory } = state
  const netWorth = netWorthHistory[netWorthHistory.length - 1] || 0
  const lb = getLeaderboard()
  const myRank = lb.billion.findIndex(e => e.name === empireName && e.turns === billionTurn)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 600,
      background: 'linear-gradient(160deg, #1D4ED8 0%, #7C3AED 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      padding: 'calc(env(safe-area-inset-top, 0px) + 32px) 24px calc(env(safe-area-inset-bottom, 0px) + 40px)',
      animation: 'billionIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }}>
      <style>{`
        @keyframes billionIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
        @keyframes starSpin { from { transform: rotate(0deg) scale(1) } 50% { transform: rotate(180deg) scale(1.2) } to { transform: rotate(360deg) scale(1) } }
      `}</style>

      {/* Star burst */}
      <div style={{ fontSize: 44, marginBottom: 6, animation: 'starSpin 3s ease-in-out infinite' }}>⭐</div>
      <div style={{ fontSize: 40, marginBottom: 8 }}>🎉🏆🎊</div>

      <div style={{
        fontSize: 38, fontWeight: 900, color: '#FCD34D',
        textShadow: '0 2px 20px rgba(252,211,77,0.5)',
        marginBottom: 4, textAlign: 'center', letterSpacing: '-1px',
      }}>
        BILLIONAIRE!
      </div>
      <div style={{
        fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
        marginBottom: 20, textAlign: 'center', lineHeight: 1.4,
      }}>
        {empireName} reached $1 Billion{billionTurn ? ` in ${billionTurn} turns` : ''}!
      </div>

      <Chip mood="excited" size={100} />

      {/* Net Worth card */}
      <div style={{
        background: 'rgba(255,255,255,0.15)', borderRadius: 20,
        padding: '16px 28px', textAlign: 'center',
        marginTop: 16, marginBottom: 16,
        backdropFilter: 'blur(10px)',
        width: '100%', maxWidth: 320,
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Net Worth
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, color: '#FCD34D', marginTop: 2 }}>
          {formatMoney(netWorth)}
        </div>
        {myRank === 0 && (
          <div style={{ fontSize: 13, fontWeight: 900, color: '#86EFAC', marginTop: 6 }}>
            🥇 New Record — Fastest Ever!
          </div>
        )}
      </div>

      {/* Leaderboard — fastest to $1B */}
      {lb.billion.length > 0 && (
        <div style={{ width: '100%', maxWidth: 320, marginBottom: 20 }}>
          <div style={{
            fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 8, textAlign: 'center',
          }}>
            🏆 Fastest to $1 Billion
          </div>
          {lb.billion.slice(0, 5).map((entry, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: i === myRank ? 'rgba(252,211,77,0.2)' : 'rgba(255,255,255,0.1)',
              border: i === myRank ? '1.5px solid rgba(252,211,77,0.5)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '8px 12px', marginBottom: 4,
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#FCD34D' : '#fff' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {entry.name}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
                {entry.turns} turns
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Chip quote */}
      <div style={{
        background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 16px',
        width: '100%', maxWidth: 320, textAlign: 'center', marginBottom: 20,
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, margin: 0 }}>
          "You did it! But billionaires don't stop — they keep building. How high can you go?"
        </p>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 600 }}>
          — Chip 🤖
        </div>
      </div>

      {/* Keep Playing */}
      <button
        onClick={onKeepPlaying}
        style={{
          width: '100%', maxWidth: 320, padding: '16px',
          background: 'linear-gradient(135deg, #16A34A, #22C55E)',
          color: '#fff', border: 'none', borderRadius: 14,
          fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
          cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(34,197,94,0.5)',
          marginBottom: 10,
        }}
      >
        Keep Playing 🚀
      </button>

      {/* New Game */}
      <button
        onClick={onNewGame}
        style={{
          width: '100%', maxWidth: 320, padding: '14px',
          background: 'rgba(255,255,255,0.14)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 14, fontSize: 16, fontWeight: 800,
          fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        New Game 🔄
      </button>
    </div>
  )
}
