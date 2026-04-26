import React from 'react'
import { COMPANIES } from '../data/companies.js'
import { formatMoney, calcLocationsMultiplier } from '../game/engine.js'
import Sparkline from './Sparkline.jsx'

export default function CompanyCardBack({ companyId, companyStates, portfolio, onBack, onOpenLocation, turnActions }) {
  const co = COMPANIES.find(c => c.id === companyId)
  const entry = portfolio[companyId]
  if (!co || !entry) return null

  const cs = companyStates[companyId] || { profit: co.baseProfit, multiplier: co.baseMultiplier, profitHistory: [] }
  const currentValue = Math.round(cs.profit * cs.multiplier)
  const locMult = calcLocationsMultiplier(entry.locations)
  const totalValue = Math.round(currentValue * locMult)

  const valueChange = totalValue - entry.purchasePrice
  const profitsCollected = entry.profitsCollected || 0
  const totalGain = valueChange + profitsCollected
  const gainColor = totalGain >= 0 ? '#16A34A' : '#DC2626'
  const gainBg = totalGain >= 0 ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' : 'linear-gradient(135deg, #FEF2F2, #FEE2E2)'
  const gainBorder = totalGain >= 0 ? '#86EFAC' : '#FCA5A5'

  const actionTaken = turnActions && turnActions[companyId]
  const locationCost = Math.round(currentValue * co.locationCost)

  const locations = []
  for (let i = 1; i <= 5; i++) {
    locations.push({
      idx: i,
      owned: i <= entry.locations,
      label: i === 1 ? '🏢 HQ' : `🏪 Branch ${i - 1}`,
      isNext: i === entry.locations + 1,
    })
  }

  const hasHistory = cs.profitHistory && cs.profitHistory.length >= 2

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 155,
      background: '#EFF6FF',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(150deg, ${co.gradientFrom} 0%, ${co.gradientTo} 100%)`,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(0,0,0,0.22)', color: '#fff',
            border: 'none', borderRadius: 12,
            width: 36, height: 36, fontSize: 16,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 30 }}>{co.emoji}</span>
        <div>
          <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>{co.name}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            {entry.locations} location{entry.locations !== 1 ? 's' : ''} · Investment Details
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 14px 130px' }}>

        {/* Total Gain — hero stat */}
        <div style={{
          background: gainBg,
          border: `2px solid ${gainBorder}`,
          borderRadius: 18, padding: '18px',
          marginBottom: 12,
          textAlign: 'center',
          boxShadow: totalGain >= 0 ? '0 4px 16px rgba(34,197,94,0.15)' : '0 4px 16px rgba(239,68,68,0.12)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: gainColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            My Total Gain
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: gainColor }}>
            {totalGain >= 0 ? '+' : ''}{formatMoney(totalGain)}
          </div>
          <div style={{ fontSize: 12, color: gainColor, fontWeight: 700, opacity: 0.7, marginTop: 2 }}>
            Value change + profits collected
          </div>
        </div>

        {/* Earnings History */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: hasHistory ? 10 : 6 }}>
            📈 Earnings History
          </div>
          {hasHistory ? (
            <>
              <Sparkline data={cs.profitHistory} width={320} height={54} color={co.gradientTo} strokeWidth={2.5} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Oldest</span>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Now: {formatMoney(Math.round(cs.profit))}/turn</span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600, fontStyle: 'italic' }}>
              Chart fills in after more turns
            </div>
          )}
        </div>

        {/* Locations */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: 10 }}>
            🏗️ My Locations
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {locations.map(loc => (
              <div key={loc.idx} style={{
                padding: '8px 12px',
                background: loc.owned ? '#EFF6FF' : loc.isNext ? '#F0FDF4' : '#F8FAFC',
                border: `1.5px solid ${loc.owned ? '#93C5FD' : loc.isNext ? '#86EFAC' : '#E2E8F0'}`,
                borderRadius: 10,
                fontSize: 13, fontWeight: 700,
                color: loc.owned ? '#1D4ED8' : loc.isNext ? '#16A34A' : '#CBD5E1',
              }}>
                {loc.owned ? loc.label : loc.isNext ? `➕ ${formatMoney(locationCost)}` : '—'}
              </div>
            ))}
          </div>
          {entry.locations < 5 && !actionTaken && (
            <button
              onClick={() => onOpenLocation && onOpenLocation(companyId)}
              style={{
                marginTop: 12, width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #16A34A, #22C55E)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 900,
                fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
              }}
            >
              + Open Next Location · {formatMoney(locationCost)}
            </button>
          )}
        </div>

        {/* Investment breakdown */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', marginBottom: 12 }}>
            💼 Investment Breakdown
          </div>
          {[
            { label: 'I Paid',           value: formatMoney(entry.purchasePrice),  color: '#374151' },
            { label: 'Value Today',       value: formatMoney(totalValue),           color: '#1D4ED8' },
            { label: 'Value Change',      value: (valueChange >= 0 ? '+' : '') + formatMoney(valueChange), color: valueChange >= 0 ? '#16A34A' : '#DC2626' },
            { label: 'Profits Collected', value: '+' + formatMoney(profitsCollected), color: '#16A34A' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '9px 0', borderBottom: '1px solid #F1F5F9',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#6B7280' }}>{row.label}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
