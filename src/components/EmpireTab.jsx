import React, { useState, useRef, useEffect } from 'react'
import { SECTORS, LEVELS, COMPANIES, BADGES } from '../data/companies.js'
import { formatMoney, calcNetWorth, calcProfitPerTurn, getEconomyLabel, getEconomyColor, getSectorStateColor, calcLocationsMultiplier } from '../game/engine.js'
import Chip from './Chip.jsx'
import { SFX } from '../game/sounds.js'


// ─── Empire Report Card ────────────────────────────────────────────────────────

const START_CAPITAL = 10000000

function calcReportCard(state, netWorth, profitPerTurn) {
  const { portfolio, companyStates, economy, sectorCycles } = state
  const ownedIds = Object.keys(portfolio)
  if (ownedIds.length === 0) return null

  const moic = netWorth / START_CAPITAL
  const growthScore = moic >= 25 ? 25 : moic >= 10 ? 21 : moic >= 5 ? 17 : moic >= 2 ? 12 : moic >= 1.5 ? 8 : Math.max(0, Math.round((moic - 1) * 14))

  const sectors = new Set(ownedIds.map(id => COMPANIES.find(c => c.id === id)?.sector).filter(Boolean))
  const diversScore = sectors.size >= 4 ? 25 : sectors.size === 3 ? 20 : sectors.size === 2 ? 13 : 5

  const effPct = netWorth > 0 ? (profitPerTurn / netWorth) * 100 : 0
  const effScore = effPct >= 8 ? 25 : effPct >= 6 ? 21 : effPct >= 4 ? 17 : effPct >= 2 ? 10 : Math.max(0, Math.round(effPct * 3))

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
  const gradeColors = { A: '#4ADE80', B: '#818CF8', C: '#FCD34D', D: '#FCA5A5', F: 'rgba(255,255,255,0.35)' }

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
    breakdown: [
      { id: 'growth', label: 'Growth',          score: growthScore, max: 25, tip: growthScore >= 17 ? '🟢 Strong' : growthScore >= 8 ? '🟡 Decent' : '🔴 Weak', formula: 'How many times you\'ve multiplied your starting $10M.', chipText: growthChip },
      { id: 'divers', label: 'Diversification', score: diversScore, max: 25, tip: diversScore >= 20 ? '🟢 Strong' : diversScore >= 13 ? '🟡 Decent' : '🔴 Weak', formula: 'Number of different sectors you own companies in.', chipText: diversChip },
      { id: 'profit', label: 'Profit Rate',     score: effScore,   max: 25, tip: effScore >= 17 ? '🟢 Strong' : effScore >= 10 ? '🟡 Decent' : '🔴 Weak', formula: 'Profit per turn ÷ empire value. A higher % means your empire earns more per dollar.', chipText: effChip },
      { id: 'risk',   label: 'Risk Balance',    score: riskScore,  max: 25, tip: riskScore >= 20 ? '🟢 Strong' : riskScore >= 15 ? '🟡 Decent' : '🔴 Weak', formula: 'Checks for anchor companies, cross-sector diversification, and no active downturn exposure.', chipText: riskChip },
    ],
  }
}

function getSectorCycleBadgeLabel(cycle) {
  if (!cycle) return { text: '🟡 Normal', termId: null }
  if (cycle.state === 'boom') return { text: '🟢 Expansion', termId: 'sector_expansion' }
  if (cycle.state === 'downturn') return { text: '🔴 Downturn', termId: 'sector_downturn' }
  if (cycle.preSignal === 'preSlowdown') return { text: '⚠️ Leading Indicator: Downturn', termId: 'leading_indicator' }
  if (cycle.preSignal === 'preBoom') return { text: '🌱 Leading Indicator: Expansion', termId: 'leading_indicator' }
  return { text: '🟡 Normal', termId: null }
}

// ─── useCountUp ───────────────────────────────────────────────────────────────

function useCountUp(value, duration = 750) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = prevRef.current
    prevRef.current = value
    if (from === value) return

    const diff = value - from
    const start = performance.now()

    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + diff * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value])

  return display
}

