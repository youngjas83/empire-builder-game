import React from 'react'
import { formatMoney } from '../game/engine.js'
import { COMPANIES } from '../data/companies.js'

export default function ActionDialog({ dialog, cash, onConfirm, onCancel }) {
  if (!dialog) return null

  const { type, companyId, cost, proceeds, cashAfter, valueAdded, tradeData } = dialog
  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return null

  const isSell         = type === 'sell'
  const isBuy          = type === 'buy'
  const isOpenLocation = type === 'openLocation'
  const isSellLocation = type === 'sellLocation'

  const actionLabel = isBuy          ? 'Buy'
    : isSell         ? 'Sell Company'
    : isSellLocation ? 'Sell Location'
    : 'Open Location'

  const actionColor = (isSell || isSellLocation) ? '#F87171' : '#4ADE80'
  const actionBg    = (isSell || isSellLocation)
    ? 'linear-gradient(135deg, #DC2626, #EF4444)'
    : 'linear-gradient(135deg, #16A34A, #22C55E)'

  const amount = (isSell || isSellLocation) ? proceeds : cost
  const cashSpendPct = isBuy && cash > 0 ? Math.round((cost / cash) * 100) : null

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#0F172A',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px 40px',
          animation: 'slideUp 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, margin: '10px auto 20px' }} />

        {/* Company hero */}
        <div style={{
          background: `linear-gradient(150deg, ${co.gradientFrom}22, ${co.gradientTo}15)`,
          border: `1.5px solid ${co.gradientTo}40`,
          borderRadius: 18, padding: '16px',
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 18,
        }}>
          <div style={{
            width: 58, height: 58, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, ${co.gradientFrom}, ${co.gradientTo})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {co.emoji}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {actionLabel}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#E2E8F0' }}>{co.name}</div>
          </div>
        </div>

        {/* Investment Gain / Loss — sell only */}
        {isSell && tradeData && (() => {
          const gain = proceeds - (tradeData.totalInvested || tradeData.purchasePrice || 0)
          const isGain = gain >= 0
          return (
            <div style={{
              background: isGain ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `2px solid ${isGain ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 18, padding: '16px',
              marginBottom: 14, textAlign: 'center',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: isGain ? '#4ADE80' : '#FCA5A5',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
              }}>
                {isGain ? '🎉 Investment Gain' : '📉 Investment Loss'}
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: isGain ? '#4ADE80' : '#FCA5A5', letterSpacing: '-0.5px' }}>
                {isGain ? '+' : ''}{formatMoney(gain)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: isGain ? '#86EFAC' : '#FCA5A5', opacity: 0.75, marginTop: 4 }}>
                {formatMoney(tradeData.totalInvested || tradeData.purchasePrice || 0)} invested → {formatMoney(proceeds)} received
              </div>
            </div>
          )
        })()}

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '13px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
              {(isSell || isSellLocation) ? 'You receive' : 'Cost'}
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: actionColor }}>
              {(isSell || isSellLocation) ? '+' : ''}{formatMoney(amount)}
            </span>
          </div>

          {cashSpendPct !== null && (
            <div style={{
              background: cashSpendPct > 60 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.08)',
              border: `1px solid ${cashSpendPct > 60 ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.2)'}`,
              borderRadius: 10, padding: '8px 16px',
              fontSize: 13, fontWeight: 600,
              color: cashSpendPct > 60 ? '#FCA5A5' : '#4ADE80',
            }}>
              {cashSpendPct > 60 ? '⚠️' : '💡'} That's {cashSpendPct}% of your cash
            </div>
          )}

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '13px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Cash after</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: cashAfter < 0 ? '#FCA5A5' : '#E2E8F0' }}>
              {formatMoney(cashAfter)}
            </span>
          </div>

          {isOpenLocation && (
            <div style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1.5px solid rgba(99,102,241,0.25)',
              borderRadius: 12, padding: '12px 14px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>🤖</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818CF8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Chip's Arbitrage Math
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#C7D2FE', lineHeight: 1.55 }}>
                  You pay <strong>{formatMoney(cost)}</strong> now and get{' '}
                  <strong style={{ color: '#4ADE80' }}>+{formatMoney(valueAdded || 0)}</strong>{' '}
                  added to the company's value permanently.
                  That's like buying growth at market price — and the extra profit compounds every turn!
                </div>
              </div>
            </div>
          )}

          {isSellLocation && (
            <div style={{
              background: 'rgba(251,146,60,0.1)',
              border: '1.5px solid rgba(251,146,60,0.25)',
              borderRadius: 12, padding: '12px 14px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>🤖</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FB923C', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Chip's Note
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#FED7AA', lineHeight: 1.55 }}>
                  You'll sell one branch at today's market price. You keep all the profits it already generated. Good move if you need liquidity fast!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '14px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: 14,
              fontSize: 16, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 2, padding: '14px',
              background: actionBg, color: '#fff',
              border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 4px 18px ${actionColor}40`,
            }}
          >
            {actionLabel} ✓
          </button>
        </div>
      </div>
    </div>
  )
}
