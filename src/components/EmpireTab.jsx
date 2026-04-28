import React from 'react'
import { SECTORS, LEVELS, COMPANIES, BADGES } from '../data/companies.js'
import { formatMoney, calcNetWorth, calcProfitPerTurn, getEconomyLabel, getEconomyColor, getSectorStateColor } from '../game/engine.js'
import Chip from './Chip.jsx'

// ─── Chip Pick Algorithm ───────────────────────────────────────────────────────

function getChipPick(portfolio, companyStates, cash, economy, sectorCycles, level) {
  const candidates = COMPANIES.filter(co => {
    if (portfolio[co.id]) return false
    if (co.badge === 'fadingOut') return false
    const sector = SECTORS[co.sector]
    if (!sector || level < sector.unlockLevel) return false
    const cs = companyStates[co.id] || { profit: co.baseProfit, multiplier: co.baseMultiplier }
    return Math.round(cs.profit * cs.multiplier) <= cash
  })
  if (candidates.length === 0) return null

  const scored = candidates.map(co => {
    const cs = companyStates[co.id] || { profit: co.baseProfit, multiplier: co.baseMultiplier }
    const value = Math.round(cs.profit * cs.multiplier)
    const cycle = sectorCycles[co.sector]
    let score = 0

    if (economy.state === 'slowdown' || economy.preSignal === 'preSlowdown') {
      if (co.badge === 'safeBet')      score += 30
      else if (co.badge === 'steadyGrower') score += 20
      else if (co.badge === 'highRisk' || co.badge === 'wildCard') score -= 20
    } else if (economy.state === 'booming') {
      if (co.badge === 'highRisk')     score += 20
      if (co.badge === 'wildCard')     score += 15
      if (co.badge === 'steadyGrower') score += 10
    } else {
      if (co.badge === 'safeBet')      score += 10
      if (co.badge === 'steadyGrower') score += 15
      if (co.badge === 'balanced')     score += 8
    }

    if (cycle?.state === 'boom')               score += 25
    if (cycle?.state === 'downturn')           score -= 30
    if (cycle?.preSignal === 'preSlowdown')    score -= 15
    if (cycle?.preSignal === 'preBoom')        score += 10

    return { co, cs, value, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]
  if (!best) return null

  const cycle = sectorCycles[best.co.sector]
  const badge = BADGES[best.co.badge]?.label || ''
  const sectorName = SECTORS[best.co.sector]?.name || ''
  const payback = best.cs.profit > 0 ? Math.ceil(best.value / best.cs.profit) : null

  let reason
  if (economy.state === 'slowdown' || economy.preSignal === 'preSlowdown') {
    reason = `Economy is struggling — ${best.co.name} is a ${badge} that holds up better than most right now.`
  } else if (cycle?.state === 'boom') {
    reason = `${sectorName} is booming! ${best.co.name} is about to get a big value boost this turn.`
  } else if (economy.state === 'booming' && best.score >= 20) {
    reason = `Economy is hot! ${best.co.name} (${badge}) has serious upside potential in a boom.`
  } else if (payback !== null) {
    reason = `${best.co.name} earns ${formatMoney(Math.round(best.cs.profit))}/turn — pays back in ~${payback} turns!`
  } else {
    reason = `${best.co.name} is a solid ${badge} pick right now.`
  }

  return { co: best.co, value: best.value, reason }
}

// ─── Empire Report Card ────────────────────────────────────────────────────────

function calcReportCard(state, netWorth, profitPerTurn) {
  const { portfolio, companyStates, economy, sectorCycles } = state
  const ownedIds = Object.keys(portfolio)
  if (ownedIds.length === 0) return null

  // 1. Growth: how much has NW grown from $10M start? (0-25)
  const growthRatio = netWorth / 10000000
  const growthScore = Math.min(25, Math.max(0, Math.round((growthRatio - 1) * 4)))

  // 2. Diversification: sectors covered (0-25)
  const sectors = new Set(ownedIds.map(id => COMPANIES.find(c => c.id === id)?.sector).filter(Boolean))
  const diversScore = Math.min(25, sectors.size * 7)

  // 3. Profit efficiency: profit/turn as % of net worth (0-25)
  const effPct = netWorth > 0 ? (profitPerTurn / netWorth) * 100 : 0
  const effScore = Math.min(25, Math.round(effPct * 6))

  // 4. Risk balance: avoid heavy downturn exposure + have some safe names (0-25)
  const inDownturn = ownedIds.filter(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && sectorCycles[co.sector]?.state === 'downturn'
  }).length
  const safeCos = ownedIds.filter(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && co.profSens <= 0.4
  }).length
  let riskScore = 15
  if (safeCos > 0) riskScore += 5
  if (sectors.size >= 2) riskScore += 5
  if (inDownturn > ownedIds.length / 2) riskScore -= 10
  if (economy.state === 'slowdown') {
    const risky = ownedIds.filter(id => { const co = COMPANIES.find(c => c.id === id); return co && co.profSens > 1.0 }).length
    if (risky > safeCos) riskScore -= 5
  }
  riskScore = Math.max(0, Math.min(25, riskScore))

  const total = growthScore + diversScore + effScore + riskScore
  const grade = total >= 80 ? 'A' : total >= 60 ? 'B' : total >= 40 ? 'C' : total >= 20 ? 'D' : 'F'
  const gradeLabels = { A: 'Empire Mogul 🌟', B: 'Smart Investor', C: 'Getting There', D: 'Needs Work', F: 'Just Starting' }
  const gradeColors = { A: '#16A34A', B: '#1D4ED8', C: '#D97706', D: '#DC2626', F: '#9CA3AF' }
  const gradeBg = { A: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', B: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', C: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', D: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)', F: '#F8FAFC' }

  return {
    grade, total,
    label: gradeLabels[grade],
    color: gradeColors[grade],
    bg: gradeBg[grade],
    breakdown: [
      { label: 'Growth',        score: growthScore, max: 25, tip: growthScore < 10 ? 'Grow your net worth faster' : 'Good growth!' },
      { label: 'Diversification', score: diversScore, max: 25, tip: sectors.size < 2 ? 'Spread across sectors' : 'Well diversified!' },
      { label: 'Profit Rate',   score: effScore,    max: 25, tip: effPct < 2 ? 'Earn more per turn' : 'Strong income!' },
      { label: 'Risk Balance',  score: riskScore,   max: 25, tip: riskScore < 15 ? 'Reduce downturn exposure' : 'Balanced portfolio!' },
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
}) {
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
  const chipPick = companiesOwned > 0
    ? getChipPick(portfolio, companyStates, cash, economy, state.sectorCycles, state.level)
    : null
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
            Net Worth
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

        {/* Chip's Pick — shown when you own companies and have an affordable option */}
        {chipPick && (
          <div style={{
            background: 'linear-gradient(135deg, #1E293B, #374151)',
            borderRadius: 16, padding: '13px 14px',
            marginBottom: 10,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ flexShrink: 0, marginTop: -2 }}>
              <Chip mood="excited" size={44} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                🤖 Chip's Pick
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 3 }}>
                {chipPick.co.emoji} {chipPick.co.name} · {formatMoney(chipPick.value)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
                {chipPick.reason}
              </div>
            </div>
          </div>
        )}

        {/* Sector tiles */}
        {Object.values(SECTORS).map(sector => {
          const isUnlocked = level >= sector.unlockLevel
          const sectorCycle = sectorCycles[sector.id]
          const sectorState = sectorCycle ? sectorCycle.state : 'normal'
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
              style={{
                width: '100%',
                background: hasOwned
                  ? `linear-gradient(135deg, ${sector.color}0C, #fff 60%)`
                  : '#fff',
                border: `2px solid ${hasOwned ? sector.color : '#E2E8F0'}`,
                borderRadius: 16, padding: '14px 16px',
                marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: hasOwned
                  ? `0 4px 18px ${sector.color}28`
                  : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s',
              }}
            >
              {/* Sector icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: hasOwned
                  ? `linear-gradient(135deg, ${sector.color}35, ${sector.color}18)`
                  : `${sector.color}15`,
                border: `2px solid ${sector.color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
                boxShadow: hasOwned ? `0 0 20px ${sector.color}45` : 'none',
              }}>
                {sector.emoji}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
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

                <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, lineHeight: 1.4, marginBottom: hasOwned ? 6 : 0 }}>
                  {sector.description}
                </div>

                {/* Owned company emoji row */}
                {hasOwned && ownedEmojis.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {ownedEmojis.map((emoji, i) => (
                      <span key={i} style={{
                        fontSize: 15,
                        background: sector.color + '22',
                        borderRadius: 7, padding: '1px 5px',
                      }}>
                        {emoji}
                      </span>
                    ))}
                    <span style={{ fontSize: 11, fontWeight: 800, color: sector.color, marginLeft: 2 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
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
                  Score: {reportCard.total} / 100
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {reportCard.breakdown.map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{row.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: reportCard.color }}>
                      {row.score}/{row.max} · {row.tip}
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: `${Math.round((row.score / row.max) * 100)}%`,
                      background: reportCard.color,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
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
      `}</style>
    </div>
  )
}
