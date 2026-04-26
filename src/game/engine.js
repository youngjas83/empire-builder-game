import { COMPANIES, LEVELS } from '../data/companies.js'
import { generateNews } from '../data/news.js'

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

export const INTEREST_RATES = {
  easy:   0.03,
  normal: 0.02,
  hard:   0.01,
}

export const WILD_CARD_PROBS = {
  easy:   0.20,
  normal: 0.12,
  hard:   0.08,
}

export const SETBACK_PROBS = {
  hard: 0.10,
}

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
    consumer:   { state: 'normal', turnsLeft: 4 },
    realEstate: { state: 'normal', turnsLeft: 4 },
  }
  const firstNews = generateNews(economy, sectorCycles, [], 1)

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
    const sectorState = sectorCycles[co.sector]
    if (sectorState) {
      const sectRates = SECTOR_RATES[sectorState.state] || SECTOR_RATES.normal
      cs.profit = cs.profit * (1 + sectRates.profit * co.profSens)
      cs.multiplier = cs.multiplier * (1 + sectRates.mult * co.multSens)
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
  const updatedPortfolio = JSON.parse(JSON.stringify(portfolio))
  Object.keys(updatedPortfolio).forEach(id => {
    const entry = updatedPortfolio[id]
    const cs = companyStates[id]
    if (!cs) return
    const locMult = calcLocationsMultiplier(entry.locations)
    const earned = Math.round(cs.profit * locMult)
    entry.profitsCollected = (entry.profitsCollected || 0) + earned
    totalProfit += earned
  })
  cash = cash + totalProfit

  // 3. Apply cash interest
  const interestRate = INTEREST_RATES[difficulty] || INTEREST_RATES.normal
  const interestEarned = Math.round(cash * interestRate)
  cash = cash + interestEarned

  // Track total earned this turn (profits + interest) for the earn animation
  const earnedThisTurn = totalProfit + interestEarned

  // 4. Advance economy cycle
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
  let wildCard = null
  const ownedIds = Object.keys(updatedPortfolio)
  if (ownedIds.length > 0) {
    const wcProb = WILD_CARD_PROBS[difficulty] || WILD_CARD_PROBS.normal

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
      // Apply wild card effect immediately to this turn's profit (bonus)
      const wcBonus = Math.round(companyStates[targetId].profit * 0.25)
      cash += wcBonus
      if (updatedPortfolio[targetId]) {
        updatedPortfolio[targetId].profitsCollected += wcBonus
      }
    } else if (difficulty === 'hard') {
      // Check for setbacks on risky companies
      const riskyOwned = ownedIds.filter(id => {
        const co = COMPANIES.find(c => c.id === id)
        return co && co.profSens > 1.0
      })
      if (riskyOwned.length > 0 && Math.random() < SETBACK_PROBS.hard) {
        const targetId = riskyOwned[Math.floor(Math.random() * riskyOwned.length)]
        const co = COMPANIES.find(c => c.id === targetId)
        wildCard = {
          type: 'setback',
          companyId: targetId,
          companyName: co ? co.name : targetId,
          companyEmoji: co ? co.emoji : '🏢',
          effect: -0.30,
          text: getSetbackText(targetId, co),
        }
        const penalty = Math.round(companyStates[targetId].profit * 0.30)
        cash = Math.max(0, cash - penalty)
      }
    }
  }

  // 7. Next turn's news
  const nextTurn = turn + 1
  const newNews = generateNews(
    newEconomy,
    newSectorCycles,
    Object.keys(updatedPortfolio),
    nextTurn
  )

  // 8. Net worth + level
  const newNetWorth = calcNetWorth(cash, updatedPortfolio, companyStates)
  const newNetWorthHistory = [...netWorthHistory.slice(-19), newNetWorth]
  const newLevel = calcLevel(newNetWorth)
  const justLeveledUp = newLevel > state.level ? newLevel : null

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
    showNewsModal: !wildCard,
    wildCard,
    showWildCard: !!wildCard,
    level: newLevel,
    justLeveledUp,
    earnedThisTurn,
    showEarnAnimation: earnedThisTurn > 0,
    phase: newNetWorth >= 1000000000 ? 'win' : 'game',
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
  const price = currentValue

  if (state.cash < price) return state
  if (state.portfolio[companyId]) return state

  const newPortfolio = {
    ...state.portfolio,
    [companyId]: {
      locations: 1,
      purchasePrice: price,
      profitsCollected: 0,
      purchaseTurn: state.turn,
    },
  }

  return {
    ...state,
    cash: state.cash - price,
    portfolio: newPortfolio,
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

// ─── Wild Card Text ───────────────────────────────────────────────────────────

const WILD_CARD_TEXTS = {
  burgerblast: "BurgerBlast goes VIRAL on TikTok — lines stretching around the block!",
  novadrip: "NovaDrip collab drops and sells out in 90 seconds flat!",
  glowlab: "Celebrity mega-endorsement for GlowLab — subscriptions exploding!",
  freshmart: "FreshMart named 'Best Value Store' — customer surge incoming!",
  toycraze: "ToyCraze featured in blockbuster movie — demand going insane!",
  pixelwear: "PixelWear worn at major esports championship — instant sellout!",
  skyflats: "SkyFlats wins Best Apartment award — waiting list just doubled!",
  megamall: "MegaMall viral pop-up event drives biggest foot traffic in years!",
  storesafe: "StoreSafe opens premium downtown location to packed waiting list!",
  towerone: "TowerOne lands massive 5-year lease with Fortune 500 company!",
  warehousex: "WarehouseX wins 10-year contract with nation's biggest retailer!",
  sunvilla: "SunVilla voted #1 Resort — bookings up 200% overnight!",
}

const SETBACK_TEXTS = {
  novadrip: "NovaDrip hit by safety lawsuit — sales grinding to a halt!",
  toycraze: "ToyCraze trend reverses overnight — stores can't give them away!",
  pixelwear: "PixelWear latest drop gets roasted online — returns flooding in!",
  megamall: "MegaMall anchor tenant just announced store closure!",
  towerone: "TowerOne major tenant announces work-from-home permanently!",
}

function getWildCardText(id, co) {
  return WILD_CARD_TEXTS[id] || `${co ? co.name : id} has an amazing turn — profits surge 25%!`
}

function getSetbackText(id, co) {
  return SETBACK_TEXTS[id] || `${co ? co.name : id} hits an unexpected obstacle — tough turn!`
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
  if (state === 'booming') return '🟢 Booming'
  if (state === 'slowdown') return '🔴 Slowdown'
  return '🟡 Steady'
}

export function getSectorStateLabel(state) {
  if (state === 'boom') return '🟢 Boom'
  if (state === 'downturn') return '🔴 Downturn'
  return '🟡 Normal'
}

export function getSectorStateColor(state) {
  if (state === 'boom') return '#22C55E'
  if (state === 'downturn') return '#EF4444'
  return '#EAB308'
}
