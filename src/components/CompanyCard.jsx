import React from 'react'
import { BADGES, COMPANIES, SECTORS } from '../data/companies.js'
import { formatMoney, calcLocationsMultiplier } from '../game/engine.js'
import Sparkline from './Sparkline.jsx'

// Danger badge IDs — get distinct visual treatment
const DANGER_BADGES = new Set(['inDecline', 'wildRisk', 'highRisk'])
const BADGE_COLORS = {
  lowRisk:         '#22C55E',
  modRisk:         '#EAB308',
  highRisk:        '#EF4444',
  wildRisk:        '#EF4444',
  slowGrowth:      '#94A3B8',
  steadyGrowth:    '#3B82F6',
  fastGrowth:      '#22C55E',
  inDecline:       '#EF4444',
  cashCow:         '#EAB308',
  counterCyclical: '#10B981',
  fadAlert:        '#F97316',
  ecommBoom:       '#3B82F6',
  stickyRevenue:   '#8B5CF6',
}

function ROIHint({ cost, profitPerTurn }) {
  if (!cost || !profitPerTurn || profitPerTurn <= 0) return null
  const turns = Math.ceil(cost / profitPerTurn)
  if (turns > 200) return null
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, color: '#6B7280',
      marginTop: 4,
    }}>
      💡 Pays back in ~{turns} turn{turns !== 1 ? 's' : ''}
    </div>
  )
}

