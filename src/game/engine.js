import { COMPANIES, LEVELS, SECTORS } from '../data/companies.js'
import { generateNews } from '../data/news.js'

// ─── Achievements Catalog (used by ChipTab trophy shelf) ─────────────────────

export const ACHIEVEMENTS_CATALOG = [
  { id: 'first_buy',      label: '🏆 First Investment',       desc: 'Buy your very first company' },
  { id: 'first_million',  label: '💰 First Million',           desc: 'Reach $1M empire value' },
  { id: 'net_10m',        label: '💰 $10M Empire',             desc: 'Reach $10M empire value' },
  { id: 'net_50m',        label: '🏦 $50M Empire',             desc: 'Reach $50M empire value' },
  { id: 'net_100m',       label: '💎 $100M Empire',            desc: 'Reach $100M empire value' },
  { id: 'net_500m',       label: '👑 $500M Empire',            desc: 'Reach $500M empire value' },
  { id: 'five_companies', label: '🏙️ 5 Companies',             desc: 'Own 5 companies at once' },
  { id: 'ten_companies',  label: '🏢 10 Companies',            desc: 'Own 10 companies at once' },
  { id: 'first_location', label: '🏗️ First Branch',            desc: 'Open your first branch location' },
  { id: 'max_locations',  label: '🌆 Full Expansion',          desc: 'Grow one company to 5 locations' },
  { id: 'three_sectors',  label: '🌐 Diversified Investor',   desc: 'Own companies in 3+ sectors' },
  { id: 'big_earner',     label: '💵 $1M Profit Turn',         desc: 'Earn $1M+ from companies in one turn' },
  { id: 'survived_down',  label: '💪 Downturn Survivor',       desc: 'Survive a full sector downturn' },
  { id: 'flash_hunter',   label: '⚡ Flash Sale Hunter',       desc: 'Buy a company during a flash sale' },
  { id: 'streak_5',       label: '🔥 5-Turn Streak',           desc: 'Grow profits 5 turns in a row' },
  { id: 'streak_10',      label: '🔥🔥 10-Turn Streak',        desc: 'Grow profits 10 turns in a row' },
  { id: 'level_2',        label: '🎭 Entertainment Unlocked', desc: 'Reach Level 2' },
]

// ─── Constants ───────────────────────────────────────────────────────────────

export const ECONOMY_RATES = {
  booming:  { profit: 0.05,  mult: 0.02 },
  steady:   { profit: 0.00,  mult: 0.00 },
  slowdown: { profit: -0.10, mult: -0.03 },
}

export const SECTOR_RATES = {
  boom:     { profit: 0.12,  mult: 0.03 },
  normal:   { profit: 0.00,  mult: 0.00 },
  downturn: { profit: -0.15, mult: -0.05 },
}

export const WILD_CARD_PROBS = {
  easy:   0.20,
  normal: 0.12,
  hard:   0.08,
}

export const SETBACK_PROBS = {
  hard: 0.10,
}

export const VICTOR_SNATCH_PROB = 0.40

// ─── Initial State ────────────────────────────────────────────────────────────

export function createInitialCompanyStates() {
  const states = {}
  COMPANIES.forEach(co => {
    states[co.id] = {
      profit: co.baseProfit,
      multiplier: co.baseMultiplier,
      profitHistory: [],
    }
  })
  return states
}

export function createInitialGameState(empireName, difficulty) {
  const companyStates = createInitialCompanyStates()
  const economy = { state: 'steady', turnsLeft: 4, preSignal: null }
  const sectorCycles = {
    consumer:      { state: 'normal', turnsLeft: 4 },
    realEstate:    { state: 'normal', turnsLeft: 4 },
    entertainment: { state: 'normal', turnsLeft: 4 },
    tech:          { state: 'normal', turnsLeft: 4 },
  }
  const firstNews = generateNews(economy, sectorCycles, [], 1, null, 1)

  return {
    phase: 'game',
    empireName,
    difficulty,
    turn: 1,
    cash: 10000000,
    portfolio: {},
    companyStates,
    netWorthHistory: [10000000],
    economy,
    sectorCycles,
    turnPhase: 'news',
    currentNews: firstNews,
    showNewsModal: true,
    wildCard: null,
    showWildCard: false,
    turnActions: {},
    level: 1,
    activeTab: 'empire',
    viewingCompany: null,
    viewingCompanyBack: false,
    actionDialog: null,
    badgeModal: null,
    showLevelSheet: false,
    chipSubTab: 'qa',
    chipSearch: '',
    expandedQuestion: null,
    chipMood: 'happy',
    chipMessage: '',
    justLeveledUp: null,
    flashSale: null,
    lastWildCardTurn: 0,
    achievements: [],
    profitStreak: 0,
    lastTurnProfit: 0,
    newAchievement: null,
    billionHit: false,
    showBillionScreen: false,
    billionTurn: null,
    onboardingDismissed: false,
    chipGuideStep: 0,       // 0-3 = active guide, 4 = done
    companyNewsEffects: {}, // { [companyId]: ±0.06 } — applied next resolveEndTurn
    sawLocationTutorial: false,
    crisisEvent: null,
    victorSnatched: null,
  }
}

