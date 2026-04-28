import React, { useState } from 'react'
import { SECTORS, LEVELS, COMPANIES, BADGES } from '../data/companies.js'
import { formatMoney, calcNetWorth, calcProfitPerTurn, getEconomyLabel, getEconomyColor, getSectorStateColor, calcLocationsMultiplier } from '../game/engine.js'
import Chip from './Chip.jsx'


// ─── Empire Report Card ────────────────────────────────────────────────────────

const START_CAPITAL = 10000000

function calcReportCard(state, netWorth, profitPerTurn) {
  const { portfolio, companyStates, economy, sectorCycles } = state
  const ownedIds = Object.keys(portfolio)
  if (ownedIds.length === 0) return null

  // 1. Growth: MOIC vs $10M starting capital (0–25)
  const moic = netWorth / START_CAPITAL
  const growthScore = moic >= 25 ? 25 : moic >= 10 ? 21 : moic >= 5 ? 17 : moic >= 2 ? 12 : moic >= 1.5 ? 8 : Math.max(0, Math.round((moic - 1) * 14))

  // 2. Diversification: sectors covered (0–25)
  const sectors = new Set(ownedIds.map(id => COMPANIES.find(c => c.id === id)?.sector).filter(Boolean))
  const diversScore = sectors.size >= 4 ? 25 : sectors.size === 3 ? 20 : sectors.size === 2 ? 13 : 5

  // 3. Profit Rate: profit/turn as % of empire value (0–25)
  const effPct = netWorth > 0 ? (profitPerTurn / netWorth) * 100 : 0
  const effScore = effPct >= 8 ? 25 : effPct >= 6 ? 21 : effPct >= 4 ? 17 : effPct >= 2 ? 10 : Math.max(0, Math.round(effPct * 3))

  // 4. Risk Balance (0–25)
  const inDownturn = ownedIds.filter(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && sectorCycles[co.sector]?.state === 'downturn'
  }).length
  const hasAnchor = ownedIds.some(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && (co.badge === 'safeBet' || co.badge === 'steadyGrower')
  })
  const hasHighRisk = ownedIds.some(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && (co.badge === 'highRisk' || co.badge === 'wildCard')
  })
  let riskScore = 10
  if (hasAnchor)        riskScore += 5
  if (sectors.size >= 2) riskScore += 5
  if (inDownturn === 0)  riskScore += 5
  if (economy.state === 'slowdown' && hasHighRisk && !hasAnchor) riskScore -= 5
  riskScore = Math.max(0, Math.min(25, riskScore))

  const total = growthScore + diversScore + effScore + riskScore
  const grade = total >= 80 ? 'A' : total >= 60 ? 'B' : total >= 40 ? 'C' : total >= 20 ? 'D' : 'F'
  const gradeLabels = { A: 'Empire Mogul 🌟', B: 'Smart Investor', C: 'Getting There', D: 'Needs Work', F: 'Just Starting' }
  const gradeColors = { A: '#16A34A', B: '#1D4ED8', C: '#D97706', D: '#DC2626', F: '#9CA3AF' }
  const gradeBg    = { A: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', B: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', C: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', D: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)', F: '#F8FAFC' }

  // Chip explanations per category
  const moicStr = moic.toFixed(1)
  const growthChip = growthScore >= 21
    ? `Your empire is ${moicStr}× your starting capital — that's elite-level compounding!`
    : growthScore >= 12
    ? `You've grown to ${moicStr}× your starting $10M. Keep reinvesting profits into more companies to accelerate.`
    : `Your empire is only ${moicStr}× your starting capital. Buy companies in booming sectors and open locations to grow faster.`

  const diversChip = diversScore >= 20
    ? `You own companies in ${sectors.size} sectors — solid protection against any single sector downturn.`
    : sectors.size === 1
    ? `All your companies are in one sector. If that sector hits a downturn, every company gets hurt at once. Diversify!`
    : `${sectors.size} sectors covered. Add one more sector to unlock better protection and a higher score.`

  const effChip = effScore >= 17
    ? `Your companies earn ${effPct.toFixed(1)}% of your empire value every turn — that's a strong income engine.`
    : `Your companies earn ${effPct.toFixed(1)}% of your empire value per turn. Aim for 4%+ by opening more locations on your best earners.`

  const riskChip = !hasAnchor
    ? `You have no anchor companies (Safe Bet or Steady Grower). In a slowdown, your entire portfolio bleeds. Add at least one defensive name.`
    : inDownturn > 0
    ? `${inDownturn} of your companies ${inDownturn === 1 ? 'is' : 'are'} in a sector downturn right now — their value shrinks every turn. Consider selling or diversifying.`
    : riskScore >= 20
    ? `Great balance! You have anchor companies, cross-sector diversification, and no downturn exposure.`
    : `You have anchor companies but could spread into more sectors for better protection.`

  return {
    grade, total,
    label: gradeLabels[grade],
    color: gradeColors[grade],
    bg: gradeBg[grade],
    breakdown: [
      {
        id: 'growth', label: 'Growth', score: growthScore, max: 25,
        tip: growthScore >= 17 ? '🟢 Strong' : growthScore >= 8 ? '🟡 Decent' : '🔴 Weak',
        formula: 'How many times you\'ve multiplied your starting $10M.',
        chipText: growthChip,
      },
      {
        id: 'divers', label: 'Diversification', score: diversScore, max: 25,
        tip: diversScore >= 20 ? '🟢 Strong' : diversScore >= 13 ? '🟡 Decent' : '🔴 Weak',
        formula: 'Number of different sectors you own companies in.',
        chipText: diversChip,
      },
      {
        id: 'profit', label: 'Profit Rate', score: effScore, max: 25,
        tip: effScore >= 17 ? '🟢 Strong' : effScore >= 10 ? '🟡 Decent' : '🔴 Weak',
        formula: 'Profit per turn ÷ empire value. A higher % means your empire earns more per dollar.',
        chipText: effChip,
      },
      {
        id: 'risk', label: 'Risk Balance', score: riskScore, max: 25,
        tip: riskScore >= 20 ? '🟢 Strong' : riskScore >= 15 ? '🟡 Decent' : '🔴 Weak',
        formula: 'Checks for anchor companies, cross-sector diversification, and no active downturn exposure.',
        chipText: riskChip,
      },
    ],
  }
}

