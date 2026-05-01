import React from 'react'
import { BADGES, COMPANIES, SECTORS } from '../data/companies.js'
import { formatMoney, calcLocationsMultiplier } from '../game/engine.js'
import Sparkline from './Sparkline.jsx'

const BADGE_STYLE = {
  safeBet:      { color: '#4ADE80', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)',   danger: false },
  steadyGrower: { color: '#818CF8', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', danger: false },
  balanced:     { color: '#FCD34D', bg: 'rgba(252,211,77,0.15)', border: 'rgba(252,211,77,0.3)', danger: false },
  highRisk:     { color: '#FCA5A5', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)',  danger: true  },
  wildCard:     { color: '#FCA5A5', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)',  danger: true  },
  fadingOut:    { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', danger: false },
}

function ROIHint({ cost, profitPerTurn }) {
  if (!cost || !profitPerTurn || profitPerTurn <= 0) return null
  const turns = Math.ceil(cost / profitPerTurn)
  if (turns > 200) return null
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
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
  companyNewsEffects,
  chipGuideStep,
  onTermTap,
}) {
  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return null

  const touchStartRef = React.useRef(null)

  function handleTouchStart(e) {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e) {
    if (!touchStartRef.current || !onBack) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartRef.current.x
    const dy = Math.abs(t.clientY - touchStartRef.current.y)
    const startedNearEdge = touchStartRef.current.x < 50
    touchStartRef.current = null
    if (dx > 60 && dy < 80 && startedNearEdge) {
      try { navigator.vibrate(15) } catch(e) {}
      onBack()
    }
  }

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

  const sectorCycle = sectorCycles && sectorCycles[co.sector]
  const econState = economy && economy.state
  let contextBanner = null
  if (sectorCycle && sectorCycle.state === 'downturn') {
    contextBanner = { text: `⚠️ ${sectorData ? sectorData.name : 'Sector'} slump is draining value each turn`, color: '#FCA5A5', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' }
  } else if (sectorCycle && sectorCycle.state === 'boom') {
    contextBanner = { text: `🚀 ${sectorData ? sectorData.name : 'Sector'} boom is boosting this company!`, color: '#4ADE80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' }
  } else if (econState === 'slowdown' && co.profSens > 0.5) {
    contextBanner = { text: '📉 Economy slowdown is pushing this value down', color: '#FCA5A5', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' }
  } else if (econState === 'booming' && co.profSens > 0.3) {
    contextBanner = { text: '🌟 Economic boom is lifting this company!', color: '#4ADE80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' }
  } else if (co.badge === 'fadingOut') {
    contextBanner = { text: '📉 This company fades every turn — even in good times', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }
  }

  const riskTier = (() => {
    if (co.badge === 'fadingOut') return 'fading'
    if (co.badge === 'wildCard') return 'wild'
    if (co.badge === 'highRisk') return 'high'
    if (co.badge === 'safeBet') return 'safe'
    return 'normal'
  })()

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: '#080D1A',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <style>{`
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%) skewX(-15deg) }
          100% { transform: translateX(250%) skewX(-15deg) }
        }
        @keyframes wildGlow {
          0%, 100% { box-shadow: inset 0 0 60px rgba(124,58,237,0.20) }
          50%       { box-shadow: inset 0 0 80px rgba(239,68,68,0.30) }
        }
      `}</style>

      {/* Art Panel */}
      <div style={{
        minHeight: 175, flexShrink: 0,
        background: riskTier === 'fading'
          ? `linear-gradient(150deg, #1a1f2e 0%, #242938 40%, ${co.gradientFrom}40 100%)`
          : `linear-gradient(150deg, ${co.gradientFrom} 0%, ${co.gradientTo} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 48px)',
        paddingBottom: 24,
        filter: riskTier === 'fading' ? 'saturate(0.35)' : 'none',
        animation: riskTier === 'wild' ? 'wildGlow 3s ease-in-out infinite' : 'none',
      }}>
        {riskTier === 'wild' && (
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden',
            borderRadius: 0, pointerEvents: 'none', zIndex: 0,
          }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: '60%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
              animation: 'shimmerSweep 2.8s ease-in-out infinite',
            }} />
          </div>
        )}

        <div style={{
          position: 'absolute',
          width: 160, height: 160, borderRadius: '50%',
          background: riskTier === 'safe'
            ? 'rgba(74,222,128,0.22)'
            : riskTier === 'high'
            ? 'rgba(239,68,68,0.18)'
            : 'rgba(255,255,255,0.12)',
          filter: 'blur(24px)', pointerEvents: 'none',
        }} />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            left: 12,
            background: 'rgba(0,0,0,0.40)',
            color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
            width: 36, height: 36, fontSize: 16,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          ←
        </button>


        {owned && (
          <div style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            right: 12,
            background: 'rgba(34,197,94,0.85)', color: '#fff',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
          }}>
            ✓ OWNED
          </div>
        )}

        {isChipPick && !owned && (
          <div style={{
            position: 'absolute',
            bottom: 10, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #4338CA, #7C3AED)',
            color: '#fff',
            padding: '5px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 800, letterSpacing: '0.04em',
            boxShadow: '0 3px 14px rgba(99,102,241,0.5)',
            whiteSpace: 'nowrap',
          }}>
            🤖 Chip's Pick for Beginners
          </div>
        )}

        {isOnFlashSale && (
          <div style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            right: 12,
            background: 'linear-gradient(135deg, #D97706, #F59E0B)',
            color: '#fff',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
            boxShadow: '0 2px 10px rgba(217,119,6,0.5)',
          }}>
            ⚡ {Math.round(flashDiscount * 100)}% OFF · {flashSale.turnsLeft} turn{flashSale.turnsLeft !== 1 ? 's' : ''} left
          </div>
        )}

        {actionTaken && !owned && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.8)',
            padding: '3px 10px', borderRadius: 20,
            fontSize: 11, fontWeight: 700,
            backdropFilter: 'blur(8px)',
          }}>
            {actionTaken === 'buy' ? '✓ Bought this turn' : actionTaken === 'sell' ? '✓ Sold this turn' : '✓ Expanded'}
          </div>
        )}

        <div style={{
          fontSize: 72,
          filter: riskTier === 'safe'
            ? 'drop-shadow(0 6px 20px rgba(0,0,0,0.30)) drop-shadow(0 0 18px rgba(74,222,128,0.6))'
            : riskTier === 'high'
            ? 'drop-shadow(0 6px 20px rgba(0,0,0,0.40)) drop-shadow(0 0 22px rgba(239,68,68,0.55))'
            : riskTier === 'wild'
            ? 'drop-shadow(0 6px 20px rgba(0,0,0,0.40)) drop-shadow(0 0 28px rgba(124,58,237,0.60))'
            : riskTier === 'fading'
            ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.30)) grayscale(0.6)'
            : 'drop-shadow(0 6px 20px rgba(0,0,0,0.35))',
          lineHeight: 1,
          position: 'relative', zIndex: 1,
        }}>
          {co.emoji}
        </div>
        <div style={{
          fontSize: 24, fontWeight: 900, color: '#fff',
          marginTop: 10, textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          position: 'relative', zIndex: 1,
        }}>
          {co.name}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ flex: 1, padding: '16px 16px 130px', background: '#080D1A' }}>

        {/* Badge + News Effect */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {(() => {
              const badge = BADGES[co.badge]
              const style = BADGE_STYLE[co.badge] || { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', danger: false }
              return (
                <button
                  onClick={() => onBadgeTap && onBadgeTap(co.badge)}
                  style={{
                    padding: '7px 13px',
                    background: style.bg,
                    border: `1.5px solid ${style.border}`,
                    borderRadius: 20,
                    fontSize: 13, fontWeight: 700,
                    color: style.color,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  {badge ? badge.label : co.badge}
                  {style.danger && <span style={{ fontSize: 10, fontWeight: 900, color: '#FCA5A5' }}>!</span>}
                </button>
              )
            })()}
            {companyNewsEffects && companyNewsEffects[companyId] !== undefined && (
              <div style={{
                padding: '5px 11px', borderRadius: 20,
                fontSize: 13, fontWeight: 700,
                color: companyNewsEffects[companyId] > 0 ? '#4ADE80' : '#FCA5A5',
                background: companyNewsEffects[companyId] > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1.5px solid ${companyNewsEffects[companyId] > 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                {companyNewsEffects[companyId] > 0 ? '📰 +10% next turn' : '📰 −10% next turn'}
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginTop: 6 }}>
            Tap badge to learn what it means
          </div>
        </div>

        {/* Guide tip */}
        {chipGuideStep === 1 && !owned && (
          <div style={{
            background: 'linear-gradient(135deg, #4338CA, #7C3AED)',
            borderRadius: 14, padding: '12px 14px',
            marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
          }}>
            <span style={{ fontSize: 26 }}>🤖</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 2 }}>Chip's Tip</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                Tap <strong>Buy</strong> below to own this company and start collecting profit every turn!
              </div>
            </div>
          </div>
        )}

        {/* Flash Sale Banner */}
        {isOnFlashSale && (
          <div style={{
            background: 'rgba(252,211,77,0.08)',
            border: '2px solid rgba(252,211,77,0.35)',
            borderRadius: 14, padding: '14px 16px',
            marginBottom: 14,
            boxShadow: '0 4px 20px rgba(252,211,77,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#FCD34D' }}>⚡ Flash Sale!</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FCD34D', background: 'rgba(252,211,77,0.15)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(252,211,77,0.3)' }}>
                {flashSale.turnsLeft} turn{flashSale.turnsLeft !== 1 ? 's' : ''} left
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#4ADE80' }}>{formatMoney(value)}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{formatMoney(baseValue)}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FCA5A5', background: 'rgba(239,68,68,0.15)', padding: '2px 8px', borderRadius: 10 }}>
                -{Math.round(flashDiscount * 100)}%
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(252,211,77,0.7)', marginTop: 6 }}>
              You save {formatMoney(baseValue - value)} — don't miss this deal!
            </div>
          </div>
        )}

        {/* Context banner */}
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
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 14,
          borderLeft: `4px solid ${co.gradientTo}`,
          padding: '12px 14px',
          marginBottom: 14,
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeftWidth: 4,
          borderLeftColor: co.gradientTo,
        }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
            {co.about}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1.5px solid rgba(34,197,94,0.25)',
            borderRadius: 14, padding: '13px 14px',
          }}>
            <button
              onClick={() => onTermTap && onTermTap('earnings')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2, borderBottom: '1px dashed rgba(74,222,128,0.3)', paddingBottom: 2 }}>
                Earnings/Turn{owned && owned.locations > 1 ? ` (×${owned.locations})` : ''}
              </div>
            </button>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#4ADE80' }}>
              {formatMoney(owned ? effectiveProfit : cs.profit)}
            </div>
            {!owned && <ROIHint cost={value} profitPerTurn={cs.profit} />}
          </div>

          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1.5px solid rgba(99,102,241,0.25)',
            borderRadius: 14, padding: '13px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              Value
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#818CF8' }}>
              {formatMoney(value)}
            </div>
          </div>
        </div>

        {/* P/E Ratio tile */}
        <div style={{
          background: 'rgba(252,211,77,0.08)',
          border: '2px solid rgba(252,211,77,0.25)',
          borderRadius: 14, padding: '13px 16px',
          marginBottom: 14,
          boxShadow: '0 2px 12px rgba(252,211,77,0.10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <button
              onClick={() => onTermTap && onTermTap('pe_ratio')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px dashed rgba(252,211,77,0.35)', paddingBottom: 2 }}>
                P/E Ratio ⓘ
              </div>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FCD34D' }}>
              {cs.multiplier.toFixed(1)}×
            </span>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(252,211,77,0.85)', fontWeight: 700 }}>
                Investors pay {cs.multiplier.toFixed(1)}× per $1 of earnings
              </div>
              <div style={{ fontSize: 11, color: 'rgba(252,211,77,0.55)', fontWeight: 600, marginTop: 1 }}>
                {formatMoney(Math.round(cs.profit))} earnings × {cs.multiplier.toFixed(1)} = {formatMoney(value)}
              </div>
            </div>
          </div>
        </div>

        {/* Profit history */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '13px 14px',
          marginBottom: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Profit History
            </div>
            {hasHistory ? (
              <Sparkline data={cs.profitHistory} width={140} height={44} color={co.gradientTo} />
            ) : (
              <div style={{
                height: 44, display: 'flex', alignItems: 'center',
                fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, fontStyle: 'italic',
              }}>
                Chart fills in as you play
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', marginLeft: 16 }}>
            <button
              onClick={() => onTermTap && onTermTap('volatility')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right', marginBottom: 8 }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: 2 }}>
                Volatility ⓘ
              </div>
            </button>
            <StabilityDots profSens={co.profSens} />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: 4 }}>
              {co.profSens <= 0.25 ? 'Very Low' : co.profSens <= 0.50 ? 'Low' : co.profSens <= 0.90 ? 'Medium' : co.profSens <= 1.20 ? 'High' : 'Very High'}
            </div>
          </div>
        </div>

        {/* See full details */}
        {owned && onViewDetails && (
          <button
            onClick={onViewDetails}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              color: '#818CF8', cursor: 'pointer',
              fontFamily: 'inherit', marginBottom: 12,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
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
                    ? 'rgba(255,255,255,0.08)'
                    : !canAfford
                    ? 'rgba(148,163,184,0.2)'
                    : 'linear-gradient(135deg, #16A34A, #22C55E)',
                  color: (actionTaken || !canAfford) ? 'rgba(255,255,255,0.4)' : '#fff',
                  border: (actionTaken || !canAfford) ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderRadius: 14,
                  fontSize: 15, fontWeight: 900,
                  fontFamily: 'inherit',
                  cursor: (actionTaken || !canAfford) ? 'default' : 'pointer',
                  boxShadow: (actionTaken || !canAfford) ? 'none' : '0 4px 18px rgba(34,197,94,0.4)',
                }}
              >
                {actionTaken
                  ? '✓ Done this turn'
                  : !canAfford
                  ? `Need ${formatMoney(shortfall)} more`
                  : `Buy · ${formatMoney(value)}`}
              </button>
              {!canAfford && !actionTaken && (
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 5 }}>
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
                  background: actionTaken ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                  color: actionTaken ? 'rgba(255,255,255,0.35)' : '#fff',
                  border: actionTaken ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderRadius: 14,
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
                          ? 'rgba(255,255,255,0.06)'
                          : 'linear-gradient(135deg, #4338CA, #7C3AED)',
                        color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
                        border: disabled ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        borderRadius: 14,
                        fontSize: 14, fontWeight: 900,
                        fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer',
                        boxShadow: disabled ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
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
  if (profSens <= 0.25)      dots = 5
  else if (profSens <= 0.50) dots = 4
  else if (profSens <= 0.90) dots = 3
  else if (profSens <= 1.20) dots = 2
  else                       dots = 1

  const dotColor = dots >= 4 ? '#4ADE80' : dots === 3 ? '#FCD34D' : '#FCA5A5'

  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 11, height: 11, borderRadius: '50%',
          background: i <= dots ? dotColor : 'rgba(255,255,255,0.1)',
          boxShadow: i <= dots ? `0 0 6px ${dotColor}80` : 'none',
        }} />
      ))}
    </div>
  )
}