export default function EmpireTab({
  state,
  onSelectSector,
  onShowLevelSheet,
  onEndTurn,
  onEditName,
  onEconomyPillTap,
  onDismissLocationTutorial,
  onTermTap,
}) {
  const [expandedCard, setExpandedCard] = useState(null)
  const [cascadeParticles, setCascadeParticles] = useState([])
  const [muted, setMuted] = useState(() => SFX.isMuted())
  const sectorTileRefs = useRef({})
  const prevTurnRef = useRef(null)

  function toggleMute() {
    const next = !muted
    SFX.setMuted(next)
    setMuted(next)
  }

  const {
    empireName, turn, cash, portfolio, companyStates,
    economy, sectorCycles, level, turnActions,
  } = state

  // ── Profit cascade: fire when turn advances ──────────────────────────────────
  useEffect(() => {
    if (prevTurnRef.current === null) { prevTurnRef.current = turn; return }
    if (turn === prevTurnRef.current) return
    prevTurnRef.current = turn

    const profits = state.turnProfits
    if (!profits || Object.keys(profits).length === 0) return

    const particles = []
    let delay = 0
    Object.entries(profits).forEach(([companyId, earned]) => {
      if (earned <= 0) return
      const co = COMPANIES.find(c => c.id === companyId)
      if (!co) return
      const tileEl = sectorTileRefs.current[co.sector]
      if (!tileEl) return
      const rect = tileEl.getBoundingClientRect()
      const x = rect.left + rect.width * 0.35 + (Math.random() - 0.5) * 32
      const y = rect.top + rect.height * 0.5
      particles.push({ id: companyId + '-' + turn, label: '+' + formatMoney(earned), x, y, delay })
      delay += 110
    })

    if (particles.length === 0) return
    setCascadeParticles(particles)
    const timer = setTimeout(() => setCascadeParticles([]), particles.length * 110 + 1500)
    return () => clearTimeout(timer)
  }, [turn])

  const netWorth = calcNetWorth(cash, portfolio, companyStates)
  const profitPerTurn = calcProfitPerTurn(portfolio, companyStates)
  const companiesOwned = Object.keys(portfolio).length

  const animNetWorth = useCountUp(netWorth, 900)
  const animCash = useCountUp(cash, 700)
  const animProfitPerTurn = useCountUp(profitPerTurn, 600)

  const currentLevelData = LEVELS[level - 1]
  const nextLevelData = LEVELS[level]
  const levelProgress = nextLevelData
    ? Math.min(1, (netWorth - currentLevelData.requirement) / (nextLevelData.requirement - currentLevelData.requirement))
    : 1

  const reportCard = calcReportCard(state, netWorth, profitPerTurn)
  const projectedEarnings = profitPerTurn

  const endTurnLabel = projectedEarnings > 0
    ? `End Turn ${turn}  →  +${formatMoney(projectedEarnings)}`
    : `End Turn ${turn}`

  const econColor = getEconomyColor(economy.state)

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(150deg, rgba(15,26,61,0.97) 0%, rgba(26,21,96,0.97) 55%, rgba(45,27,105,0.97) 100%)',
        backdropFilter: 'blur(20px)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
        paddingBottom: 20, paddingLeft: 16, paddingRight: 16,
        position: 'sticky', top: 0, zIndex: 20, overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(99,102,241,0.15)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -20,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(124,58,237,0.18)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.3px' }}>
              🏙️ {empireName}
            </span>
            <button
              onClick={onEditName}
              style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
            }}>
              Turn {turn}
            </div>
            <button
              onClick={toggleMute}
              style={{
                background: muted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)',
                border: muted ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.12)',
                color: '#fff', borderRadius: 8,
                width: 28, height: 28, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Net Worth */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
            Empire Value
          </div>
          <div style={{
            fontSize: 38, fontWeight: 900, color: '#FCD34D',
            letterSpacing: '-1px', lineHeight: 1,
            textShadow: '0 2px 24px rgba(252,211,77,0.45)',
            marginBottom: 14,
          }}>
            {formatMoney(animNetWorth)}
          </div>
        </div>

        {/* Pills row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative' }}>
          <button
            onClick={onEconomyPillTap}
            style={{
              background: econColor + '25',
              border: `1.5px solid ${econColor}55`,
              borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 700, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {getEconomyLabel(economy.state)}
            <span style={{ fontSize: 10, opacity: 0.6 }}>ⓘ</span>
          </button>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)',
          }}>
            💵 {formatMoney(animCash)}
          </div>
          {profitPerTurn > 0 && (
            <div style={{
              background: 'rgba(74,222,128,0.15)',
              border: '1.5px solid rgba(74,222,128,0.3)',
              borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 700, color: '#4ADE80',
            }}>
              +{formatMoney(animProfitPerTurn)}/turn
            </div>
          )}
        </div>
      </div>

      {/* ── Level Progress Bar ── */}
      <button
        onClick={onShowLevelSheet}
        style={{
          width: '100%', padding: '10px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          cursor: 'pointer', border: 'none', fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#818CF8' }}>
            L{level} · {currentLevelData.name}
          </span>
          {nextLevelData ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>
              {formatMoney(nextLevelData.requirement)} to L{level + 1}
            </span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FCD34D' }}>🏆 MAX LEVEL!</span>
          )}
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.round(levelProgress * 100)}%`,
            background: 'linear-gradient(90deg, #6366F1, #A78BFA)',
            borderRadius: 4,
            transition: 'width 0.6s ease',
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
          }} />
        </div>
      </button>

      {/* ── Stats row ── */}
      {companiesOwned > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {[
            { label: 'Companies', value: companiesOwned, color: '#E2E8F0' },
            { label: 'Profit/Turn', value: '+' + formatMoney(animProfitPerTurn), color: '#4ADE80' },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '10px 16px',
              borderRight: i === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginTop: 2 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sector tiles + prompts ── */}
      <div style={{ padding: '12px 12px 0' }}>

        {/* Empty state */}
        {companiesOwned === 0 && (
          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1.5px dashed rgba(99,102,241,0.35)',
            borderRadius: 18, padding: '14px 16px',
            marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flexShrink: 0 }}>
              <Chip mood="excited" size={52} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#E2E8F0', marginBottom: 3 }}>
                {state.chipGuideStep === 0 ? 'Tap Consumer Market to start!' : 'Put your $10M to work!'}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', lineHeight: 1.45 }}>
                {state.chipGuideStep === 0
                  ? "Pick a company, hit Buy, and you'll collect profit every turn. Let's go!"
                  : 'Tap a sector below to browse companies and make your first investment.'}
              </div>
            </div>
          </div>
        )}

        {/* Location tutorial */}
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
              background: 'rgba(34,197,94,0.08)',
              border: '1.5px solid rgba(34,197,94,0.25)',
              borderRadius: 16, padding: '13px 14px',
              marginBottom: 10,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{ flexShrink: 0 }}>
                <Chip mood="excited" size={44} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                  🏗️ Tip: Expand!
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>
                  {tutCo.emoji} {tutCo.name} can open a second location for {formatMoney(tutCost)} — adds +{formatMoney(tutExtraProfit)}/turn profit permanently!
                </div>
                <div style={{ fontSize: 12, color: '#4ADE80', fontWeight: 600, marginTop: 3 }}>
                  Tap the company → Investment Details to expand.
                </div>
              </div>
              <button
                onClick={onDismissLocationTutorial}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                  fontSize: 20, cursor: 'pointer', padding: 0, flexShrink: 0, lineHeight: 1,
                }}
              >×</button>
            </div>
          )
        })()}

        {/* Idle cash warning */}
        {companiesOwned > 0 && netWorth > 0 && cash / netWorth > 0.35 && (
          <div style={{
            background: 'rgba(252,211,77,0.07)',
            border: '1.5px solid rgba(252,211,77,0.25)',
            borderRadius: 16, padding: '13px 14px',
            marginBottom: 10,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>💤</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FCD34D', marginBottom: 2 }}>
                {formatMoney(cash)} is sitting idle
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(252,211,77,0.7)', lineHeight: 1.45 }}>
                That's {Math.round((cash / netWorth) * 100)}% of your empire doing nothing. Put it to work!
              </div>
            </div>
          </div>
        )}

        {/* Sector tiles — 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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

            // Compact badge label
            const compactBadge = (() => {
              if (!sectorCycle) return null
              if (sectorState === 'boom') return { text: '🟢 Boom', color: '#4ADE80', termId: 'sector_expansion' }
              if (sectorState === 'downturn') return { text: '🔴 Downturn', color: '#FCA5A5', termId: 'sector_downturn' }
              if (preSignal === 'preSlowdown') return { text: '⚠️ Warning', color: '#FCD34D', termId: 'leading_indicator' }
              if (preSignal === 'preBoom') return { text: '🌱 Rising', color: '#4ADE80', termId: 'leading_indicator' }
              return null
            })()

            const tileStyle = (() => {
              if (sectorState === 'boom') return {
                background: 'rgba(34,197,94,0.08)',
                border: '2px solid rgba(34,197,94,0.35)',
                boxShadow: '0 4px 20px rgba(34,197,94,0.12)',
                nameColor: '#E2E8F0',
                animClass: 'sectorBoomPulse',
              }
              if (sectorState === 'downturn') return {
                background: hasOwned ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.02)',
                border: '2px solid rgba(239,68,68,0.25)',
                boxShadow: 'none',
                nameColor: 'rgba(255,255,255,0.6)',
                opacity: 0.8,
                animClass: null,
              }
              if (preSignal === 'preSlowdown') return {
                background: hasOwned ? 'rgba(252,211,77,0.06)' : 'rgba(255,255,255,0.03)',
                border: '2px solid rgba(252,211,77,0.2)',
                boxShadow: 'none',
                nameColor: '#E2E8F0',
                animClass: null,
              }
              return {
                background: hasOwned ? `linear-gradient(135deg, ${sector.color}12, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${hasOwned ? sector.color + '40' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: hasOwned ? `0 4px 18px ${sector.color}18` : 'none',
                nameColor: '#E2E8F0',
                animClass: null,
              }
            })()

            if (!isUnlocked) {
              return (
                <div key={sector.id} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '14px 12px',
                  opacity: 0.4,
                  display: 'flex', flexDirection: 'column', gap: 8,
                  minHeight: 110,
                }}>
                  <div style={{ fontSize: 28 }}>🔒</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', lineHeight: 1.2 }}>
                      {sector.name}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>
                      {formatMoney(sector.unlockAmount)}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <button
                key={sector.id}
                ref={el => { sectorTileRefs.current[sector.id] = el }}
                onClick={() => onSelectSector(sector.id)}
                className={tileStyle.animClass || ''}
                style={{
                  background: tileStyle.background,
                  border: tileStyle.border,
                  borderRadius: 14, padding: '14px 12px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                  cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left',
                  boxShadow: tileStyle.boxShadow,
                  opacity: tileStyle.opacity || 1,
                  minHeight: 110,
                  transition: 'all 0.2s',
                }}
              >
                {/* Top row: emoji + badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: 30,
                    filter: sectorState === 'boom'
                      ? 'drop-shadow(0 0 8px rgba(34,197,94,0.85))'
                      : sectorState === 'downturn' ? 'grayscale(0.5) opacity(0.65)' : 'none',
                  }}>
                    {sector.emoji}
                  </span>
                  {compactBadge && (
                    <button
                      onClick={e => { e.stopPropagation(); compactBadge.termId && onTermTap && onTermTap(compactBadge.termId) }}
                      style={{
                        fontSize: 9, fontWeight: 800,
                        color: compactBadge.color,
                        background: compactBadge.color + '18',
                        border: `1px solid ${compactBadge.color}35`,
                        padding: '2px 6px', borderRadius: 8,
                        cursor: compactBadge.termId ? 'pointer' : 'default',
                        fontFamily: 'inherit', whiteSpace: 'nowrap',
                      }}
                    >
                      {compactBadge.text}
                    </button>
                  )}
                </div>

                {/* Name */}
                <div style={{ fontSize: 13, fontWeight: 700, color: tileStyle.nameColor, lineHeight: 1.2, flex: 1 }}>
                  {sector.name}
                </div>

                {/* Owned company emojis */}
                {hasOwned ? (
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                    {ownedEmojis.map((emoji, i) => (
                      <span key={i} style={{
                        fontSize: 14,
                        background: sectorState === 'downturn' ? 'rgba(239,68,68,0.15)' : sector.color + '20',
                        borderRadius: 6, padding: '1px 4px',
                        filter: sectorState === 'downturn' ? 'grayscale(0.4)' : 'none',
                      }}>
                        {emoji}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>
                    Tap to browse →
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Empire Report Card ── */}
        {reportCard && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: `2px solid ${reportCard.color}30`,
            borderRadius: 18, padding: '16px',
            marginTop: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 58, height: 58, borderRadius: 16, flexShrink: 0,
                background: reportCard.color + '25',
                border: `2px solid ${reportCard.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 18px ${reportCard.color}30`,
              }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: reportCard.color }}>{reportCard.grade}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: reportCard.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Empire Report Card
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#E2E8F0', marginTop: 1 }}>
                  {reportCard.label}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
                  Score: {reportCard.total} / 100 · tap a category to learn more
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reportCard.breakdown.map(row => {
                const isOpen = expandedCard === row.id
                return (
                  <div key={row.id}>
                    <button
                      onClick={() => setExpandedCard(isOpen ? null : row.id)}
                      style={{
                        width: '100%',
                        background: isOpen ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isOpen ? reportCard.color + '40' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 12, padding: '10px 12px',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{row.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: reportCard.color }}>{row.tip}</span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${Math.round((row.score / row.max) * 100)}%`,
                            background: reportCard.color,
                            transition: 'width 0.5s ease',
                            boxShadow: `0 0 8px ${reportCard.color}60`,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: reportCard.color, flexShrink: 0 }}>
                          {row.score}/{row.max}
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '0 0 12px 12px',
                        padding: '12px 14px',
                        borderLeft: `3px solid ${reportCard.color}40`,
                        marginTop: -2,
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginBottom: 6, fontStyle: 'italic' }}>
                          📐 {row.formula}
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ flexShrink: 0 }}>
                            <Chip mood={row.score >= 17 ? 'happy' : row.score >= 8 ? 'thinking' : 'worried'} size={40} />
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: 0 }}>
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

      {/* ── End Turn Button ── */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 62px)',
        left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 398,
        zIndex: 110,
      }}>
        {state.chipGuideStep === 2 && companiesOwned > 0 && (
          <div style={{
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 12, padding: '10px 14px',
            marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80', lineHeight: 1.4 }}>
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
            boxShadow: '0 6px 28px rgba(34,197,94,0.4)',
            animation: Object.keys(turnActions).length === 0 ? 'endTurnPulse 2s ease-in-out infinite' : 'none',
            letterSpacing: '0.01em',
          }}
        >
          {endTurnLabel}
        </button>
      </div>

      <style>{`
        @keyframes endTurnPulse {
          0%, 100% { box-shadow: 0 6px 28px rgba(34,197,94,0.40) }
          50%       { box-shadow: 0 8px 40px rgba(34,197,94,0.70) }
        }
        @keyframes boomPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(34,197,94,0.12) }
          50%       { box-shadow: 0 6px 32px rgba(34,197,94,0.28) }
        }
        .sectorBoomPulse { animation: boomPulse 2.2s ease-in-out infinite; }
        @keyframes profitFloat {
          0%   { transform: translateY(0)    scale(0.75); opacity: 0; }
          12%  { transform: translateY(-10px) scale(1.12); opacity: 1; }
          75%  { transform: translateY(-72px) scale(1);    opacity: 1; }
          100% { transform: translateY(-92px) scale(0.95); opacity: 0; }
        }
      `}</style>

      {/* ── Profit cascade overlay ── */}
      {cascadeParticles.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 500 }}>
          {cascadeParticles.map(p => (
            <div
              key={p.id}
              style={{
                position: 'fixed',
                left: p.x,
                top: p.y,
                transform: 'translateX(-50%)',
                color: '#4ADE80',
                fontSize: 16,
                fontWeight: 900,
                fontFamily: 'Space Grotesk, sans-serif',
                letterSpacing: '-0.3px',
                textShadow: '0 2px 14px rgba(74,222,128,0.8)',
                animation: `profitFloat 1.35s ease-out ${p.delay}ms both`,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