function getSectorCycleBadgeLabel(cycle) {
  if (!cycle) return '🟡 Normal'
  if (cycle.state === 'boom') return '🟢 Boom'
  if (cycle.state === 'downturn') return '🔴 Downturn'
  if (cycle.preSignal === 'preSlowdown') return '🟡 Normal · ⚠️ Slowing'
  if (cycle.preSignal === 'preBoom') return '🟡 Normal · 🌱 Recovering'
  return '🟡 Normal'
}

export default function EmpireTab({
  state,
  onSelectSector,
  onShowLevelSheet,
  onEndTurn,
  onEditName,
  onEconomyPillTap,
  onDismissLocationTutorial,
}) {
  const [expandedCard, setExpandedCard] = useState(null)
  const {
    empireName, turn, cash, portfolio, companyStates,
    economy, sectorCycles, level, turnActions,
  } = state

  const netWorth = calcNetWorth(cash, portfolio, companyStates)
  const profitPerTurn = calcProfitPerTurn(portfolio, companyStates)
  const companiesOwned = Object.keys(portfolio).length

  const currentLevelData = LEVELS[level - 1]
  const nextLevelData = LEVELS[level]
  const levelProgress = nextLevelData
    ? Math.min(1, (netWorth - currentLevelData.requirement) / (nextLevelData.requirement - currentLevelData.requirement))
    : 1

  const interestRate = state.difficulty === 'easy' ? 0.03 : state.difficulty === 'hard' ? 0.01 : 0.02
  const reportCard = calcReportCard(state, netWorth, profitPerTurn)
  const projectedEarnings = profitPerTurn + Math.round(cash * interestRate)

  const endTurnLabel = projectedEarnings > 0
    ? `End Turn ${turn}  →  +${formatMoney(projectedEarnings)}`
    : `End Turn ${turn}`

  const econColor = getEconomyColor(economy.state)

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(150deg, #1D4ED8 0%, #4338CA 55%, #6D28D9 100%)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
        paddingBottom: 20, paddingLeft: 16, paddingRight: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Radial glow accent */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -20,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(124,58,237,0.25)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        {/* Top row: empire name + turn counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
              🏙️ {empireName}
            </span>
            <button
              onClick={onEditName}
              style={{
                background: 'rgba(255,255,255,0.18)', border: 'none',
                color: '#fff', borderRadius: 8,
                width: 28, height: 28, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              ✏️
            </button>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20, padding: '4px 12px',
            fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.9)',
          }}>
            Turn {turn}
          </div>
        </div>

        {/* Net Worth */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
            Empire Value
          </div>
          <div style={{
            fontSize: 38, fontWeight: 900, color: '#FCD34D',
            letterSpacing: '-1px', lineHeight: 1,
            textShadow: '0 2px 20px rgba(252,211,77,0.5)',
            marginBottom: 14,
          }}>
            {formatMoney(netWorth)}
          </div>
        </div>

        {/* Pills row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative' }}>
          {/* Economy pill — tappable */}
          <button
            onClick={onEconomyPillTap}
            style={{
              background: econColor + '30',
              border: `1.5px solid ${econColor}70`,
              borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 800, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {getEconomyLabel(economy.state)}
            <span style={{ fontSize: 10, opacity: 0.7 }}>ⓘ</span>
          </button>

          {/* Cash pill */}
          <div style={{
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 12, fontWeight: 800, color: '#fff',
          }}>
            💵 {formatMoney(cash)}
          </div>

          {/* Profit pill — only if earning */}
          {profitPerTurn > 0 && (
            <div style={{
              background: 'rgba(34,197,94,0.22)',
              border: '1.5px solid rgba(34,197,94,0.45)',
              borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 800, color: '#86EFAC',
            }}>
              +{formatMoney(profitPerTurn)}/turn
            </div>
          )}
        </div>
      </div>

      {/* ── Level Progress Bar ── */}
      <button
        onClick={onShowLevelSheet}
        style={{
          width: '100%', padding: '10px 16px',
          background: '#fff',
          borderBottom: '1px solid #E2E8F0',
          cursor: 'pointer', border: 'none', fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#1D4ED8' }}>
            L{level} · {currentLevelData.name}
          </span>
          {nextLevelData ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
              {formatMoney(nextLevelData.requirement)} to L{level + 1}
            </span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FCD34D' }}>🏆 MAX LEVEL!</span>
          )}
        </div>
        <div style={{ height: 8, background: '#E8EDFB', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.round(levelProgress * 100)}%`,
            background: 'linear-gradient(90deg, #1D4ED8, #7C3AED)',
            borderRadius: 4,
            transition: 'width 0.6s ease',
            boxShadow: '0 0 8px rgba(124,58,237,0.4)',
          }} />
        </div>
      </button>

      {/* ── Stats row ── */}
      {companiesOwned > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: '#fff',
          borderBottom: '1px solid #E2E8F0',
        }}>
          {[
            { label: 'Companies', value: companiesOwned },
            { label: 'Profit/Turn', value: '+' + formatMoney(profitPerTurn) },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '10px 16px',
              borderRight: i === 0 ? '1px solid #E2E8F0' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: i === 1 ? '#16A34A' : '#1E293B', marginTop: 2 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sector tiles + prompts ── */}
      <div style={{ padding: '12px 12px 0' }}>

        {/* Empty state Chip prompt */}
        {companiesOwned === 0 && (
          <div style={{
            background: '#fff',
            border: '1.5px dashed #93C5FD',
            borderRadius: 18, padding: '14px 16px',
            marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 2px 8px rgba(29,78,216,0.06)',
          }}>
            <div style={{ flexShrink: 0 }}>
              <Chip mood="excited" size={52} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#1E293B', marginBottom: 3 }}>
                {state.chipGuideStep === 0 ? 'Tap Consumer Market to start!' : 'Put your $10M to work!'}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', lineHeight: 1.45 }}>
                {state.chipGuideStep === 0
                  ? "Pick a company, hit Buy, and you'll collect profit every turn. Let's go!"
                  : 'Tap a sector below to browse companies and make your first investment.'}
              </div>
            </div>
          </div>
        )}

        {/* Location tutorial — after turn 1, if affordable location exists */}
        {companiesOwned > 0 && state.turn >= 2 && !state.sawLocationTutorial && (() => {
          let tutCo = null, tutCost = 0, tutExtraProfit = 0
          Object.entries(portfolio).forEach(([id, entry]) => {
            if (entry.locations >= 5) return
            const cs = companyStates[id]
            if (!cs) return
            const cost = Math.round(cs.profit * cs.multiplier * 0.15)
            if (cost <= cash && (!tutCo || cost < tutCost)) {
              tutCo = COMPANIES.find(c => c.id === id)
              tutCost = cost
              tutExtraProfit = Math.round(cs.profit * 0.30)
            }
          })
          if (!tutCo) return null
          return (
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
              border: '2px solid #86EFAC',
              borderRadius: 16, padding: '13px 14px',
              marginBottom: 10,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{ flexShrink: 0 }}>
                <Chip mood="excited" size={44} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                  🏗️ Tip: Expand!
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
                  {tutCo.emoji} {tutCo.name} can open a second location for {formatMoney(tutCost)} — adds +{formatMoney(tutExtraProfit)}/turn profit permanently!
                </div>
                <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 600, marginTop: 3 }}>
                  Tap the company → Investment Details to expand.
                </div>
              </div>
              <button
                onClick={onDismissLocationTutorial}
                style={{
                  background: 'none', border: 'none', color: '#9CA3AF',
                  fontSize: 20, cursor: 'pointer', padding: 0, flexShrink: 0, lineHeight: 1,
                }}
              >×</button>
            </div>
          )
        })()}

        {/* Sector tiles */}
        {Object.values(SECTORS).map(sector => {
          const isUnlocked = level >= sector.unlockLevel
          const sectorCycle = sectorCycles[sector.id]
          const sectorState = sectorCycle ? sectorCycle.state : 'normal'
          const preSignal = sectorCycle?.preSignal
          const ownedInSector = Object.keys(portfolio).filter(id => {
            const co = COMPANIES.find(c => c.id === id)
            return co && co.sector === sector.id
          })
          const hasOwned = ownedInSector.length > 0
          const ownedEmojis = ownedInSector.map(id => {
            const co = COMPANIES.find(c => c.id === id)
            return co ? co.emoji : null
          }).filter(Boolean)
          const stateColor = getSectorStateColor(sectorState)

          // Visual style per cycle state
          const tileStyle = (() => {
            if (sectorState === 'boom') return {
              background: `linear-gradient(135deg, #FFFBEB 0%, #FEF9EC 50%, ${sector.color}10 100%)`,
              border: '2px solid #FCD34D',
              boxShadow: '0 4px 20px rgba(252,211,77,0.35)',
              iconBg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              iconBorder: '#FCD34D',
              iconGlow: '0 0 22px rgba(252,211,77,0.7)',
              nameColor: '#92400E',
              animClass: 'sectorBoomPulse',
            }
            if (sectorState === 'downturn') return {
              background: hasOwned ? 'linear-gradient(135deg, #FEF2F2, #fff 70%)' : '#FAFAFA',
              border: '2px solid #FCA5A5',
              boxShadow: '0 1px 6px rgba(239,68,68,0.12)',
              iconBg: '#FEE2E2',
              iconBorder: '#FCA5A5',
              iconGlow: 'none',
              nameColor: '#1E293B',
              opacity: 0.82,
              animClass: null,
            }
            if (preSignal === 'preSlowdown') return {
              background: hasOwned ? `linear-gradient(135deg, ${sector.color}0C, #FFFBEB 70%)` : '#FFFDF5',
              border: `2px solid #FCD34D80`,
              boxShadow: '0 2px 10px rgba(252,211,77,0.15)',
              iconBg: hasOwned ? `linear-gradient(135deg, ${sector.color}35, ${sector.color}18)` : `${sector.color}15`,
              iconBorder: `${sector.color}45`,
              iconGlow: 'none',
              nameColor: '#1E293B',
              animClass: null,
            }
            // Normal / preBoom
            return {
              background: hasOwned ? `linear-gradient(135deg, ${sector.color}0C, #fff 60%)` : '#fff',
              border: `2px solid ${hasOwned ? sector.color : '#E2E8F0'}`,
              boxShadow: hasOwned ? `0 4px 18px ${sector.color}28` : '0 1px 4px rgba(0,0,0,0.04)',
              iconBg: hasOwned ? `linear-gradient(135deg, ${sector.color}35, ${sector.color}18)` : `${sector.color}15`,
              iconBorder: `${sector.color}45`,
              iconGlow: hasOwned ? `0 0 20px ${sector.color}45` : 'none',
              nameColor: '#1E293B',
              animClass: null,
            }
          })()

          if (!isUnlocked) {
            return (
              <div key={sector.id} style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: 16, padding: '14px 16px',
                marginBottom: 10,
                opacity: 0.55,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  🔒
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#374151' }}>
                    {sector.emoji} {sector.name}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', marginTop: 2 }}>
                    Unlocks at {formatMoney(sector.unlockAmount)} net worth
                  </div>
                </div>
              </div>
            )
          }

          return (
            <button
              key={sector.id}
              onClick={() => onSelectSector(sector.id)}
              className={tileStyle.animClass || ''}
              style={{
                width: '100%',
                background: tileStyle.background,
                border: tileStyle.border,
                borderRadius: 16, padding: '14px 16px',
                marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: tileStyle.boxShadow,
                opacity: tileStyle.opacity || 1,
                transition: 'all 0.2s',
              }}
            >
              {/* Sector icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: tileStyle.iconBg,
                border: `2px solid ${tileStyle.iconBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
                boxShadow: tileStyle.iconGlow,
              }}>
                {sectorState === 'boom' ? (
                  <span style={{ filter: 'drop-shadow(0 0 8px rgba(252,211,77,0.8))' }}>{sector.emoji}</span>
                ) : sectorState === 'downturn' ? (
                  <span style={{ filter: 'grayscale(0.5) opacity(0.75)' }}>{sector.emoji}</span>
                ) : sector.emoji}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: tileStyle.nameColor }}>
                    {sector.name}
                  </span>
                  <div style={{
                    fontSize: 10, fontWeight: 900,
                    color: stateColor,
                    background: stateColor + '20',
                    border: `1px solid ${stateColor}40`,
                    padding: '2px 8px', borderRadius: 10,
                    flexShrink: 0,
                  }}>
                    {getSectorCycleBadgeLabel(sectorCycle)}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: sectorState === 'downturn' ? '#9CA3AF' : '#6B7280', fontWeight: 600, lineHeight: 1.4, marginBottom: hasOwned ? 6 : 0 }}>
                  {sector.description}
                </div>

                {/* Owned company emoji row */}
                {hasOwned && ownedEmojis.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {ownedEmojis.map((emoji, i) => (
                      <span key={i} style={{
                        fontSize: 15,
                        background: sectorState === 'downturn' ? '#FEE2E280' : sector.color + '22',
                        borderRadius: 7, padding: '1px 5px',
                        filter: sectorState === 'downturn' ? 'grayscale(0.4)' : 'none',
                      }}>
                        {emoji}
                      </span>
                    ))}
                    <span style={{ fontSize: 11, fontWeight: 800, color: sectorState === 'downturn' ? '#EF4444' : sector.color, marginLeft: 2 }}>
                      {ownedInSector.length} owned
                    </span>
                  </div>
                )}
              </div>

              <div style={{ fontSize: 20, color: '#CBD5E1', flexShrink: 0 }}>›</div>
            </button>
          )
        })}

        {/* ── Empire Report Card ── */}
        {reportCard && (
          <div style={{
            background: reportCard.bg,
            border: `2px solid ${reportCard.color}40`,
            borderRadius: 18, padding: '16px',
            marginTop: 4,
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 58, height: 58, borderRadius: 16, flexShrink: 0,
                background: reportCard.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px ${reportCard.color}50`,
              }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: '#fff' }}>{reportCard.grade}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: reportCard.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Empire Report Card
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1E293B', marginTop: 1 }}>
                  {reportCard.label}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginTop: 1 }}>
                  Score: {reportCard.total} / 100 · tap a category to learn more
                </div>
              </div>
            </div>

            {/* Score breakdown — each row is tappable */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reportCard.breakdown.map(row => {
                const isOpen = expandedCard === row.id
                return (
                  <div key={row.id}>
                    <button
                      onClick={() => setExpandedCard(isOpen ? null : row.id)}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.55)',
                        border: `1px solid ${isOpen ? reportCard.color + '60' : 'rgba(0,0,0,0.07)'}`,
                        borderRadius: 12, padding: '10px 12px',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>{row.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: reportCard.color }}>{row.tip}</span>
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#6B7280', opacity: 0.6 }}>{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.10)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${Math.round((row.score / row.max) * 100)}%`,
                            background: reportCard.color,
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 900, color: reportCard.color, flexShrink: 0 }}>
                          {row.score}/{row.max}
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{
                        background: 'rgba(255,255,255,0.75)',
                        borderRadius: '0 0 12px 12px',
                        padding: '12px 14px',
                        borderLeft: `3px solid ${reportCard.color}50`,
                        marginTop: -2,
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 6, fontStyle: 'italic' }}>
                          📐 {row.formula}
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ flexShrink: 0 }}>
                            <Chip mood={row.score >= 17 ? 'happy' : row.score >= 8 ? 'thinking' : 'worried'} size={40} />
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.55, margin: 0 }}>
                            {row.chipText}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── End Turn Button (floating) ── */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 62px)',
        left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 398,
        zIndex: 110,
      }}>
        {/* Guide tip: step 2 — hit End Turn */}
        {state.chipGuideStep === 2 && companiesOwned > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #16A34A, #22C55E)',
            borderRadius: 12, padding: '10px 14px',
            marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
              Nice buy! Now hit <strong>End Turn</strong> to collect your first profit →
            </div>
          </div>
        )}
        <button
          onClick={onEndTurn}
          style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #16A34A, #22C55E)',
            color: '#fff',
            border: 'none', borderRadius: 16,
            fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(34,197,94,0.45)',
            animation: Object.keys(turnActions).length === 0 ? 'endTurnPulse 2s ease-in-out infinite' : 'none',
            letterSpacing: '0.01em',
          }}
        >
          {endTurnLabel}
        </button>
      </div>

      <style>{`
        @keyframes endTurnPulse {
          0%, 100% { box-shadow: 0 6px 24px rgba(34,197,94,0.45) }
          50% { box-shadow: 0 8px 36px rgba(34,197,94,0.75) }
        }
        @keyframes boomPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(252,211,77,0.35) }
          50%       { box-shadow: 0 6px 32px rgba(252,211,77,0.65) }
        }
        .sectorBoomPulse {
          animation: boomPulse 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