// ─── Net Worth ────────────────────────────────────────────────────────────────

export function calcNetWorth(cash, portfolio, companyStates) {
  let total = cash
  Object.keys(portfolio).forEach(id => {
    const entry = portfolio[id]
    const state = companyStates[id]
    if (!state) return
    const value = state.profit * state.multiplier
    const locMult = 1 + (entry.locations - 1) * 0.30
    total += value * locMult
  })
  return Math.round(total)
}

export function calcCompanyValue(companyId, companyStates) {
  const state = companyStates[companyId]
  if (!state) return 0
  return Math.round(state.profit * state.multiplier)
}

export function calcLocationsMultiplier(locations) {
  return 1 + (locations - 1) * 0.30
}

export function calcProfitPerTurn(portfolio, companyStates) {
  let total = 0
  Object.keys(portfolio).forEach(id => {
    const entry = portfolio[id]
    const state = companyStates[id]
    if (!state) return
    const locMult = calcLocationsMultiplier(entry.locations)
    total += state.profit * locMult
  })
  return Math.round(total)
}

// ─── Level ────────────────────────────────────────────────────────────────────

export function calcLevel(netWorth) {
  let level = 1
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (netWorth >= LEVELS[i].requirement) {
      level = LEVELS[i].level
      break
    }
  }
  return level
}

// ─── Turn Resolution ──────────────────────────────────────────────────────────

