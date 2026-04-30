import React from 'react'
import { BADGES, COMPANIES, SECTORS } from '../data/companies.js'
import { formatMoney, getSectorStateColor } from '../game/engine.js'

function getCycleBadgeLabel(cycle) {
  if (!cycle) return '🟡 Normal'
  if (cycle.state === 'boom') {
    return cycle.preSignal === 'preBoom' ? '🟢 Boom · 🌱 Easing' : '🟢 Boom'
  }
  if (cycle.state === 'downturn') {
    return cycle.preSignal === 'preBoom' ? '🔴 Downturn · 🌱 Recovering' : '🔴 Downturn'
  }
  if (cycle.preSignal === 'preSlowdown') return '🟡 Normal · ⚠️ Slowing'
  if (cycle.preSignal === 'preBoom') return '🟡 Normal · 🌱 Recovering'
  return '🟡 Normal'
}

const BADGE_PILL_COLORS = {
  safeBet:      { color: '#4ADE80', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)'   },
  steadyGrower: { color: '#818CF8', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' },
  balanced:     { color: '#FCD34D', bg: 'rgba(252,211,77,0.15)', border: 'rgba(252,211,77,0.3)' },
  highRisk:     { color: '#FCA5A5', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)'  },
  wildCard:     { color: '#FCA5A5', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)'  },
  fadingOut:    { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
}

export default function SectorView({
  sectorId, companyStates, portfolio, turnActions, sectorCycles,
  flashSale, onSelectCompany, onBack,
  cash, netWorth, companyNewsEffects,
}) {
  const sector = SECTORS[sectorId]
  if (!sector) return null

  const companies = COMPANIES
    .filter(c => c.sector === sectorId)
    .sort((a, b) => {
      const csA = companyStates[a.id] || { profit: a.baseProfit, multiplier: a.baseMultiplier }
      const csB = companyStates[b.id] || { profit: b.baseProfit, multiplier: b.baseMultiplier }
      return Math.round(csA.profit * csA.multiplier) - Math.round(csB.profit * csB.multiplier)
    })
  const sectorCycle = sectorCycles[sectorId]
  const sectorState = sectorCycle ? sectorCycle.state : 'normal'
  const stateColor = getSectorStateColor(sectorState)
  const cycleBadgeLabel = getCycleBadgeLabel(sectorCycle)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 140,
      background: '#080D1A',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(150deg, ${sector.color}CC 0%, ${sector.color}99 100%)`,
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 18,
        paddingLeft: 16, paddingRight: 16,
        flexShrink: 0,
        position: 'relative',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(0,0,0,0.35)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
              width: 36, height: 36, fontSize: 16,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', flexShrink: 0,
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Empire</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {sector.emoji} {sector.name}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
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
            flexShrink: 0, marginLeft: 8,
          }}>
            {cycleBadgeLabel}
          </div>
        </div>

        {(cash !== undefined || netWorth !== undefined) && (
          <div style={{ display: 'flex', gap: 8 }}>
            {cash !== undefined && (
              <div style={{
                background: 'rgba(0,0,0,0.30)', borderRadius: 20,
                padding: '4px 12px', fontSize: 12, fontWeight: 800, color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2,
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.65, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Cash</span>
                <span>💵 {formatMoney(cash)}</span>
              </div>
            )}
            {netWorth !== undefined && (
              <div style={{
                background: 'rgba(0,0,0,0.30)', borderRadius: 20,
                padding: '4px 12px', fontSize: 12, fontWeight: 800, color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2,
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.65, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Empire</span>
                <span>🏙️ {formatMoney(netWorth)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Company List */}
      <div style={{ padding: '12px 12px 100px' }}>
        {companies.map(co => {
          const cs = companyStates[co.id] || { profit: co.baseProfit, multiplier: co.baseMultiplier }
          const baseValue = Math.round(cs.profit * cs.multiplier)
          const owned = portfolio[co.id]
          const isOnFlashSale = !owned && flashSale && flashSale.companyId === co.id
          const flashDiscount = isOnFlashSale ? flashSale.discount : 0
          const value = isOnFlashSale ? Math.round(baseValue * (1 - flashDiscount)) : baseValue

          const badge = BADGES[co.badge]
          const pillStyle = BADGE_PILL_COLORS[co.badge] || { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' }

          const cardBg = owned
            ? `linear-gradient(135deg, ${co.gradientFrom}18, rgba(255,255,255,0.04))`
            : isOnFlashSale
            ? 'rgba(252,211,77,0.06)'
            : 'rgba(255,255,255,0.04)'
          const cardBorder = owned
            ? `1.5px solid ${co.gradientTo}50`
            : isOnFlashSale
            ? '1.5px solid rgba(252,211,77,0.35)'
            : '1px solid rgba(255,255,255,0.08)'

          return (
            <button
              key={co.id}
              onClick={() => onSelectCompany(co.id)}
              style={{
                width: '100%',
                background: cardBg,
                border: cardBorder,
                borderRadius: 16,
                padding: '14px',
                marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: owned
                  ? `0 4px 18px ${co.gradientTo}20`
                  : isOnFlashSale
                  ? '0 4px 18px rgba(252,211,77,0.12)'
                  : 'none',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, ${co.gradientFrom}, ${co.gradientTo})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 3px 12px rgba(0,0,0,0.4)',
              }}>
                {co.emoji}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>{co.name}</div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0, marginLeft: 6 }}>
                    {owned && (
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: '#818CF8',
                        background: 'rgba(99,102,241,0.2)', padding: '2px 7px', borderRadius: 6,
                        border: '1px solid rgba(99,102,241,0.35)',
                      }}>
                        OWNED
                      </span>
                    )}
                    {isOnFlashSale && (
                      <span style={{
                        fontSize: 10, fontWeight: 900, color: '#FCD34D',
                        background: 'rgba(252,211,77,0.15)', padding: '2px 7px', borderRadius: 6,
                        border: '1px solid rgba(252,211,77,0.35)',
                      }}>
                        ⚡ {Math.round(flashDiscount * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80' }}>
                    {formatMoney(cs.profit)}/turn
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isOnFlashSale ? '#FCD34D' : 'rgba(255,255,255,0.6)' }}>
                    {formatMoney(value)}
                  </span>
                  {isOnFlashSale && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                      {formatMoney(baseValue)}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  {badge && (
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: pillStyle.color,
                      background: pillStyle.bg,
                      padding: '2px 8px', borderRadius: 6,
                      border: `1px solid ${pillStyle.border}`,
                    }}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>›</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
