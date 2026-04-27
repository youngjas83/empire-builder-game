import React from 'react'
import { SECTORS, LEVELS, COMPANIES } from '../data/companies.js'
import { formatMoney, calcNetWorth, calcProfitPerTurn, getEconomyLabel, getEconomyColor, getSectorStateColor, getSectorStateLabel } from '../game/engine.js'
import Chip from './Chip.jsx'

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
    economy, sectorCycles, level, turnActions, profitStreak,
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
                Put your $10M to work!
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', lineHeight: 1.45 }}>
                Tap a sector below to browse companies and make your first investment.
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
                    {getSectorStateLabel(sectorState)}
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
      </div>

      {/* ── End Turn Button (floating) ── */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 62px)',
        left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 398,
        zIndex: 110,
      }}>
        {/* Streak badge */}
        {profitStreak >= 3 && (
          <div style={{
            textAlign: 'center', marginBottom: 6,
            fontSize: 13, fontWeight: 900,
            color: profitStreak >= 7 ? '#DC2626' : '#D97706',
          }}>
            {'🔥'.repeat(Math.min(profitStreak, 5))} {profitStreak}-turn profit streak!
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
