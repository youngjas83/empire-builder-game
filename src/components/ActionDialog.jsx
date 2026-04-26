import React from 'react'
import { formatMoney } from '../game/engine.js'
import { COMPANIES } from '../data/companies.js'

export default function ActionDialog({ dialog, cash, onConfirm, onCancel }) {
  if (!dialog) return null

  const { type, companyId, cost, proceeds, cashAfter } = dialog
  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return null

  const isSell = type === 'sell'
  const isBuy = type === 'buy'
  const isOpenLocation = type === 'openLocation'

  const actionLabel = isBuy ? 'Buy' : isSell ? 'Sell' : 'Open Location'
  const actionColor = isSell ? '#EF4444' : '#22C55E'
  const actionBg = isSell
    ? 'linear-gradient(135deg, #DC2626, #EF4444)'
    : 'linear-gradient(135deg, #16A34A, #22C55E)'

  const amount = isSell ? proceeds : cost
  const cashSpendPct = isBuy && cash > 0 ? Math.round((cost / cash) * 100) : null

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,10,0.65)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px 40px',
          animation: 'slideUp 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '10px auto 20px' }} />

        {/* Company hero */}
        <div style={{
          background: `linear-gradient(150deg, ${co.gradientFrom}44, ${co.gradientTo}22)`,
          border: `1.5px solid ${co.gradientTo}44`,
          borderRadius: 18, padding: '16px',
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 18,
        }}>
          <div style={{
            width: 58, height: 58, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, ${co.gradientFrom}, ${co.gradientTo})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            {co.emoji}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {actionLabel}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1E293B' }}>{co.name}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{
            background: '#F8FAFC', borderRadius: 14, padding: '13px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#6B7280' }}>
              {isSell ? 'You receive' : 'Cost'}
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: actionColor }}>
              {isSell ? '+' : ''}{formatMoney(amount)}
            </span>
          </div>

          {cashSpendPct !== null && (
            <div style={{
              background: cashSpendPct > 60 ? '#FEF2F2' : '#F0FDF4',
              borderRadius: 10, padding: '8px 16px',
              fontSize: 13, fontWeight: 700,
              color: cashSpendPct > 60 ? '#DC2626' : '#16A34A',
            }}>
              {cashSpendPct > 60 ? '⚠️' : '💡'} That's {cashSpendPct}% of your cash
            </div>
          )}

          <div style={{
            background: '#F8FAFC', borderRadius: 14, padding: '13px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#6B7280' }}>Cash after</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: cashAfter < 0 ? '#EF4444' : '#1E293B' }}>
              {formatMoney(cashAfter)}
            </span>
          </div>

          {isOpenLocation && (
            <div style={{
              background: '#EFF6FF', borderRadius: 10, padding: '10px 16px',
              fontSize: 13, color: '#1D4ED8', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>📈</span>
              <span>Adds +30% profit per turn permanently</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '14px',
              background: '#F1F5F9', color: '#374151',
              border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
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
              fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 4px 14px ${actionColor}50`,
            }}
          >
            {actionLabel} ✓
          </button>
        </div>
      </div>
    </div>
  )
}