export default function CompanyCard({
  companyId,
  companyStates,
  portfolio,
  turnActions,
  cash,
  flashSale,
  sectorCycles,
  economy,
  turn,
  isChipPick,
  onBuy,
  onSell,
  onOpenLocation,
  onBadgeTap,
  onBack,
  onViewDetails,
  sectorName,
}) {
  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return null

  const cs = companyStates[companyId] || { profit: co.baseProfit, multiplier: co.baseMultiplier, profitHistory: [] }
  const owned = portfolio[companyId]
  const baseValue = Math.round(cs.profit * cs.multiplier)
  const isOnFlashSale = !owned && flashSale && flashSale.companyId === companyId
  const flashDiscount = isOnFlashSale ? flashSale.discount : 0
  const value = isOnFlashSale ? Math.round(baseValue * (1 - flashDiscount)) : baseValue
  const actionTaken = turnActions && turnActions[companyId]

  const locMult = owned ? calcLocationsMultiplier(owned.locations) : 1
  const effectiveProfit = Math.round(cs.profit * locMult)
  const canAfford = cash === undefined || cash >= value
  const shortfall = canAfford ? 0 : value - cash

  const sectorData = SECTORS[co.sector]
  const sectorLabel = sectorData ? `${sectorData.emoji} ${sectorData.name}` : co.sector

  const hasHistory = cs.profitHistory && cs.profitHistory.length >= 2

  // Value context banner — explain why value moved
  const sectorCycle = sectorCycles && sectorCycles[co.sector]
  const econState = economy && economy.state
  let contextBanner = null
  if (sectorCycle && sectorCycle.state === 'downturn') {
    contextBanner = { text: `⚠️ ${sectorData ? sectorData.name : 'Sector'} slump is draining value each turn`, color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' }
  } else if (sectorCycle && sectorCycle.state === 'boom') {
    contextBanner = { text: `🚀 ${sectorData ? sectorData.name : 'Sector'} boom is boosting this company!`, color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' }
  } else if (econState === 'slowdown' && co.profSens > 0.5) {
    contextBanner = { text: '📉 Economy slowdown is pushing this value down', color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5' }
  } else if (econState === 'booming' && co.profSens > 0.3) {
    contextBanner = { text: '🌟 Economic boom is lifting this company!', color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' }
  } else if (co.badges.includes('inDecline')) {
    contextBanner = { text: '📉 This company fades every turn — even in good times', color: '#9CA3AF', bg: '#F8FAFC', border: '#E2E8F0' }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: '#EFF6FF',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>

      {/* Art Panel */}
      <div style={{
        minHeight: 175, flexShrink: 0,
        background: `linear-gradient(150deg, ${co.gradientFrom} 0%, ${co.gradientTo} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 48px)',
        paddingBottom: 24,
      }}>
        {/* Subtle radial glow behind emoji */}
        <div style={{
          position: 'absolute',
          width: 160, height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            left: 12,
            background: 'rgba(0,0,0,0.22)',
            color: '#fff', border: 'none', borderRadius: 12,
            width: 36, height: 36, fontSize: 16,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          ←
        </button>

        {/* Sector breadcrumb */}
        {sectorName && (
          <div style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 18px)',
            left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.22)',
            color: 'rgba(255,255,255,0.9)',
            fontSize: 11, fontWeight: 700,
            padding: '3px 12px', borderRadius: 20,
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}>
            ← {sectorName}
          </div>
        )}

        {/* Cash pill — bottom left */}
        {cash !== undefined && (
          <div style={{
            position: 'absolute',
            bottom: 10, left: 12,
            background: 'rgba(0,0,0,0.30)',
            color: '#fff',
            fontSize: 11, fontWeight: 800,
            padding: '3px 10px', borderRadius: 20,
            backdropFilter: 'blur(8px)',
          }}>
            💰 {formatMoney(cash)}
          </div>
        )}

        {/* Owned badge */}
        {owned && (
          <div style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            right: 12,
            background: '#22C55E', color: '#fff',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
          }}>
            ✓ OWNED
          </div>
        )}

        {/* Chip's Pick badge (turn 1, unowned) */}
        {isChipPick && !owned && (
          <div style={{
            position: 'absolute',
            bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
            color: '#fff',
            padding: '5px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 900, letterSpacing: '0.04em',
            boxShadow: '0 3px 10px rgba(29,78,216,0.5)',
            whiteSpace: 'nowrap',
          }}>
            🤖 Chip's Pick for Beginners
          </div>
        )}

        {/* Flash Sale badge */}
        {isOnFlashSale && (
          <div style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            right: 12,
            background: 'linear-gradient(135deg, #D97706, #F59E0B)',
            color: '#fff',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
            boxShadow: '0 2px 8px rgba(217,119,6,0.5)',
          }}>
            ⚡ {Math.round(flashDiscount * 100)}% OFF · {flashSale.turnsLeft} turn{flashSale.turnsLeft !== 1 ? 's' : ''} left
          </div>
        )}

        {/* Action taken badge */}
        {actionTaken && !owned && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.35)', color: '#fff',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 700,
            backdropFilter: 'blur(8px)',
          }}>
            {actionTaken === 'buy' ? '✓ Bought this turn' : actionTaken === 'sell' ? '✓ Sold this turn' : '✓ Expanded'}
          </div>
        )}

        {/* Company emoji with glow ring */}
        <div style={{
          fontSize: 72,
          filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.25))',
          lineHeight: 1,
          position: 'relative', zIndex: 1,
        }}>
          {co.emoji}
        </div>
        <div style={{
          fontSize: 24, fontWeight: 900, color: '#fff',
          marginTop: 10, textShadow: '0 2px 10px rgba(0,0,0,0.25)',
          position: 'relative', zIndex: 1,
        }}>
          {co.name}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
          background: 'rgba(0,0,0,0.18)',
          padding: '3px 12px', borderRadius: 20, marginTop: 6,
          backdropFilter: 'blur(8px)',
        }}>
          {sectorLabel}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ flex: 1, padding: '16px 16px 130px' }}>

        {/* Badges */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Company Profile
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {co.badges.map(badgeId => {
              const badge = BADGES[badgeId]
              const isDanger = DANGER_BADGES.has(badgeId)
              const color = BADGE_COLORS[badgeId] || '#6B7280'
              return (
                <button
                  key={badgeId}
                  onClick={() => onBadgeTap && onBadgeTap(badgeId)}
                  style={{
                    padding: '7px 13px',
                    background: isDanger ? '#FEF2F2' : '#F8FAFC',
                    border: `1.5px solid ${isDanger ? '#FCA5A5' : '#E2E8F0'}`,
                    borderRadius: 20,
                    fontSize: 13, fontWeight: 800,
                    color: isDanger ? '#DC2626' : '#374151',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  {badge ? badge.label : badgeId}
                  {isDanger && <span style={{ fontSize: 10, fontWeight: 900, color: '#EF4444' }}>!</span>}
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 6 }}>
            Tap any badge to learn what it means
          </div>
        </div>

        {/* Flash Sale Banner */}
        {isOnFlashSale && (
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '2px solid #FCD34D',
            borderRadius: 14, padding: '14px 16px',
            marginBottom: 14,
            boxShadow: '0 4px 16px rgba(252,211,77,0.35)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#92400E' }}>⚡ Flash Sale!</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: 20, border: '1px solid #FCD34D' }}>
                {flashSale.turnsLeft} turn{flashSale.turnsLeft !== 1 ? 's' : ''} left
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#16A34A' }}>{formatMoney(value)}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#9CA3AF', textDecoration: 'line-through' }}>{formatMoney(baseValue)}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: 10 }}>
                -{Math.round(flashDiscount * 100)}%
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginTop: 6 }}>
              You save {formatMoney(baseValue - value)} — don't miss this deal!
            </div>
          </div>
        )}

        {/* Value context banner */}
        {contextBanner && (
          <div style={{
            background: contextBanner.bg,
            border: `1.5px solid ${contextBanner.border}`,
            borderRadius: 12, padding: '10px 14px',
            marginBottom: 14,
            fontSize: 13, fontWeight: 700, color: contextBanner.color,
            lineHeight: 1.4,
          }}>
            {contextBanner.text}
          </div>
        )}

        {/* About */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          borderLeft: `4px solid ${co.gradientTo}`,
          padding: '12px 14px',
          marginBottom: 14,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, fontWeight: 500 }}>
            {co.about}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          {/* Profit tile */}
          <div style={{
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: '1.5px solid #86EFAC',
            borderRadius: 14, padding: '13px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              Profit/Turn{owned && owned.locations > 1 ? ` (×${owned.locations})` : ''}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#15803D' }}>
              {formatMoney(owned ? effectiveProfit : cs.profit)}
            </div>
            {!owned && (
              <ROIHint cost={value} profitPerTurn={cs.profit} />
            )}
          </div>

          {/* Value tile */}
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            border: '1.5px solid #93C5FD',
            borderRadius: 14, padding: '13px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              Value
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#1E40AF' }}>
              {formatMoney(value)}
            </div>
          </div>
        </div>

        {/* Value Multiplier golden tile */}
        <div style={{
          background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
          border: '2px solid #FCD34D',
          borderRadius: 14, padding: '13px 16px',
          marginBottom: 14,
          boxShadow: '0 2px 8px rgba(252,211,77,0.3)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Value Multiplier
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#78350F' }}>
              {cs.multiplier.toFixed(1)}×
            </span>
            <div>
              <div style={{ fontSize: 13, color: '#92400E', fontWeight: 700 }}>
                {formatMoney(Math.round(cs.profit))} × {cs.multiplier.toFixed(1)} = {formatMoney(value)}
              </div>
              <div style={{ fontSize: 11, color: '#A16207', fontWeight: 600, marginTop: 1 }}>
                Higher multiplier = investors love it
              </div>
            </div>
          </div>
        </div>

        {/* Profit history + stability */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '13px 14px',
          marginBottom: 14,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Profit History
            </div>
            {hasHistory ? (
              <Sparkline data={cs.profitHistory} width={140} height={44} color={co.gradientTo} />
            ) : (
              <div style={{
                height: 44, display: 'flex', alignItems: 'center',
                fontSize: 12, color: '#9CA3AF', fontWeight: 600,
                fontStyle: 'italic',
              }}>
                Chart fills in as you play
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', marginLeft: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Stability
            </div>
            <StabilityDots profSens={co.profSens} />
            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 4 }}>
              {co.profSens <= 0.25 ? 'Very Stable' : co.profSens <= 0.5 ? 'Stable' : co.profSens <= 1.0 ? 'Moderate' : 'Volatile'}
            </div>
          </div>
        </div>

        {/* 'See full details' link (owned only) */}
        {owned && onViewDetails && (
          <button
            onClick={onViewDetails}
            style={{
              width: '100%', padding: '12px',
              background: '#fff',
              border: '1.5px solid #E2E8F0',
              borderRadius: 12,
              fontSize: 14, fontWeight: 800,
              color: '#1D4ED8', cursor: 'pointer',
              fontFamily: 'inherit', marginBottom: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <span>📊 See my investment details</span>
            <span>›</span>
          </button>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!owned && (
            <div style={{ flex: 1 }}>
              <button
                onClick={() => canAfford && !actionTaken && onBuy && onBuy(companyId)}
                disabled={!!actionTaken || !canAfford}
                style={{
                  width: '100%', padding: '15px',
                  background: actionTaken
                    ? '#E5E7EB'
                    : !canAfford
                    ? 'linear-gradient(135deg, #94A3B8, #CBD5E1)'
                    : 'linear-gradient(135deg, #16A34A, #22C55E)',
                  color: (actionTaken || !canAfford) ? '#fff' : '#fff',
                  border: 'none', borderRadius: 14,
                  fontSize: 15, fontWeight: 900,
                  fontFamily: 'inherit',
                  cursor: (actionTaken || !canAfford) ? 'default' : 'pointer',
                  boxShadow: (actionTaken || !canAfford) ? 'none' : '0 4px 14px rgba(34,197,94,0.4)',
                }}
              >
                {actionTaken
                  ? '✓ Done this turn'
                  : !canAfford
                  ? `Need ${formatMoney(shortfall)} more`
                  : `Buy · ${formatMoney(value)}`}
              </button>
              {!canAfford && !actionTaken && (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textAlign: 'center', marginTop: 5 }}>
                  You have {formatMoney(cash)} · need {formatMoney(value)}
                </div>
              )}
            </div>
          )}

          {owned && (
            <>
              <button
                onClick={() => onSell && onSell(companyId)}
                disabled={!!actionTaken}
                style={{
                  flex: 1, padding: '15px',
                  background: actionTaken ? '#E5E7EB' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                  color: actionTaken ? '#9CA3AF' : '#fff',
                  border: 'none', borderRadius: 14,
                  fontSize: 15, fontWeight: 900,
                  fontFamily: 'inherit', cursor: actionTaken ? 'default' : 'pointer',
                  boxShadow: actionTaken ? 'none' : '0 4px 14px rgba(239,68,68,0.35)',
                }}
              >
                {actionTaken ? '✓ Done' : 'Sell'}
              </button>
              {owned.locations < 5 && (() => {
                const locCost = Math.round(cs.profit * cs.multiplier * (COMPANIES.find(c => c.id === companyId)?.locationCost || 0.15))
                const canAffordLoc = cash === undefined || cash >= locCost
                const disabled = !!actionTaken || !canAffordLoc
                return (
                  <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      onClick={() => !disabled && onOpenLocation && onOpenLocation(companyId)}
                      disabled={disabled}
                      style={{
                        width: '100%', padding: '15px',
                        background: disabled
                          ? (actionTaken ? '#E5E7EB' : 'linear-gradient(135deg, #94A3B8, #CBD5E1)')
                          : 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
                        color: disabled ? '#9CA3AF' : '#fff',
                        border: 'none', borderRadius: 14,
                        fontSize: 14, fontWeight: 900,
                        fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer',
                        boxShadow: disabled ? 'none' : '0 4px 14px rgba(29,78,216,0.35)',
                      }}
                    >
                      {actionTaken ? '✓ Done' : !canAffordLoc ? `Need ${formatMoney(locCost - (cash || 0))} more` : '+ Open Location'}
                    </button>
                  </div>
                )
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StabilityDots({ profSens }) {
  let dots
  if (profSens <= 0)      dots = 1
  else if (profSens <= 0.25) dots = 1
  else if (profSens <= 0.50) dots = 2
  else if (profSens <= 0.90) dots = 3
  else if (profSens <= 1.20) dots = 4
  else                       dots = 5

  const dotColor = dots <= 2 ? '#22C55E' : dots <= 3 ? '#EAB308' : '#EF4444'

  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 11, height: 11, borderRadius: '50%',
          background: i <= dots ? dotColor : '#E5E7EB',
          boxShadow: i <= dots ? `0 0 6px ${dotColor}80` : 'none',
        }} />
      ))}
    </div>
  )
}