export function resolveEndTurn(state) {
  const { difficulty, portfolio, economy, sectorCycles } = state
  let { cash, companyStates, netWorthHistory, turn } = state

  // Deep copy mutable state
  companyStates = JSON.parse(JSON.stringify(companyStates))

  // 0. Apply companyNews effects from previous turn's news (±6% multiplier)
  const prevEffects = state.companyNewsEffects || {}
  Object.entries(prevEffects).forEach(([id, effect]) => {
    if (companyStates[id]) {
      companyStates[id].multiplier = companyStates[id].multiplier * (1 + effect)
    }
  })

  // 1. Apply valuation layers to each company
  COMPANIES.forEach(co => {
    const cs = companyStates[co.id]
    if (!cs) return

    // Layer 0: Long-term drift (profit only, always applied)
    cs.profit = cs.profit * (1 + co.longTermDrift)

    // Layer 1: Economy cycle
    const econRates = ECONOMY_RATES[economy.state] || ECONOMY_RATES.steady
    cs.profit = cs.profit * (1 + econRates.profit * co.profSens)
    cs.multiplier = cs.multiplier * (1 + econRates.mult * co.multSens)

    // Layer 2: Sector cycle
    const sectorCycleData = sectorCycles[co.sector]
    if (sectorCycleData) {
      const sectRates = SECTOR_RATES[sectorCycleData.state] || SECTOR_RATES.normal
      cs.profit = cs.profit * (1 + sectRates.profit * co.profSens)
      cs.multiplier = cs.multiplier * (1 + sectRates.mult * co.multSens)
    }

    // Layer 2b: Active downturn decay — multiplier bleeds -0.5/turn during sector downturn
    // This creates real exit pressure beyond just reduced growth
    if (sectorCycleData && sectorCycleData.state === 'downturn') {
      cs.multiplier = cs.multiplier - 0.5
    }

    // Clamp profit to floor (10% of base)
    const profFloor = co.baseProfit * 0.10
    cs.profit = Math.max(cs.profit, profFloor)

    // Clamp multiplier to floor/ceiling
    cs.multiplier = Math.max(co.multFloor, Math.min(co.multCeiling, cs.multiplier))

    // Update profit history
    cs.profitHistory = [...(cs.profitHistory || []).slice(-8), Math.round(cs.profit)]
  })

  // 2. Collect profits from owned companies
  let totalProfit = 0
  const turnProfits = {}
  const updatedPortfolio = JSON.parse(JSON.stringify(portfolio))
  Object.keys(updatedPortfolio).forEach(id => {
    const entry = updatedPortfolio[id]
    const cs = companyStates[id]
    if (!cs) return
    const locMult = calcLocationsMultiplier(entry.locations)
    const earned = Math.round(cs.profit * locMult)
    entry.profitsCollected = (entry.profitsCollected || 0) + earned
    turnProfits[id] = earned
    totalProfit += earned
  })
  cash = cash + totalProfit

  // Track total earned this turn for the earn animation
  const earnedThisTurn = totalProfit

  // 3. Advance economy cycle
  const newEconomy = advanceCycle(economy, ['booming', 'steady', 'slowdown'])

  // 5. Advance sector cycles
  const newSectorCycles = {}
  Object.keys(sectorCycles).forEach(sectorId => {
    newSectorCycles[sectorId] = advanceCycle(
      sectorCycles[sectorId],
      ['boom', 'normal', 'downturn']
    )
  })

  // 6. Wild card / setback
  // Wild cards guaranteed every 3–5 turns; base prob scales with time since last
  let wildCard = null
  const ownedIds = Object.keys(updatedPortfolio)
  const lastWildCardTurn = state.lastWildCardTurn || 0
  const turnsSinceWC = turn - lastWildCardTurn
  let newLastWildCardTurn = lastWildCardTurn

  if (ownedIds.length > 0) {
    const baseProb = WILD_CARD_PROBS[difficulty] || WILD_CARD_PROBS.normal
    // Ramp up probability: guaranteed after 5 turns, high after 4, elevated after 3
    const wcProb = turnsSinceWC >= 5 ? 1.0
      : turnsSinceWC >= 4 ? 0.70
      : turnsSinceWC >= 3 ? 0.40
      : baseProb

    if (Math.random() < wcProb) {
      const targetId = ownedIds[Math.floor(Math.random() * ownedIds.length)]
      const co = COMPANIES.find(c => c.id === targetId)
      wildCard = {
        type: 'wildCard',
        companyId: targetId,
        companyName: co ? co.name : targetId,
        companyEmoji: co ? co.emoji : '🏢',
        effect: 0.25,
        text: getWildCardText(targetId, co),
      }
      const wcBonus = Math.round(companyStates[targetId].profit * 0.25)
      cash += wcBonus
      if (updatedPortfolio[targetId]) {
        updatedPortfolio[targetId].profitsCollected += wcBonus
      }
      newLastWildCardTurn = turn
    } else if (difficulty === 'hard') {
      const riskyOwned = ownedIds.filter(id => {
        const co = COMPANIES.find(c => c.id === id)
        return co && co.profSens > 1.0
      })
      if (riskyOwned.length > 0 && Math.random() < SETBACK_PROBS.hard) {
        const targetId = riskyOwned[Math.floor(Math.random() * riskyOwned.length)]
        const co = COMPANIES.find(c => c.id === targetId)
        const currentValue = Math.round(companyStates[targetId].profit * companyStates[targetId].multiplier)

        const adversityRoll = Math.random()
        let effectType, effect, text, fineAmount

        if (adversityRoll < 0.40) {
          // Earnings drain (original)
          effectType = 'earningsDrain'
          effect = -0.30
          const penalty = Math.round(companyStates[targetId].profit * 0.30)
          cash = Math.max(0, cash - penalty)
          text = getSetbackText(targetId, co)
        } else if (adversityRoll < 0.70) {
          // Valuation drop — permanent multiplier hit
          effectType = 'valuationDrop'
          effect = -0.15
          const floor = co ? co.multFloor : 1
          companyStates[targetId].multiplier = Math.max(floor, companyStates[targetId].multiplier * 0.85)
          text = getValuationDropText(targetId, co)
        } else {
          // Emergency fine — cash penalty = 8% of company value
          effectType = 'emergencyFine'
          effect = -0.08
          fineAmount = Math.round(currentValue * 0.08)
          cash = Math.max(0, cash - fineAmount)
          text = getEmergencyFineText(targetId, co)
        }

        wildCard = {
          type: 'setback',
          effectType,
          companyId: targetId,
          companyName: co ? co.name : targetId,
          companyEmoji: co ? co.emoji : '🏢',
          effect,
          text,
          ...(fineAmount !== undefined && { fineAmount }),
        }
        newLastWildCardTurn = turn
      }
    }
  }

  // 6b. Crisis events — only if no wild card fired, player owns a risky company
  let crisisEvent = null
  if (!wildCard && ownedIds.length > 0) {
    const riskyOwned = ownedIds.filter(id => {
      const co = COMPANIES.find(c => c.id === id)
      return co && (co.badge === 'highRisk' || co.badge === 'wildCard')
    })
    if (riskyOwned.length > 0 && Math.random() < 0.10) {
      const targetId = riskyOwned[Math.floor(Math.random() * riskyOwned.length)]
      const co = COMPANIES.find(c => c.id === targetId)
      const currentValue = Math.round(companyStates[targetId].profit * companyStates[targetId].multiplier)
      const payAmount = Math.round(currentValue * 0.07)
      crisisEvent = {
        companyId: targetId,
        companyName: co ? co.name : targetId,
        companyEmoji: co ? co.emoji : '🏢',
        payAmount,
        penaltyPct: 0.20,
        text: getCrisisText(targetId, co),
      }
    }
  }

  // 6c. Victor flash sale snatch (hard mode only)
  // Fires when a flash sale was visible this turn and player didn't buy it
  let victorSnatched = null
  if (
    difficulty === 'hard' &&
    state.flashSale &&
    !updatedPortfolio[state.flashSale.companyId] &&
    Math.random() < VICTOR_SNATCH_PROB
  ) {
    const vco = COMPANIES.find(c => c.id === state.flashSale.companyId)
    victorSnatched = {
      companyId: state.flashSale.companyId,
      companyName: vco ? vco.name : state.flashSale.companyId,
      companyEmoji: vco ? vco.emoji : '🏢',
    }
  }

  // 7. Flash sale management
  // If Victor snatched the current sale, treat it as gone before decrement
  let flashSale = (victorSnatched ? null : state.flashSale) || null
  let newFlashSale = flashSale ? { ...flashSale, turnsLeft: flashSale.turnsLeft - 1 } : null
  if (newFlashSale && newFlashSale.turnsLeft <= 0) newFlashSale = null

  // 8% chance to start a new flash sale when none is active
  if (!newFlashSale && Math.random() < 0.08) {
    const eligible = COMPANIES.filter(co =>
      !updatedPortfolio[co.id] && co.badge !== 'fadingOut' &&
      (SECTORS[co.sector]?.unlockLevel ?? 99) <= newLevel
    )
    if (eligible.length > 0) {
      const target = eligible[Math.floor(Math.random() * eligible.length)]
      newFlashSale = { companyId: target.id, turnsLeft: 2, discount: 0.20 }
    }
  }

  // 8. Net worth + level (must come before news so newLevel is defined)
  const newNetWorth = calcNetWorth(cash, updatedPortfolio, companyStates)
  const newNetWorthHistory = [...netWorthHistory.slice(-19), newNetWorth]
  const newLevel = calcLevel(newNetWorth)
  const justLeveledUp = newLevel > state.level ? newLevel : null

  // 9. Next turn's news + extract ±6% companyNews effects
  const nextTurn = turn + 1
  const newNews = generateNews(
    newEconomy,
    newSectorCycles,
    Object.keys(updatedPortfolio),
    nextTurn,
    newFlashSale,
    newLevel
  )
  const newCompanyNewsEffects = {}
  newNews.headlines.forEach(h => {
    if (h.tier === 'companyNews' && h.companyId && h.sentiment) {
      if (h.sentiment === 'positive') newCompanyNewsEffects[h.companyId] = 0.06
      else if (h.sentiment === 'negative') newCompanyNewsEffects[h.companyId] = -0.06
    }
  })

  // 10. Streak + achievements
  const prevStreak = state.profitStreak || 0
  const newStreak = totalProfit > (state.lastTurnProfit || 0) ? prevStreak + 1 : 0
  const earnedAchievements = state.achievements || []
  let newAchievement = null
  const ACHIEVEMENTS = [
    { id: 'first_buy',      label: '🏆 First Investment!',          check: () => Object.keys(updatedPortfolio).length === 1 && Object.keys(state.portfolio).length === 0 },
    { id: 'first_million',  label: '💰 First Million Earned!',      check: () => newNetWorth >= 1000000 && state.netWorthHistory[0] < 1000000 },
    { id: 'five_companies', label: '🏙️ 5 Companies!',               check: () => Object.keys(updatedPortfolio).length >= 5 },
    { id: 'first_location', label: '🏗️ First Branch Opened!',       check: () => Object.values(updatedPortfolio).some(e => e.locations > 1) && Object.values(state.portfolio).every(e => e.locations === 1) },
    { id: 'streak_5',       label: '🔥 5-Turn Profit Streak!',      check: () => newStreak === 5 },
    { id: 'streak_10',      label: '🔥🔥 10-Turn Profit Streak!',   check: () => newStreak === 10 },
    { id: 'survived_down',  label: '💪 Survived a Downturn!',       check: () => Object.values(newSectorCycles).some(c => c.state !== 'downturn') && Object.values(sectorCycles).some(c => c.state === 'downturn') },
    { id: 'flash_hunter',   label: '⚡ Flash Sale Hunter!',         check: () => state.turnActions && Object.values(state.turnActions).includes('buy') && state.flashSale },
    { id: 'level_2',        label: '🎭 Entertainment Unlocked!',    check: () => justLeveledUp === 2 },
    { id: 'net_100m',       label: '💎 $100M Empire!',              check: () => newNetWorth >= 100000000 && (state.netWorthHistory.slice(-1)[0] || 0) < 100000000 },
    { id: 'net_500m',       label: '👑 $500M Empire!',              check: () => newNetWorth >= 500000000 && (state.netWorthHistory.slice(-1)[0] || 0) < 500000000 },
    // New achievements
    { id: 'net_10m',        label: '💰 $10M Empire!',               check: () => newNetWorth >= 10000000 && (state.netWorthHistory.slice(-1)[0] || 0) < 10000000 },
    { id: 'net_50m',        label: '🏦 $50M Empire!',               check: () => newNetWorth >= 50000000 && (state.netWorthHistory.slice(-1)[0] || 0) < 50000000 },
    { id: 'big_earner',     label: '💵 $1M Profit Turn!',           check: () => totalProfit >= 1000000 && (state.lastTurnProfit || 0) < 1000000 },
    { id: 'three_sectors',  label: '🌐 Diversified Investor!',      check: () => {
        const ns = new Set(Object.keys(updatedPortfolio).map(id => COMPANIES.find(c => c.id === id)?.sector).filter(Boolean))
        const os = new Set(Object.keys(state.portfolio).map(id => COMPANIES.find(c => c.id === id)?.sector).filter(Boolean))
        return ns.size >= 3 && os.size < 3
      }},
    { id: 'max_locations',  label: '🌆 Full Expansion!',            check: () => Object.values(updatedPortfolio).some(e => e.locations >= 5) && Object.values(state.portfolio).every(e => e.locations < 5) },
    { id: 'ten_companies',  label: '🏢 10 Companies!',              check: () => Object.keys(updatedPortfolio).length >= 10 && Object.keys(state.portfolio).length < 10 },
  ]
  for (const ach of ACHIEVEMENTS) {
    if (!earnedAchievements.includes(ach.id) && ach.check()) {
      earnedAchievements.push(ach.id)
      newAchievement = ach
      break // show one at a time
    }
  }

  return {
    ...state,
    cash,
    portfolio: updatedPortfolio,
    companyStates,
    netWorthHistory: newNetWorthHistory,
    economy: newEconomy,
    sectorCycles: newSectorCycles,
    turn: nextTurn,
    turnPhase: 'news',
    turnActions: {},
    currentNews: newNews,
    flashSale: newFlashSale,
    showNewsModal: !wildCard && !crisisEvent,
    wildCard,
    showWildCard: !!wildCard,
    crisisEvent,
    level: newLevel,
    justLeveledUp,
    earnedThisTurn,
    turnProfits,
    showEarnAnimation: earnedThisTurn > 0,
    lastWildCardTurn: newLastWildCardTurn,
    achievements: earnedAchievements,
    profitStreak: newStreak,
    lastTurnProfit: totalProfit,
    newAchievement,
    phase: 'game',
    billionHit: state.billionHit || newNetWorth >= 1000000000,
    showBillionScreen: newNetWorth >= 1000000000 && !state.billionHit,
    billionTurn: (!state.billionHit && newNetWorth >= 1000000000) ? turn : state.billionTurn,
    companyNewsEffects: newCompanyNewsEffects,
    victorSnatched,
  }
}

