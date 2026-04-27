import React, { useEffect } from 'react'
import Chip from './Chip.jsx'
import { formatMoney } from '../game/engine.js'

export default function SmartTradeToast({ trade, onDone }) {
  // trade: { companyName, companyEmoji, proceeds, purchasePrice, totalInvested }
  useEffect(() => {
    const t = setTimeout(onDone, 4500)
    return () => clearTimeout(t)
  }, [])

  if (!trade) return null

  const roi = trade.totalInvested > 0
    ? Math.round((trade.proceeds / trade.totalInvested - 1) * 100)
    : 0
  const multiple = trade.totalInvested > 0
    ? (trade.proceeds / trade.totalInvested).toFixed(1)
    : '1.0'
  const profit = trade.proceeds - trade.totalInvested

  let mood, headline, detail, bg, border, color
  if (profit > 0 && roi >= 200) {
    mood = 'excited'
    headline = `🤑 INCREDIBLE trade!`
    detail = `You turned ${formatMoney(trade.totalInvested)} into ${formatMoney(trade.proceeds)} — that's ${multiple}× your money! That's pro-level investing.`
    bg = 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
    border = '#86EFAC'
    color = '#15803D'
  } else if (profit > 0 && roi >= 75) {
    mood = 'excited'
    headline = `🧠 Smart move!`
    detail = `You made ${formatMoney(profit)} profit on that sale — ${roi}% return. Solid investing!`
    bg = 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
    border = '#86EFAC'
    color = '#15803D'
  } else if (profit > 0) {
    mood = 'happy'
    headline = `👍 Nice sale!`
    detail = `You came out ahead — ${formatMoney(profit)} profit. Every win counts!`
    bg = 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
    border = '#93C5FD'
    color = '#1D4ED8'
  } else {
    mood = 'worried'
    headline = `📉 Tough break.`
    detail = `You lost ${formatMoney(Math.abs(profit))} on that one. Every great investor takes a loss sometimes — what matters is what you do next!`
    bg = 'linear-gradient(135deg, #FEF2F2, #FEE2E2)'
    border = '#FCA5A5'
    color = '#DC2626'
  }

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0, zIndex: 350,
        display: 'flex', alignItems: 'flex-end',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px 40px',
          animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 32px)',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '10px auto 18px' }} />

        {/* Company sold */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 36 }}>{trade.companyEmoji}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
            {trade.companyName} sold
          </div>
        </div>

        {/* Result card */}
        <div style={{
          background: bg,
          border: `2px solid ${border}`,
          borderRadius: 18, padding: '16px',
          marginBottom: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color, marginBottom: 4 }}>{headline}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color, marginBottom: 8 }}>
            {profit >= 0 ? '+' : ''}{formatMoney(profit)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color, opacity: 0.8 }}>
            {formatMoney(trade.totalInvested)} invested → {formatMoney(trade.proceeds)} received
          </div>
        </div>

        {/* Chip's take */}
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF, #E0E7FF)',
          border: '1.5px solid #BFDBFE',
          borderRadius: 16, padding: '14px 16px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{ flexShrink: 0, marginTop: -4 }}>
            <Chip mood={mood} size={48} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.55, margin: 0, flex: 1 }}>
            {detail}
          </p>
        </div>

        <button
          onClick={onDone}
          style={{
            marginTop: 16, width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          Keep Building! →
        </button>
      </div>
    </div>
  )
}
