import React from 'react'
import { BADGES, COMPANIES, SECTORS } from '../data/companies.js'
import { formatMoney, getSectorStateColor, calcLocationsMultiplier } from '../game/engine.js'

// Returns the full cycle badge label including preSignal suffix
function getCycleBadgeLabel(cycle) {
  if (!cycle) return '🟡 Normal'
  if (cycle.state === 'boom') {
    return cycle.preSignal === 'preBoom' ? '🟢 Boom · 🌱 Easing' : '🟢 Boom'
  }
  if (cycle.state === 'downturn') {
    return cycle.preSignal === 'preBoom' ? '🔴 Downturn · 🌱 Recovering' : '🔴 Downturn'
  }
  // Normal
  if (cycle.preSignal === 'preSlowdown') return '🟡 Normal · ⚠️ Slowing'
  if (cycle.preSignal === 'preBoom') return '🟡 Normal · 🌱 Recovering'
  return '🟡 Normal'
}

const BADGE_PILL_COLORS = {
  safeBet:      { color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
  steadyGrower: { color: '#1D4ED8', bg: '#EFF6FF', border: '#93C5FD' },
  balanced:     { color: '#D97706', bg: '#FFFBEB', border: '#FCD34D' },
  highRisk:     { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  wildCard:     { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  fadingOut:    { color: '#9CA3AF', bg: '#F8FAFC', border: '#E2E8F0' },
}

export default function SectorView({
  sectorId, companyStates, portfolio, turnActions, sectorCycles,
  flashSale, onSelectCompany, onBack,
  cash, netWorth, companyNewsEffects,
}) {
  const sector = SECTORS[sectorId]
  if (!sector) return null

  // Sort companies: by badge tier first (safe → steady → balanced → risk → wildcard → fading),
  // then by base value ascending within each tier (cheapest first)
  const BADGE_ORDER = { safeBet: 0, steadyGrower: 1, balanced: 2, highRisk: 3, wildCard: 4, fadingOut: 5 }
  const companies = COMPANIES
    .filter(c => c.sector === sectorId)
    .sort((a, b) => {
      const tierDiff = (BADGE_ORDER[a.badge] ?? 99) - (BADGE_ORDER[b.badge] ?? 99)
      if (tierDiff !== 0) return tierDiff
      return (a.baseProfit * a.baseMultiplier) - (b.baseProfit * b.baseMultiplier)
    })
  const sectorCycle = sectorCycles[sectorId]
  const sectorState = sectorCycle ? sectorCycle.state : 'normal'
  const stateColor = getSectorStateColor(sectorState)
  const cycleBadgeLabel = getCycleBadgeLabel(sectorCycle)

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
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
            flexShrink: 0,
            marginLeft: 8,
          }}>
            {cycleBadgeLabel}
          </div>
        </div>

        {/* Cash + Empire Value pills */}
        {(cash !== undefined || netWorth !== undefined) && (
          <div style={{ display: 'flex', gap: 8 }}>
            {cash !== undefined && (
              <div style={{
                background: 'rgba(255,255,255,0.18)', borderRadius: 20,
                padding: '4px 12px', fontSize: 12, fontWeight: 800, color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2,
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.75, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Cash to spend</span>
                <span>💵 {formatMoney(cash)}</span>
              </div>
            )}
            {netWorth !== undefined && (
              <div style={{
                background: 'rgba(255,255,255,0.18)', borderRadius: 20,
                padding: '4px 12px', fontSize: 12, fontWeight: 800, color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2,
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.75, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Empire Value</span>
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

          // Investment gain/loss vs purchase price (owned only)
          let investGain = null
          if (owned) {
            const locMult = calcLocationsMultiplier(owned.locations)
            const currentTotalValue = Math.round(cs.profit * cs.multiplier * locMult)
            const totalInvested = (owned.purchasePrice || 0) + (owned.locationSpend || 0)
            investGain = (currentTotalValue - totalInvested) + (owned.profitsCollected || 0)
          }

          const badge = BADGES[co.badge]
          const pillStyle = BADGE_PILL_COLORS[co.badge] || { color: '#6B7280', bg: '#F1F5F9', border: '#E2E8F0' }

          // Company news effect badge
          const newsEffect = companyNewsEffects && companyNewsEffects[co.id]
          const newsLabel = newsEffect > 0 ? '📰 +6%' : newsEffect < 0 ? '📰 −6%' : null

          return (
            <button
              key={co.id}
              onClick={() => onSelectCompany(co.id)}
              style={{
                width: '100%',
                background: '#fff',
                border: `2px solid ${owned ? sector.color : '#E2E8F0'}`,
                borderRadius: 16,
                padding: '14px 14px',
                marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: owned
                  ? `0 4px 16px ${sector.color}25`
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
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0, marginLeft: 6 }}>
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

                {/* Single profile badge + news effect */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  {badge && (
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      color: pillStyle.color,
                      background: pillStyle.bg,
                      padding: '2px 8px', borderRadius: 6,
                      border: `1px solid ${pillStyle.border}`,
                    }}>
                      {badge.label}
                    </span>
                  )}
                  {newsLabel && (
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      color: newsEffect > 0 ? '#16A34A' : '#DC2626',
                      background: newsEffect > 0 ? '#F0FDF4' : '#FEF2F2',
                      padding: '2px 7px', borderRadius: 6,
                      border: `1px solid ${newsEffect > 0 ? '#86EFAC' : '#FCA5A5'}`,
                    }}>
                      {newsLabel}
                    </span>
                  )}
                  {/* Investment gain/loss vs purchase */}
                  {investGain !== null && (
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      color: investGain >= 0 ? '#16A34A' : '#DC2626',
                      background: investGain >= 0 ? '#F0FDF4' : '#FEF2F2',
                      padding: '2px 8px', borderRadius: 6,
                      border: `1px solid ${investGain >= 0 ? '#86EFAC' : '#FCA5A5'}`,
                    }}>
                      {investGain >= 0 ? '📈' : '📉'} {investGain >= 0 ? '+' : ''}{formatMoney(investGain)}
                    </span>
                  )}
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
