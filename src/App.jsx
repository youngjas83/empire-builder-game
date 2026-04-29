import React, { useState, useEffect } from 'react'
import { COMPANIES, SECTORS } from './data/companies.js'
import {
  createInitialGameState,
  resolveEndTurn,
  buyCompany,
  sellCompany,
  openLocation,
  sellLocation,
  calcNetWorth,
  getEconomyLabel,
  getEconomyColor,
  formatMoney,
} from './game/engine.js'

import SetupFlow from './components/SetupFlow.jsx'
import BottomNav from './components/BottomNav.jsx'
import EmpireTab from './components/EmpireTab.jsx'
import NewsTab from './components/NewsTab.jsx'
import MarketTab from './components/MarketTab.jsx'
import ChipTab from './components/ChipTab.jsx'
import SectorView from './components/SectorView.jsx'
import CompanyCard from './components/CompanyCard.jsx'
import CompanyCardBack from './components/CompanyCardBack.jsx'
import NewsModal from './components/NewsModal.jsx'
import WildCardScreen from './components/WildCardScreen.jsx'
import ActionDialog from './components/ActionDialog.jsx'
import BadgeModal from './components/BadgeModal.jsx'
import LevelSheet from './components/LevelSheet.jsx'
import WinScreen from './components/WinScreen.jsx'
import EarnAnimation from './components/EarnAnimation.jsx'
import { SFX } from './game/sounds.js'
import BuyToast from './components/BuyToast.jsx'
import SmartTradeToast from './components/SmartTradeToast.jsx'
import SectorUnlockScreen from './components/SectorUnlockScreen.jsx'
import AchievementToast from './components/AchievementToast.jsx'
import BillionScreen from './components/BillionScreen.jsx'
import CrisisModal from './components/CrisisModal.jsx'
import TermModal from './components/TermModal.jsx'
import VictorToast from './components/VictorToast.jsx'

// ─── Persistence & Leaderboard ────────────────────────────────────────────────

const SAVE_KEY       = 'empireBuilderSave'
const LEADERBOARD_KEY = 'empireBuilderLeaderboard'

function getSavedGame() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null } catch (e) { return null }
}
function clearSavedGame() {
  try { localStorage.removeItem(SAVE_KEY) } catch (e) {}
}
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || { billion: [], netWorth: [] } } catch (e) { return { billion: [], netWorth: [] } }
}
function saveLeaderboard(lb) {
  try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb)) } catch (e) {}
}
function recordBillionEntry(name, turns) {
  const lb = getLeaderboard()
  lb.billion = [...lb.billion, { name, turns, date: new Date().toLocaleDateString() }]
    .sort((a, b) => a.turns - b.turns)
    .slice(0, 5)
  saveLeaderboard(lb)
}
function recordNetWorthEntry(name, value) {
  if (!value || value <= 10000000) return   // only record if made progress
  const lb = getLeaderboard()
  lb.netWorth = [...lb.netWorth, { name, value, date: new Date().toLocaleDateString() }]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
  saveLeaderboard(lb)
}

// Strip transient UI flags before saving / after restoring
function sanitizeGameState(state) {
  return {
    ...state,
    showNewsModal: false,
    showWildCard: false,
    showEarnAnimation: false,
    showBuyToast: null,
    showBillionScreen: false,
    actionDialog: null,
    badgeModal: null,
    showLevelSheet: false,
    showEconomyModal: false,
    newAchievement: null,
    smartTrade: null,
    showSectorUnlock: null,
    crisisEvent: null,
    termModal: null,
    victorSnatched: null,
    viewingCompany: null,
    viewingCompanyBack: false,
    viewingSector: null,
    activeTab: 'empire',
  }
}

// ─── Initial Setup State ──────────────────────────────────────────────────────

function createSetupState() {
  const hasSave = !!getSavedGame()
  return {
    phase: 'setup',
    setupStep: hasSave ? -1 : 0,   // -1 = landing screen
    chipIntroStep: 0,
    empireName: '',
    selectedDifficulty: 'normal',
    hasSave,
  }
}

// ─── Economy state descriptions ───────────────────────────────────────────────

