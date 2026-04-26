import React, { useState } from 'react'
import { COMPANIES, SECTORS } from './data/companies.js'
import {
  createInitialGameState,
  resolveEndTurn,
  buyCompany,
  sellCompany,
  openLocation,
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
import BuyToast from './components/BuyToast.jsx'

// ─── Initial Setup State ──────────────────────────────────────────────────────

function createSetupState() {
  return {
    phase: 'setup',
    setupStep: 0,
    chipIntroStep: 0,
    empireName: '',
    selectedDifficulty: 'normal',
  }
}

// ─── Economy state descriptions ───────────────────────────────────────────────

const ECONOMY_EXPLAIN = {
  booming: {
    emoji: '🚀',
    title: 'Economy: Booming!',
    text: "Everything is on fire — in a good way! Company profits and values are boosted across the board. This is a great time to buy or expand locations.",
    mood: '#22C55E',
  },
  steady: {
    emoji: '⚖️',
    title: 'Economy: Steady',
    text: "The economy is humming along normally. Profits and multipliers are at their baseline. A good time to be selective and plan ahead.",
    mood: '#1D4ED8',
  },
  slowdown: {
    emoji: '📉',
    title: 'Economy: Slowdown',
    text: "Things are tough out there. Profits and company values are depressed. Be cautious with big purchases — but some sectors weather it better than others!",
    mood: '#EF4444',
  },
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState(createSetupState)

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
        return { ...s, setupStep: 2, chipIntroStep: 0 }
      }

      if (s.setupStep === 2) {
        if (s.chipIntroStep < 4) {
          return { ...s, chipIntroStep: s.chipIntroStep + 1 }
        }
        // Launch game
        const gameState = createInitialGameState(
          s.empireName.trim(),
          s.selectedDifficulty
        )
        return gameState
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
    setAppState(s => ({ ...s, viewingCompany: companyId, viewingCompanyBack: false }))
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
    const price = Math.round(cs.profit * cs.multiplier)
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
    if (!entry || !cs) return
    const locMult = 1 + (entry.locations - 1) * 0.30
    const proceeds = Math.round(cs.profit * cs.multiplier * locMult)
    const cashAfter = s.cash + proceeds
    setAppState(prev => ({
      ...prev,
      actionDialog: { type: 'sell', companyId, proceeds, cashAfter },
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
    setAppState(prev => ({
      ...prev,
      actionDialog: { type: 'openLocation', companyId, cost, cashAfter },
    }))
  }

  function handleConfirmAction() {
    const { actionDialog } = appState
    if (!actionDialog) return

    setAppState(prev => {
      let newState
      if (actionDialog.type === 'buy') {
        newState = buyCompany(prev, actionDialog.companyId)
        // Show the buy toast after successful purchase
        newState = { ...newState, showBuyToast: actionDialog.companyId }
      } else if (actionDialog.type === 'sell') {
        newState = sellCompany(prev, actionDialog.companyId)
      } else if (actionDialog.type === 'openLocation') {
        newState = openLocation(prev, actionDialog.companyId)
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
    setAppState(prev => resolveEndTurn(prev))
  }

  function handleWildCardContinue() {
    setAppState(s => ({
      ...s,
      wildCard: null,
      showWildCard: false,
      showNewsModal: true,
    }))
  }

  function handleCloseNews() {
    setAppState(s => ({ ...s, showNewsModal: false }))
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

  // ── Play again ────────────────────────────────────────────────────────────────

  function handlePlayAgain() {
    setAppState(createSetupState)
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const { phase } = appState

  if (phase === 'setup') {
    return (
      <SetupFlow
        setupStep={appState.setupStep}
        chipIntroStep={appState.chipIntroStep}
        empireName={appState.empireName}
        selectedDifficulty={appState.selectedDifficulty}
        onSetName={handleSetName}
        onSelectDifficulty={handleSelectDifficulty}
        onAdvance={handleSetupAdvance}
      />
    )
  }

  if (phase === 'win') {
    return <WinScreen state={appState} onPlayAgain={handlePlayAgain} />
  }

  // ── Main Game ─────────────────────────────────────────────────────────────────

  const {
    activeTab, viewingSector, viewingCompany, viewingCompanyBack,
    showNewsModal, showWildCard, wildCard,
    actionDialog, badgeModal, showLevelSheet,
    portfolio, companyStates, turnActions,
    economy, sectorCycles, netWorthHistory, level, cash,
    currentNews, turn, difficulty, chipSubTab, chipSearch, expandedQuestion,
    showEarnAnimation, earnedThisTurn, showBuyToast, showEconomyModal,
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
            turnActions={turnActions}
            onBack={handleBackFromCompany}
            onOpenLocation={handleOpenLocation}
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
            onBuy={handleBuy}
            onSell={handleSell}
            onOpenLocation={handleOpenLocation}
            onBadgeTap={handleBadgeTap}
            onBack={handleBackFromCompany}
            onViewDetails={handleViewCompanyDetails}
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
            onSelectCompany={handleSelectCompany}
            onBack={handleBackFromSector}
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
              />
            )}
            {activeTab === 'news' && (
              <NewsTab
                currentNews={currentNews}
                economy={economy}
                turn={turn}
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

      {/* Bottom Nav */}
      {!viewingCompany && !viewingSector && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* ── Overlays ── */}

      {/* Wild Card Screen */}
      {showWildCard && wildCard && (
        <WildCardScreen wildCard={wildCard} onContinue={handleWildCardContinue} />
      )}

      {/* News Modal */}
      {showNewsModal && !showWildCard && currentNews && (
        <NewsModal
          turn={turn}
          currentNews={currentNews}
          economy={economy}
          onClose={handleCloseNews}
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
