import React from 'react'
import { COMPANIES, SECTORS } from '../data/companies.js'
import { formatMoney, getSectorStateLabel, getSectorStateColor } from '../game/engine.js'

export default function SectorView({ sectorId, companyStates, portfolio, turnActions, sectorCycles, flashSale, onSelectCompany, onBack }) {
  const sector = SECTORS[sectorId]
  if (!sector) return null

  const companies = COMPANIES.filter(c => c.sector === sectorId)
  const sectorCycle = sectorCycles[sectorId]
  const sectorState = sectorCycle ? sectorCycle.state : 'normal'
  const stateColor = getSectorStateColor(sectorState)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 140,
      background: '#EFF6FF',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(150deg, ${sector.color}DD 0%, ${sector.color} 100%)`,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 18,
        paddingLeft: 16, paddingRight: 16,
        flexShrink: 0,
        position: 'relative',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(0,0,0,0.22)', color: '#fff',
              border: 'none', borderRadius: 12,
              width: 36, height: 36, fontSize: 16,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', flexShrink: 0,
            }}
          >
            ← Empire
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              {sector.emoji} {sector.name}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              {sector.description}
            </div>
          </div>
          <div style={{
            padding: '5px 12px',
            background: stateColor + '33',
            border: `1.5px solid ${stateColor}`,
            borderRadius: 20,
            fontSize: 12, fontWeight: 900,
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}>
            {getSectorStateLabel(sectorState)}
          </div>
        </div>
      </div>

      {/* Company List */}
      <div style={{ padding: '12px 12px 100px' }}>
        {companies.map(co => {
          const cs = companyStates[co.id] || { profit: co.baseProfit, multiplier: co.baseMultiplier }
          const baseValue = Math.round(cs.profit * cs.multiplier)
          const owned = portfolio[co.id]
          const actionTaken = turnActions && turnActions[co.id]
          const isDecline = co.badges.includes('inDecline')
          const isOnFlashSale = !owned && flashSale && flashSale.companyId === co.id
          const flashDiscount = isOnFlashSale ? flashSale.discount : 0
          const value = isOnFlashSale ? Math.round(baseValue * (1 - flashDiscount)) : baseValue

          return (
            <button
              key={co.id}
              onClick={() => onSelectCompany(co.id)}
              style={{
                width: '100%',
                background: '#fff',
                border: `2px solid ${owned ? sector.color : isDecline ? '#FCA5A5' : '#E2E8F0'}`,
                borderRadius: 16,
                padding: '14px 14px',
                marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: owned
                  ? `0 4px 16px ${sector.color}25`
                  : isDecline
                  ? '0 2px 8px rgba(239,68,68,0.08)'
                  : '0 1px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.15s',
              }}
            >
              {/* Emoji art */}
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, ${co.gradientFrom}, ${co.gradientTo})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
              }}>
                {co.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#1E293B' }}>{co.name}</div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {owned && (
                      <span style={{
                        fontSize: 10, fontWeight: 900, color: '#1D4ED8',
                        background: '#EFF6FF', padding: '2px 7px', borderRadius: 6,
                        border: '1px solid #BFDBFE',
                      }}>
                        OWNED
                      </span>
                    )}
                    {isOnFlashSale && (
                      <span style={{
                        fontSize: 10, fontWeight: 900, color: '#92400E',
                        background: '#FEF3C7', padding: '2px 7px', borderRadius: 6,
                        border: '1px solid #FCD34D',
                      }}>
                        ⚡ {Math.round(flashDiscount * 100)}% OFF
                      </span>
                    )}
                    {isDecline && !owned && (
                      <span style={{
                        fontSize: 10, fontWeight: 900, color: '#DC2626',
                        background: '#FEF2F2', padding: '2px 7px', borderRadius: 6,
                        border: '1px solid #FCA5A5',
                      }}>
                        ⚠️ DECLINING
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#16A34A' }}>
                    {formatMoney(cs.profit)}/turn
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isOnFlashSale ? '#D97706' : '#1D4ED8' }}>
                    {formatMoney(value)}
                  </span>
                  {isOnFlashSale && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textDecoration: 'line-through' }}>
                      {formatMoney(baseValue)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {co.badges.slice(0, 2).map(b => {
                    const isDanger = b === 'inDecline' || b === 'wildRisk' || b === 'highRisk'
                    return (
                      <span key={b} style={{
                        fontSize: 10, fontWeight: 800,
                        color: isDanger ? '#DC2626' : '#6B7280',
                        background: isDanger ? '#FEF2F2' : '#F1F5F9',
                        padding: '2px 7px', borderRadius: 6,
                        border: isDanger ? '1px solid #FCA5A5' : 'none',
                      }}>
                        {b === 'lowRisk' ? '🛡️ Low Risk' : b === 'wildRisk' ? '🌪️ Wild Risk' :
                         b === 'modRisk' ? '⚡ Mod. Risk' : b === 'highRisk' ? '🔥 High Risk' :
                         b === 'fastGrowth' ? '🚀 Fast Growth' : b === 'slowGrowth' ? '🐢 Slow Growth' :
                         b === 'steadyGrowth' ? '📈 Steady' : b === 'inDecline' ? '📉 In Decline' : b}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div style={{ fontSize: 20, color: '#CBD5E1', flexShrink: 0 }}>›</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