const ECONOMY_EXPLAIN = {
  booming: {
    emoji: '🚀',
    title: 'Expansion',
    text: "The economy is in an expansion — businesses earn more, people spend more, and company values rise across the board. Cyclical and speculative stocks benefit most. A great time to buy or expand locations.",
    mood: '#22C55E',
  },
  steady: {
    emoji: '⚖️',
    title: 'Stable Economy',
    text: "Neither boom nor bust — the economy is ticking along normally. Earnings and valuations stay close to their baseline. A good time to be selective and look for undervalued companies.",
    mood: '#1D4ED8',
  },
  slowdown: {
    emoji: '📉',
    title: 'Recession',
    text: "The economy is in a recession — businesses earn less, spending drops, and company values fall. Defensive stocks hold up best. Be cautious with new purchases and watch your cyclical holdings closely.",
    mood: '#EF4444',
  },
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState(createSetupState)

  // ── Auto-save ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (appState.phase === 'game') {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(appState)) } catch (e) {}
    }
  }, [appState.turn, appState.cash])   // fires on every end-turn and every buy/sell

  // ── Record billion leaderboard when screen first appears ──────────────────────
  useEffect(() => {
    if (appState.showBillionScreen && appState.billionTurn) {
      recordBillionEntry(appState.empireName, appState.billionTurn)
    }
  }, [appState.showBillionScreen])

  // ── Setup handlers ──────────────────────────────────────────────────────────

  function handleSetName(name) {
    setAppState(s => ({ ...s, empireName: name }))
  }

  function handleSelectDifficulty(diff) {
    setAppState(s => ({ ...s, selectedDifficulty: diff }))
  }

  function handleSetupAdvance() {
    setAppState(s => {
      if (s.phase !== 'setup') return s

      if (s.setupStep === 0) {
        if (!s.empireName || s.empireName.trim().length === 0) return s
        return { ...s, setupStep: 1 }
      }

      if (s.setupStep === 1) {
        // Launch game directly — no Chip intro slides
        return createInitialGameState(s.empireName.trim(), s.selectedDifficulty)
      }

      return s
    })
  }

  // ── Game navigation ─────────────────────────────────────────────────────────

  function handleTabChange(tab) {
    setAppState(s => ({
      ...s,
      activeTab: tab,
      viewingCompany: null,
      viewingCompanyBack: false,
      viewingSector: null,
    }))
  }

  function handleSelectSector(sectorId) {
    setAppState(s => ({ ...s, viewingSector: sectorId, viewingCompany: null }))
  }

  function handleSelectCompany(companyId) {
    setAppState(s => ({
      ...s,
      viewingCompany: companyId,
      viewingCompanyBack: false,
      // Guide step 0→1: player tapped a company for the first time
      chipGuideStep: s.chipGuideStep === 0 ? 1 : s.chipGuideStep,
    }))
  }

  function handleBackFromCompany() {
    setAppState(s => {
      if (s.viewingCompanyBack) {
        return { ...s, viewingCompanyBack: false }
      }
      return { ...s, viewingCompany: null }
    })
  }

  function handleBackFromSector() {
    setAppState(s => ({ ...s, viewingSector: null }))
  }

  function handleViewCompanyDetails() {
    setAppState(s => ({ ...s, viewingCompanyBack: true }))
  }

  // ── Game actions ─────────────────────────────────────────────────────────────

  function handleBuy(companyId) {
    const s = appState
    const cs = s.companyStates[companyId]
    if (!cs) return
    const basePrice = Math.round(cs.profit * cs.multiplier)
    const hasFlashSale = s.flashSale && s.flashSale.companyId === companyId
    const price = hasFlashSale ? Math.round(basePrice * (1 - s.flashSale.discount)) : basePrice
    const cashAfter = s.cash - price
    setAppState(prev => ({
      ...prev,
      actionDialog: { type: 'buy', companyId, cost: price, cashAfter },
    }))
  }

  function handleSell(companyId) {
    const s = appState
    const entry = s.portfolio[companyId]
    const cs = s.companyStates[companyId]
    const co = COMPANIES.find(c => c.id === companyId)
    if (!entry || !cs || !co) return
    const locMult = 1 + (entry.locations - 1) * 0.30
    const proceeds = Math.round(cs.profit * cs.multiplier * locMult)
    const cashAfter = s.cash + proceeds
    const totalInvested = (entry.purchasePrice || 0) + (entry.locationSpend || 0)
    setAppState(prev => ({
      ...prev,
      actionDialog: {
        type: 'sell', companyId, proceeds, cashAfter,
        tradeData: {
          companyName: co.name,
          companyEmoji: co.emoji,
          proceeds,
          purchasePrice: entry.purchasePrice,
          totalInvested,
        },
      },
    }))
  }

  function handleOpenLocation(companyId) {
    const s = appState
    const entry = s.portfolio[companyId]
    const cs = s.companyStates[companyId]
    const co = COMPANIES.find(c => c.id === companyId)
    if (!entry || !cs || !co || entry.locations >= 5) return
    const cost = Math.round(cs.profit * cs.multiplier * co.locationCost)
    const cashAfter = s.cash - cost
    // Calculate approx value added by this location (+30% of current value)
    const valueAdded = Math.round(cs.profit * cs.multiplier * 0.30)
    setAppState(prev => ({
      ...prev,
      actionDialog: { type: 'openLocation', companyId, cost, cashAfter, valueAdded },
    }))
  }

  function handleSellLocation(companyId) {
    const s = appState
    const entry = s.portfolio[companyId]
    const cs = s.companyStates[companyId]
    const co = COMPANIES.find(c => c.id === companyId)
    if (!entry || !cs || !co || entry.locations <= 1) return
    const salePrice = Math.round(cs.profit * cs.multiplier * co.locationCost)
    const cashAfter = s.cash + salePrice
    setAppState(prev => ({
      ...prev,
      actionDialog: { type: 'sellLocation', companyId, proceeds: salePrice, cashAfter },
    }))
  }

  function handleConfirmAction() {
    const { actionDialog } = appState
    if (!actionDialog) return

    setAppState(prev => {
      let newState
      if (actionDialog.type === 'buy') {
        newState = buyCompany(prev, actionDialog.companyId)
        newState = {
          ...newState,
          showBuyToast: actionDialog.companyId,
          // Guide step 1→2: player just bought their first company
          chipGuideStep: prev.chipGuideStep === 1 ? 2 : prev.chipGuideStep,
        }
        SFX.buy()
      } else if (actionDialog.type === 'sell') {
        newState = sellCompany(prev, actionDialog.companyId)
        if (actionDialog.tradeData) {
          newState = { ...newState, smartTrade: actionDialog.tradeData }
        }
        SFX.sell()
      } else if (actionDialog.type === 'openLocation') {
        newState = openLocation(prev, actionDialog.companyId)
        newState = { ...newState, sawLocationTutorial: true }
        SFX.openLocation()
      } else if (actionDialog.type === 'sellLocation') {
        newState = sellLocation(prev, actionDialog.companyId)
        SFX.sellLocation()
      } else {
        newState = { ...prev, actionDialog: null }
      }
      return newState
    })
  }

  function handleCancelAction() {
    setAppState(s => ({ ...s, actionDialog: null }))
  }

  // ── End Turn ─────────────────────────────────────────────────────────────────

  function handleEndTurn() {
    SFX.endTurn()
    setAppState(prev => {
      const next = resolveEndTurn(prev)
      // Guide step 2→3: player ended their first turn with owned companies
      if (prev.chipGuideStep === 2 && Object.keys(prev.portfolio).length > 0) {
        next.chipGuideStep = 3
      }
      // Play earn sound
      if (next.earnedThisTurn > 0) {
        setTimeout(() => {
          next.earnedThisTurn > 1000000 ? SFX.earnBig() : SFX.earn()
        }, 300)
      }
      // Level up sound
      if (next.justLeveledUp) {
        setTimeout(() => SFX.levelUp(), 600)
      }
      // Wild card sound
      if (next.showWildCard) {
        setTimeout(() => SFX.wildCard(), 200)
      }
      // Flash sale sound
      if (next.flashSale && (!prev.flashSale || prev.flashSale.companyId !== next.flashSale.companyId)) {
        setTimeout(() => SFX.flashSale(), 800)
      }
      // Win sound
      if (next.phase === 'win') {
        setTimeout(() => SFX.win(), 500)
      }
      // Sector unlock
      const SECTOR_UNLOCK_LEVELS = { 2: 'entertainment', 3: 'tech', 4: 'industrials' }
      if (next.justLeveledUp && SECTOR_UNLOCK_LEVELS[next.justLeveledUp]) {
        setTimeout(() => SFX.sectorUnlock(), 400)
        return { ...next, showSectorUnlock: SECTOR_UNLOCK_LEVELS[next.justLeveledUp] }
      }
      return next
    })
  }

  function handleSectorUnlockContinue() {
    setAppState(s => ({ ...s, showSectorUnlock: null, showNewsModal: !s.showWildCard }))
  }

  function handleDismissSmartTrade() {
    setAppState(s => ({ ...s, smartTrade: null }))
  }

  function handleWildCardContinue() {
    setAppState(s => ({
      ...s,
      wildCard: null,
      showWildCard: false,
      showNewsModal: !s.crisisEvent,
    }))
  }

  function handlePayCrisis() {
    setAppState(s => {
      if (!s.crisisEvent) return s
      return {
        ...s,
        cash: s.cash - s.crisisEvent.payAmount,
        crisisEvent: null,
        showNewsModal: true,
      }
    })
  }

  function handleIgnoreCrisis() {
    setAppState(s => {
      if (!s.crisisEvent) return s
      const id = s.crisisEvent.companyId
      const newStates = { ...s.companyStates }
      if (newStates[id]) {
        const co = COMPANIES.find(c => c.id === id)
        const floor = co ? co.multFloor : 1
        newStates[id] = {
          ...newStates[id],
          multiplier: Math.max(floor, newStates[id].multiplier * (1 - s.crisisEvent.penaltyPct)),
        }
      }
      return {
        ...s,
        companyStates: newStates,
        crisisEvent: null,
        showNewsModal: true,
      }
    })
  }

  function handleCloseNews() {
    SFX.newsOpen()
    setAppState(s => ({
      ...s,
      showNewsModal: false,
      // Guide step 3→4: player dismissed the news modal after seeing step 3
      chipGuideStep: s.chipGuideStep === 3 ? 4 : s.chipGuideStep,
    }))
  }

  // ── Earn animation ────────────────────────────────────────────────────────────

  function handleDismissEarnAnimation() {
    setAppState(s => ({ ...s, showEarnAnimation: false }))
  }

  // ── Buy toast ─────────────────────────────────────────────────────────────────

  function handleDismissBuyToast() {
    setAppState(s => ({ ...s, showBuyToast: null }))
  }

  // ── Economy pill tap ──────────────────────────────────────────────────────────

  function handleEconomyPillTap() {
    setAppState(s => ({ ...s, showEconomyModal: true }))
  }

  function handleCloseEconomyModal() {
    setAppState(s => ({ ...s, showEconomyModal: false }))
  }

  // ── Modals ────────────────────────────────────────────────────────────────────

  function handleBadgeTap(badgeId) {
    setAppState(s => ({ ...s, badgeModal: badgeId }))
  }

  function handleCloseBadge() {
    setAppState(s => ({ ...s, badgeModal: null }))
  }

  function handleTermTap(termId) {
    setAppState(s => ({ ...s, termModal: termId }))
  }

  function handleCloseTerm() {
    setAppState(s => ({ ...s, termModal: null }))
  }

  function handleDismissVictorToast() {
    setAppState(s => ({ ...s, victorSnatched: null }))
  }

  function handleShowLevelSheet() {
    setAppState(s => ({ ...s, showLevelSheet: true }))
  }

  function handleCloseLevelSheet() {
    setAppState(s => ({ ...s, showLevelSheet: false }))
  }

  // ── Empire name edit ──────────────────────────────────────────────────────────

  function handleEditName() {
    const name = window.prompt('Rename your empire:', appState.empireName)
    if (name && name.trim().length > 0) {
      setAppState(s => ({ ...s, empireName: name.trim().slice(0, 24) }))
    }
  }

  // ── Chip tab ──────────────────────────────────────────────────────────────────

  function handleSubTabChange(tab) {
    setAppState(s => ({ ...s, chipSubTab: tab }))
  }

  function handleSearchChange(val) {
    setAppState(s => ({ ...s, chipSearch: val }))
  }

  function handleToggleQuestion(id) {
    setAppState(s => ({ ...s, expandedQuestion: s.expandedQuestion === id ? null : id }))
  }

  // ── Landing screen: continue or new game ─────────────────────────────────────

  function handleContinueGame() {
    const saved = getSavedGame()
    if (saved) setAppState(sanitizeGameState(saved))
  }

  function handleNewGame() {
    // Record net worth leaderboard from the saved game being replaced
    const saved = getSavedGame()
    if (saved) {
      const nw = saved.netWorthHistory ? saved.netWorthHistory[saved.netWorthHistory.length - 1] : 0
      recordNetWorthEntry(saved.empireName, nw)
    }
    clearSavedGame()
    setAppState(s => ({ ...s, setupStep: 0, hasSave: false }))
  }

  // ── Billion screen ────────────────────────────────────────────────────────────

  function handleKeepPlaying() {
    setAppState(s => ({ ...s, showBillionScreen: false, showNewsModal: true }))
  }

  function handleNewGameFromBillion() {
    // Record net worth to leaderboard (in addition to the billion already recorded)
    const nw = appState.netWorthHistory ? appState.netWorthHistory[appState.netWorthHistory.length - 1] : 0
    recordNetWorthEntry(appState.empireName, nw)
    clearSavedGame()
    setAppState(createSetupState)
  }

  // ── Location tutorial dismiss ─────────────────────────────────────────────────

  function handleDismissLocationTutorial() {
    setAppState(s => ({ ...s, sawLocationTutorial: true }))
  }

  // ── Onboarding popup ──────────────────────────────────────────────────────────

  function handleDismissOnboarding() {
    setAppState(s => ({ ...s, onboardingDismissed: true }))
  }

  // ── Play again ────────────────────────────────────────────────────────────────

  function handlePlayAgain() {
    clearSavedGame()
    setAppState(createSetupState)
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const { phase } = appState

  if (phase === 'setup') {
    return (
      <SetupFlow
        setupStep={appState.setupStep}
        empireName={appState.empireName}
        selectedDifficulty={appState.selectedDifficulty}
        onSetName={handleSetName}
        onSelectDifficulty={handleSelectDifficulty}
        onAdvance={handleSetupAdvance}
        onContinue={handleContinueGame}
        onNewGame={handleNewGame}
      />
    )
  }

  // ── Main Game ─────────────────────────────────────────────────────────────────

  const {
    activeTab, viewingSector, viewingCompany, viewingCompanyBack,
    showNewsModal, showWildCard, wildCard,
    actionDialog, badgeModal, showLevelSheet,
    portfolio, companyStates, turnActions,
    economy, sectorCycles, netWorthHistory, level, cash, flashSale,
    currentNews, turn, difficulty, chipSubTab, chipSearch, expandedQuestion,
    showEarnAnimation, earnedThisTurn, showBuyToast, showEconomyModal,
    smartTrade, showSectorUnlock, newAchievement,
    showBillionScreen, onboardingDismissed,
    chipGuideStep, companyNewsEffects, crisisEvent, termModal, victorSnatched,
  } = appState

  const netWorth = calcNetWorth(cash, portfolio, companyStates)

  // Derive sectorName for the currently viewed company
  const viewingCoData = viewingCompany ? COMPANIES.find(c => c.id === viewingCompany) : null
  const viewingCoSectorName = viewingCoData ? (SECTORS[viewingCoData.sector] ? SECTORS[viewingCoData.sector].name : '') : ''

  // Economy modal data
  const econExplain = showEconomyModal ? (ECONOMY_EXPLAIN[economy.state] || ECONOMY_EXPLAIN.steady) : null

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Main content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Company Card Back */}
        {viewingCompany && viewingCompanyBack && (
          <CompanyCardBack
            companyId={viewingCompany}
            companyStates={companyStates}
            portfolio={portfolio}
            cash={cash}
            turnActions={turnActions}
            onBack={handleBackFromCompany}
            onOpenLocation={handleOpenLocation}
            onSell={handleSell}
            onSellLocation={handleSellLocation}
          />
        )}

        {/* Company Card Front */}
        {viewingCompany && !viewingCompanyBack && (
          <CompanyCard
            companyId={viewingCompany}
            companyStates={companyStates}
            portfolio={portfolio}
            turnActions={turnActions}
            sectorName={viewingCoSectorName}
            cash={cash}
            flashSale={flashSale}
            sectorCycles={sectorCycles}
            economy={economy}
            turn={turn}
            isChipPick={turn === 1 && Object.keys(portfolio).length === 0 && viewingCompany === 'burgerblast'}
            onBuy={handleBuy}
            onSell={handleSell}
            onOpenLocation={handleOpenLocation}
            onBadgeTap={handleBadgeTap}
            onBack={handleBackFromCompany}
            onViewDetails={handleViewCompanyDetails}
            companyNewsEffects={companyNewsEffects}
            chipGuideStep={chipGuideStep}
            onTermTap={handleTermTap}
          />
        )}

        {/* Sector View */}
        {viewingSector && !viewingCompany && (
          <SectorView
            sectorId={viewingSector}
            companyStates={companyStates}
            portfolio={portfolio}
            turnActions={turnActions}
            sectorCycles={sectorCycles}
            flashSale={flashSale}
            onSelectCompany={handleSelectCompany}
            onBack={handleBackFromSector}
            cash={cash}
            netWorth={netWorth}
            companyNewsEffects={companyNewsEffects}
          />
        )}

        {/* Tab content */}
        {!viewingSector && !viewingCompany && (
          <>
            {activeTab === 'empire' && (
              <EmpireTab
                state={appState}
                onSelectSector={handleSelectSector}
                onShowLevelSheet={handleShowLevelSheet}
                onEndTurn={handleEndTurn}
                onEditName={handleEditName}
                onEconomyPillTap={handleEconomyPillTap}
                onDismissLocationTutorial={handleDismissLocationTutorial}
                onTermTap={handleTermTap}
              />
            )}
            {activeTab === 'news' && (
              <NewsTab
                currentNews={currentNews}
                economy={economy}
                turn={turn}
                onSelectCompany={id => {
                  handleSelectCompany(id)
                  setAppState(s => ({ ...s, activeTab: 'empire' }))
                }}
              />
            )}
            {activeTab === 'market' && (
              <MarketTab
                economy={economy}
                sectorCycles={sectorCycles}
                netWorthHistory={netWorthHistory}
                cash={cash}
                difficulty={difficulty}
                level={level}
                portfolio={portfolio}
                companyStates={companyStates}
                achievements={appState.achievements}
                onSelectCompany={id => {
                  handleSelectCompany(id)
                  setAppState(s => ({ ...s, activeTab: 'empire' }))
                }}
              />
            )}
            {activeTab === 'chip' && (
              <ChipTab
                state={appState}
                onSubTabChange={handleSubTabChange}
                onSearchChange={handleSearchChange}
                onToggleQuestion={handleToggleQuestion}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Nav — always visible */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Overlays ── */}

      {/* Wild Card Screen */}
      {showWildCard && wildCard && (
        <WildCardScreen wildCard={wildCard} onContinue={handleWildCardContinue} />
      )}

      {/* Crisis Modal — shown after wild card resolves, before news */}
      {crisisEvent && !showWildCard && (
        <CrisisModal
          crisis={crisisEvent}
          cash={cash}
          onPay={handlePayCrisis}
          onIgnore={handleIgnoreCrisis}
        />
      )}

      {/* News Modal */}
      {showNewsModal && !showWildCard && !crisisEvent && currentNews && (
        <NewsModal
          turn={turn}
          currentNews={currentNews}
          economy={economy}
          sectorCycles={sectorCycles}
          difficulty={difficulty}
          level={level}
          chipGuideStep={chipGuideStep}
          onClose={handleCloseNews}
          onSelectCompany={id => {
            handleCloseNews()
            handleSelectCompany(id)
          }}
        />
      )}

      {/* Action Dialog */}
      {actionDialog && (
        <ActionDialog
          dialog={actionDialog}
          cash={cash}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}

      {/* Badge Modal */}
      {badgeModal && (
        <BadgeModal badgeId={badgeModal} onClose={handleCloseBadge} />
      )}

      {/* Term Modal */}
      {termModal && (
        <TermModal termId={termModal} onClose={handleCloseTerm} />
      )}

      {/* Level Sheet */}
      {showLevelSheet && (
        <LevelSheet
          currentLevel={level}
          netWorth={netWorth}
          onClose={handleCloseLevelSheet}
        />
      )}

      {/* Level Up Toast */}
      {appState.justLeveledUp && (
        <LevelUpToast
          level={appState.justLeveledUp}
          onDismiss={() => setAppState(s => ({ ...s, justLeveledUp: null }))}
        />
      )}

      {/* Earn Animation */}
      {showEarnAnimation && earnedThisTurn > 0 && (
        <EarnAnimation
          amount={earnedThisTurn}
          onDone={handleDismissEarnAnimation}
        />
      )}

      {/* Buy Toast */}
      {showBuyToast && (
        <BuyToast
          companyId={showBuyToast}
          onDone={handleDismissBuyToast}
        />
      )}

      {/* Economy Modal */}
      {showEconomyModal && econExplain && (
        <EconomyModal info={econExplain} onClose={handleCloseEconomyModal} />
      )}

      {/* Sector Unlock Screen */}
      {showSectorUnlock && (
        <SectorUnlockScreen
          sectorId={showSectorUnlock}
          onContinue={handleSectorUnlockContinue}
        />
      )}

      {/* Smart Trade Toast */}
      {smartTrade && !showSectorUnlock && (
        <SmartTradeToast
          trade={smartTrade}
          onDone={handleDismissSmartTrade}
        />
      )}

      {/* Victor Snatch Toast — hard mode flash sale stolen notification */}
      {victorSnatched && (
        <VictorToast victorSnatched={victorSnatched} onDone={handleDismissVictorToast} />
      )}

      {/* Achievement Toast */}
      {newAchievement && !showSectorUnlock && !smartTrade && (
        <AchievementToast
          achievement={newAchievement}
          onDone={() => {
            SFX.achievement()
            setAppState(s => ({ ...s, newAchievement: null }))
          }}
        />
      )}

      {/* Billion Screen — full-screen overlay when first hitting $1B */}
      {showBillionScreen && (
        <BillionScreen
          state={appState}
          onKeepPlaying={handleKeepPlaying}
          onNewGame={handleNewGameFromBillion}
        />
      )}

      {/* Onboarding Popup — turn 1, no companies, not yet dismissed */}
      {turn === 1 && Object.keys(portfolio).length === 0 && !onboardingDismissed && !showBillionScreen && (
        <OnboardingPopup onDismiss={handleDismissOnboarding} />
      )}
    </div>
  )
}

// ─── Level Up Toast ───────────────────────────────────────────────────────────

function LevelUpToast({ level, onDismiss }) {
  const labels = ['', 'Street Smart', 'City Mogul', 'Tech Pioneer', 'Industrials Boss', 'BILLIONAIRE!']

  React.useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
        zIndex: 400,
        background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
        color: '#fff',
        padding: '12px 28px',
        borderRadius: 50,
        fontSize: 16, fontWeight: 900,
        boxShadow: '0 6px 28px rgba(29,78,216,0.55)',
        animation: 'toastIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      🎉 Level {level}: {labels[level] || ''}!
      <style>{`@keyframes toastIn { from { transform: translateX(-50%) scale(0.7); opacity: 0 } to { transform: translateX(-50%) scale(1); opacity: 1 } }`}</style>
    </div>
  )
}

// ─── Onboarding Popup ────────────────────────────────────────────────────────

function OnboardingPopup({ onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 350,
        background: 'rgba(0,0,16,0.55)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px calc(env(safe-area-inset-bottom, 0px) + 28px)',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '12px auto 18px' }} />

        <div style={{ fontSize: 22, fontWeight: 900, color: '#1E293B', marginBottom: 4 }}>
          🤖 Chip's Quick Tips
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 16 }}>
          Read this once — you'll be a pro in no time!
        </div>

        {[
          { emoji: '💵', text: 'You have $10M to invest. Tap a sector tile to browse companies.' },
          { emoji: '👆', text: 'Start with Consumer Market — the easiest sector for beginners.' },
          { emoji: '📈', text: 'Profit × Multiplier = Company Value. More locations = more profit each turn.' },
          { emoji: '🎯', text: 'Goal: grow your Net Worth from $10M to $1 Billion. You got this!' },
        ].map((tip, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            background: '#F8FAFC', borderRadius: 12, padding: '10px 14px',
            marginBottom: 8, border: '1px solid #E2E8F0',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', lineHeight: 1.45 }}>{tip.text}</span>
          </div>
        ))}

        <button
          onClick={onDismiss}
          style={{
            width: '100%', marginTop: 8, padding: '15px',
            background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(29,78,216,0.35)',
          }}
        >
          Got it — let's build! 🚀
        </button>
      </div>
    </div>
  )
}

// ─── Economy Modal ────────────────────────────────────────────────────────────

function EconomyModal({ info, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,16,0.6)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '8px 20px 36px',
          animation: 'slideUp 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 36px)',
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 36, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '12px auto 20px' }} />

        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 10 }}>{info.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#1E293B', textAlign: 'center', marginBottom: 12 }}>
          {info.title}
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', lineHeight: 1.6, textAlign: 'center', marginBottom: 24 }}>
          {info.text}
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(29,78,216,0.3)',
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  )
}