// ─── Cycle Advancement ────────────────────────────────────────────────────────

function advanceCycle(cycle, states) {
  let { state, turnsLeft, preSignal } = cycle
  turnsLeft = turnsLeft - 1

  if (turnsLeft <= 0) {
    // Transition to next state (always gradual: never skip middle)
    const idx = states.indexOf(state)
    const nextIdx = (idx + 1) % states.length
    state = states[nextIdx]
    turnsLeft = 3 + Math.floor(Math.random() * 3) // 3-5 turns
    preSignal = null
  } else if (turnsLeft <= 2) {
    // Pre-signal upcoming transition
    const idx = states.indexOf(state)
    const nextState = states[(idx + 1) % states.length]
    if (nextState === 'slowdown' || nextState === 'downturn') {
      preSignal = 'preSlowdown'
    } else if (nextState === 'booming' || nextState === 'boom') {
      preSignal = 'preBoom'
    } else {
      preSignal = null
    }
  } else {
    preSignal = null
  }

  return { state, turnsLeft, preSignal }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export function buyCompany(state, companyId) {
  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return state

  const currentValue = calcCompanyValue(companyId, state.companyStates)

  // Apply flash sale discount if this company is on sale
  const flashSale = state.flashSale
  const hasFlashSale = flashSale && flashSale.companyId === companyId
  const price = hasFlashSale ? Math.round(currentValue * (1 - flashSale.discount)) : currentValue

  if (state.cash < price) return state
  if (state.portfolio[companyId]) return state

  const newPortfolio = {
    ...state.portfolio,
    [companyId]: {
      locations: 1,
      purchasePrice: price,
      profitsCollected: 0,
      locationSpend: 0,
      purchaseTurn: state.turn,
    },
  }

  return {
    ...state,
    cash: state.cash - price,
    portfolio: newPortfolio,
    flashSale: hasFlashSale ? null : state.flashSale,
    turnActions: { ...state.turnActions, [companyId]: 'buy' },
    actionDialog: null,
    viewingCompany: null,
  }
}

export function sellCompany(state, companyId) {
  if (!state.portfolio[companyId]) return state

  const entry = state.portfolio[companyId]
  const cs = state.companyStates[companyId]
  const locMult = calcLocationsMultiplier(entry.locations)
  const salePrice = Math.round(cs.profit * cs.multiplier * locMult)

  const newPortfolio = { ...state.portfolio }
  delete newPortfolio[companyId]

  return {
    ...state,
    cash: state.cash + salePrice,
    portfolio: newPortfolio,
    turnActions: { ...state.turnActions, [companyId]: 'sell' },
    actionDialog: null,
    viewingCompany: null,
  }
}

export function openLocation(state, companyId) {
  const entry = state.portfolio[companyId]
  if (!entry || entry.locations >= 5) return state

  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return state

  const cs = state.companyStates[companyId]
  const currentValue = Math.round(cs.profit * cs.multiplier)
  const cost = Math.round(currentValue * co.locationCost)

  if (state.cash < cost) return state

  const newPortfolio = {
    ...state.portfolio,
    [companyId]: {
      ...entry,
      locations: entry.locations + 1,
      locationSpend: (entry.locationSpend || 0) + cost,
    },
  }

  return {
    ...state,
    cash: state.cash - cost,
    portfolio: newPortfolio,
    turnActions: { ...state.turnActions, [companyId]: 'openLocation' },
    actionDialog: null,
  }
}

export function sellLocation(state, companyId) {
  const entry = state.portfolio[companyId]
  if (!entry || entry.locations <= 1) return state  // HQ cannot be sold

  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return state

  const cs = state.companyStates[companyId]
  const currentValue = Math.round(cs.profit * cs.multiplier)
  const salePrice = Math.round(currentValue * co.locationCost)

  return {
    ...state,
    cash: state.cash + salePrice,
    portfolio: {
      ...state.portfolio,
      [companyId]: {
        ...entry,
        locations: entry.locations - 1,
        locationSpend: Math.max(0, (entry.locationSpend || 0) - salePrice),
      },
    },
    turnActions: { ...state.turnActions, [companyId]: 'sellLocation' },
    actionDialog: null,
  }
}

// ─── Wild Card Text ───────────────────────────────────────────────────────────

// Multiple wild card texts per company — picked randomly for variety
const WILD_CARD_TEXTS = {
  burgerblast: [
    "BurgerBlast goes VIRAL on TikTok — lines stretching around the block! 🍔🔥",
    "A famous rapper just said BurgerBlast is his favourite restaurant. Sales SURGING! 🎤",
    "BurgerBlast's secret sauce recipe leaks online — everyone wants to try the real thing! 📱",
  ],
  novadrip: [
    "NovaDrip collab with a mega-celebrity drops and sells out in 90 seconds flat! 👟💥",
    "The most-followed athlete on Instagram wore NovaDrip at the Olympics! 🏅",
    "NovaDrip limited edition sells for 10× retail on resale sites — hype at max! 🔥",
  ],
  glowlab: [
    "Celebrity mega-endorsement for GlowLab — subscriptions exploding overnight! ✨",
    "GlowLab goes viral after a skin transformation video gets 50 million views! 📱",
    "Doctors recommend GlowLab on a prime-time TV show — sales rocket! 📺",
  ],
  freshmart: [
    "FreshMart named 'Best Value Store of the Year' — customer surge incoming! 🛒",
    "Inflation hits hard and everyone rushes to FreshMart to save money! 💰",
    "FreshMart's house-brand foods go viral for being tastier than name brands! 😮",
  ],
  toycraze: [
    "ToyCraze toy featured in a blockbuster movie — demand going absolutely insane! 🎬",
    "The world's most popular kids' YouTuber reviews ToyCraze — INSTANT sellout! 📹",
    "ToyCraze wins 'Toy of the Year' — every kid on the planet wants one! 🏆",
  ],
  pixelwear: [
    "PixelWear worn at a major esports world championship — instant global sellout! 🕹️",
    "The world's top streamer wore PixelWear live to 8 million viewers! 🎮",
    "PixelWear collab with the hottest video game drops — sold out in minutes! ⚡",
  ],
  skyflats: [
    "SkyFlats wins 'Best Luxury Apartment' award — waiting list just doubled! 🏆",
    "A major tech company moves HQ next door — SkyFlats rent premiums surge! 💻",
    "SkyFlats featured in a home design show — enquiries through the roof! 📺",
  ],
  megamall: [
    "MegaMall viral pop-up event drives biggest foot traffic in 5 years! 🎉",
    "A massive concert inside MegaMall goes viral — everyone wants to visit! 🎵",
    "MegaMall launches a food hall that gets a rave review from a top critic! 🍽️",
  ],
  storesafe: [
    "StoreSafe's new smart-lock units sell out — waiting list growing fast! 🔐",
    "City announces major new housing development next to StoreSafe — demand surges! 🏗️",
    "StoreSafe wins government contract for secure document storage! 📁",
  ],
  towerone: [
    "TowerOne lands a massive 10-year lease with a Fortune 500 company! 🏢",
    "TowerOne renovated lobby goes viral — suddenly the coolest office in town! ✨",
    "TowerOne signs a deal to host a major tech conference every year! 💻",
  ],
  warehousex: [
    "WarehouseX wins a 10-year contract with the nation's biggest online retailer! 📦",
    "New automated robots triple WarehouseX efficiency — costs plummet! 🤖",
    "WarehouseX named the safest and fastest shipper — brands rushing to sign! 🚀",
  ],
  sunvilla: [
    "SunVilla voted #1 Resort in the world — bookings up 200% overnight! 🏖️",
    "A celebrity influencer's vacation at SunVilla gets 20 million likes! 📱",
    "SunVilla wins luxury travel award — premium suites booked out for 2 years! 🏆",
  ],
  streamflix: [
    "StreamFlix's new show becomes the most-watched series EVER — subscriptions surge! 🎬",
    "StreamFlix lands an exclusive deal with the world's most famous director! 🎥",
    "StreamFlix raises prices and nobody cancels — loyalty is off the charts! 💪",
  ],
  thunderfc: [
    "Thunder FC wins the Champions League — global merchandise revenue EXPLODES! ⚽🏆",
    "Thunder FC signs the world's highest-paid player — shirt sales go crazy! 👕",
    "Thunder FC's new video game collaboration breaks all records! 🕹️",
  ],
  gameboxstudios: [
    "GameBox Studios' new title breaks ALL sales records in its first 48 hours! 🕹️🔥",
    "GameBox Studios announces a sequel to its biggest franchise — pre-orders insane! 🎮",
    "GameBox Studios' game gets turned into a blockbuster movie deal! 🎬",
  ],
  celebbuzz: [
    "CelebBuzz client goes mega-viral overnight — agency fees quadruple! 🌟💥",
    "CelebBuzz lands three A-list celebrities in one week — hottest agency in town! 🎤",
    "A CelebBuzz client wins a major award — everyone wants the same agency! 🏆",
  ],
  soundwave: [
    "SoundWave's top artist breaks the streaming record — royalty windfall! 🎵🔥",
    "SoundWave announces an exclusive live concert series — tickets sell out instantly! 🎸",
    "SoundWave partners with the world's biggest phone brand — 50M new users! 📱",
  ],
  nightowl: [
    "NightOwl Cinemas lands exclusive summer blockbuster premiere rights! 🍿🎬",
    "NightOwl's new luxury recliner seats go viral — sold-out shows every night! 💺",
    "NightOwl partners with a food delivery app — in-seat ordering surges profits! 🍕",
  ],
}

const SETBACK_TEXTS = {
  novadrip: "NovaDrip hit by a product safety recall — sales grinding to a halt! 😬",
  toycraze: "ToyCraze trend reverses overnight — stores can't give them away! 📉",
  pixelwear: "PixelWear's latest drop gets absolutely roasted online — returns flooding in! 😬",
  megamall: "MegaMall's biggest anchor tenant just announced store closure! 🏪",
  towerone: "TowerOne's major tenant goes fully remote — offices sitting empty! 🏙️",
  gameboxstudios: "GameBox Studios' latest release gets review-bombed — sales collapse! 💥",
  celebbuzz: "CelebBuzz top client caught in a scandal — agency reputation takes a big hit! 😱",
  nightowl: "NightOwl Cinemas loses a major exclusive deal to a streaming service! 😤",
  sunvilla: "SunVilla hit by a tropical storm — resort closed for emergency repairs! ⛈️",
  celebbuzz: "CelebBuzz's biggest star just quit — half the client list is in chaos! 🌪️",
}

const VALUATION_DROP_TEXTS = {
  novadrip:       "Hedge funds dump NovaDrip shares — the hype cycle is fading. P/E ratio craters overnight.",
  toycraze:       "Analysts say the ToyCraze craze is over. Wall Street slashes the valuation in half.",
  sunvilla:       "A damaging travel advisory hits SunVilla's target market. Investors rush for the exit.",
  neuralaim:      "NeuralAI's funding round collapses. Investors panic and the valuation drops hard.",
  chipforge:      "ChipForge's biggest client switches suppliers. Wall Street cuts the price target immediately.",
  gameboxstudios: "Leaked roadmaps show major GameBox Studios delays — investors dump the stock before launch.",
  celebbuzz:      "CelebBuzz loses its top three clients in one week. Valuation crumbles fast.",
}

const EMERGENCY_FINE_TEXTS = {
  novadrip:       "NovaDrip hit with a surprise customs fine on overseas inventory. Lawyers' fees spiralling.",
  toycraze:       "ToyCraze faces an emergency product safety fine. The regulator wants cash — now.",
  sunvilla:       "SunVilla ordered to pay emergency environmental penalties for coastal violations.",
  neuralaim:      "NeuralAI hit with an unexpected data-privacy fine. Pay up or face a government shutdown.",
  chipforge:      "ChipForge's export licence suspended — emergency legal costs to reinstate it.",
  gameboxstudios: "GameBox Studios loses an IP lawsuit. Emergency settlement drains the war chest.",
  celebbuzz:      "CelebBuzz hit with an emergency employment tribunal payout. Costly but unavoidable.",
}

function getValuationDropText(id, co) {
  return VALUATION_DROP_TEXTS[id] || `${co ? co.name : id} faces a sharp valuation downgrade — P/E ratio takes a hit.`
}

function getEmergencyFineText(id, co) {
  return EMERGENCY_FINE_TEXTS[id] || `${co ? co.name : id} hit with an emergency regulatory fine.`
}

function getWildCardText(id, co) {
  const options = WILD_CARD_TEXTS[id]
  if (Array.isArray(options) && options.length > 0) {
    return options[Math.floor(Math.random() * options.length)]
  }
  return `${co ? co.name : id} has an amazing turn — profits surge 25%! 🚀`
}

function getSetbackText(id, co) {
  return SETBACK_TEXTS[id] || `${co ? co.name : id} hits an unexpected obstacle — tough turn!`
}

const CRISIS_TEXTS = {
  novadrip:       ["NovaDrip's lead designer just quit and leaked next season's designs online. Pay for a PR crisis team or the collection tanks.", "A major retailer is threatening to drop NovaDrip over a quality dispute. Settle now or they pull the contract."],
  toycraze:       ["A government safety watchdog is investigating ToyCraze's bestseller. Pay for an independent audit now or face a forced recall.", "A viral video claims a ToyCraze toy is dangerous. Pay to fund a rapid safety review or watch the story spread."],
  pixelwear:      ["PixelWear's supplier was caught using unethical labour. Pay to switch suppliers quietly or face a boycott campaign."],
  sunvilla:       ["A guest at SunVilla is suing over an injury. Settle out of court now or the lawsuit goes public and damages the brand.", "SunVilla's main pool failed a health inspection. Pay to fix it before press finds out or face a public closure order."],
  neuralai:       ["NeuralAI's model produced biased outputs that went viral. Pay for an emergency audit or the media firestorm grows.", "A competitor is accusing NeuralAI of IP theft. Pay legal fees to settle quietly or fight it in public court."],
  chipforge:      ["A batch of ChipForge chips has a defect. Pay for a quiet recall and fix, or let it become a public crisis.", "ChipForge is being investigated for antitrust violations. Pay for legal defence now or face a government freeze."],
  celebbuzz:      ["CelebBuzz's biggest client just got caught in a scandal. Pay for damage control or lose the client and the press goes wild.", "A former employee is threatening to sell inside stories about CelebBuzz clients. Pay for an NDA settlement or risk the fallout."],
  gameboxstudios: ["GameBox Studios shipped a game-breaking bug in their flagship title. Pay for emergency patches or face mass refund demands.", "GameBox Studios is accused of crunch culture. Pay for a staff wellbeing programme or face a union drive."],
}

function getCrisisText(id, co) {
  const options = CRISIS_TEXTS[id]
  if (Array.isArray(options) && options.length > 0) {
    return options[Math.floor(Math.random() * options.length)]
  }
  return `${co ? co.name : id} is facing an unexpected crisis. Act now to contain the damage.`
}

// ─── Format Helpers ───────────────────────────────────────────────────────────

export function formatMoney(n) {
  if (n === null || n === undefined) return '$0'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1000000000) return sign + '$' + Math.round(abs / 1000000000) + 'B'
  if (abs >= 1000000)    return sign + '$' + Math.round(abs / 1000000) + 'M'
  if (abs >= 1000)       return sign + '$' + Math.round(abs / 1000) + 'K'
  return sign + '$' + Math.round(abs)
}

export function formatMoneyPrecise(n) {
  if (n === null || n === undefined) return '$0'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1000000000) {
    const val = (abs / 1000000000).toFixed(1)
    return sign + '$' + val + 'B'
  }
  if (abs >= 1000000) {
    const val = (abs / 1000000).toFixed(1)
    return sign + '$' + val + 'M'
  }
  if (abs >= 1000) return sign + '$' + Math.round(abs / 1000) + 'K'
  return sign + '$' + Math.round(abs)
}

export function getEconomyColor(state) {
  if (state === 'booming') return '#22C55E'
  if (state === 'slowdown') return '#EF4444'
  return '#EAB308'
}

export function getEconomyLabel(state) {
  if (state === 'booming') return '🟢 Expansion'
  if (state === 'slowdown') return '🔴 Recession'
  return '🟡 Stable'
}

export function getSectorStateLabel(state) {
  if (state === 'boom') return '🟢 Expansion'
  if (state === 'downturn') return '🔴 Downturn'
  return '🟡 Normal'
}

export function getSectorStateColor(state) {
  if (state === 'boom') return '#22C55E'
  if (state === 'downturn') return '#EF4444'
  return '#EAB308'
}
