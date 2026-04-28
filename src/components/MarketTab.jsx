import React, { useState } from 'react'
import { COMPANIES, SECTORS } from '../data/companies.js'
import { ACHIEVEMENTS_CATALOG } from '../game/engine.js'
import Sparkline from './Sparkline.jsx'
import {
  formatMoney, calcNetWorth, calcLocationsMultiplier,
  getEconomyLabel, getEconomyColor, getSectorStateLabel, getSectorStateColor,
} from '../game/engine.js'

export default function MarketTab({
  economy, sectorCycles, netWorthHistory, cash, difficulty, level,
  portfolio, companyStates, onSelectCompany, achievements,
}) {
  const [showMOIC, setShowMOIC] = useState(true)
  const [showMOICTooltip, setShowMOICTooltip] = useState(false)
  const [expandedROI, setExpandedROI] = useState(null)

  const econColor = getEconomyColor(economy.state)
  const interestRate = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 1 : 2
  const netWorth = calcNetWorth(cash, portfolio, companyStates)
  const ownedIds = Object.keys(portfolio)

  // Net worth growth vs start
  const startNW = netWorthHistory[0] || 10000000
  const nwGrowth = netWorth - startNW
  const nwGrowthPct = startNW > 0 ? Math.round((nwGrowth / startNW) * 100) : 0
  const moic = startNW > 0 ? (netWorth / startNW).toFixed(2) : '1.00'

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
          📊 Stats
        </div>
        {/* Cash + Net Worth pills */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 14,
            padding: '10px 14px', border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
              💰 Cash
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#4ADE80' }}>
              {formatMoney(cash)}
            </div>
          </div>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 14,
            padding: '10px 14px', border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
              📈 Empire Value
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#60A5FA' }}>
              {formatMoney(netWorth)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 14px' }}>

        {/* Net Worth History */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📈 Empire Value History
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* MOIC tooltip */}
              {showMOICTooltip && (
                <div style={{
                  position: 'absolute', right: 60, top: 0,
                  background: '#1E293B', color: '#fff', borderRadius: 10,
                  padding: '8px 12px', fontSize: 12, fontWeight: 600,
                  width: 200, lineHeight: 1.5, zIndex: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}>
                  <strong>MOIC</strong> = Multiple on Invested Capital. Shows how many times you've multiplied your starting money. 2×= doubled, 10×= 10× your money.
                </div>
              )}
              <button
                onClick={() => setShowMOICTooltip(t => !t)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, color: '#9CA3AF', padding: 0, fontFamily: 'inherit',
                }}
              >ℹ️</button>
              <button
                onClick={() => setShowMOIC(m => !m)}
                style={{
                  fontSize: 12, fontWeight: 800,
                  color: nwGrowth >= 0 ? '#16A34A' : '#DC2626',
                  background: nwGrowth >= 0 ? '#F0FDF4' : '#FEF2F2',
                  padding: '2px 8px', borderRadius: 10,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {showMOIC ? `${moic}× your money` : `${nwGrowth >= 0 ? '+' : ''}${nwGrowthPct}% all time`}
              </button>
            </div>
          </div>
          {netWorthHistory.length > 1 ? (
            <>
              <Sparkline data={netWorthHistory} width={320} height={64} color="#1D4ED8" strokeWidth={2.5} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Start: {formatMoney(netWorthHistory[0])}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#1D4ED8' }}>Now: {formatMoney(netWorthHistory[netWorthHistory.length - 1])}</span>
              </div>
            </>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 600, padding: '12px 0' }}>
              Chart appears after your first turn!
            </div>
          )}
        </div>

        {/* Net Worth Breakdown */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            💼 Empire Value Breakdown
          </div>

          {/* Cash row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '9px 10px', background: '#F0FDF4', borderRadius: 10, marginBottom: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>💰</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>Cash</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#16A34A' }}>{formatMoney(cash)}</span>
          </div>

          {/* Company rows */}
          {ownedIds.length === 0 && (
            <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600, textAlign: 'center', padding: '12px 0' }}>
              Buy your first company to see it here!
            </div>
          )}
          {ownedIds.map(id => {
            const co = COMPANIES.find(c => c.id === id)
            const cs = companyStates[id]
            const entry = portfolio[id]
            if (!co || !cs || !entry) return null
            const locMult = calcLocationsMultiplier(entry.locations)
            const companyValue = Math.round(cs.profit * cs.multiplier * locMult)
            return (
              <div
                key={id}
                onClick={() => onSelectCompany && onSelectCompany(id)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 10px', borderRadius: 10, marginBottom: 6,
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{co.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>{co.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                      {entry.locations} loc{entry.locations !== 1 ? 's' : ''} · {formatMoney(Math.round(cs.profit * locMult))}/turn
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#1D4ED8' }}>{formatMoney(companyValue)}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>tap to view →</div>
                </div>
              </div>
            )
          })}

          {/* Divider + Total */}
          <div style={{ borderTop: '2px solid #E2E8F0', marginTop: 6, paddingTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#1E293B' }}>📈 Empire Value</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#1D4ED8' }}>{formatMoney(netWorth)}</span>
            </div>
            <div style={{
              marginTop: 6, padding: '6px 10px',
              background: 'linear-gradient(135deg, #EFF6FF, #E0E7FF)',
              borderRadius: 8,
              fontSize: 12, fontWeight: 700, color: '#1D4ED8', textAlign: 'center',
            }}>
              $1B goal · {Math.min(100, Math.round((netWorth / 1000000000) * 100))}% there
            </div>
          </div>
        </div>

        {/* Portfolio ROI */}
        {ownedIds.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              📊 Portfolio ROI
            </div>
            {ownedIds.map(id => {
              const co = COMPANIES.find(c => c.id === id)
              const cs = companyStates[id]
              const entry = portfolio[id]
              if (!co || !cs || !entry) return null
              const locMult = calcLocationsMultiplier(entry.locations)
              const currentValue = Math.round(cs.profit * cs.multiplier * locMult)
              const totalInvested = (entry.purchasePrice || 0) + (entry.locationSpend || 0)
              const profitsCollected = entry.profitsCollected || 0
              const valueChange = currentValue - totalInvested
              const totalGain = valueChange + profitsCollected
              const roi = totalInvested > 0 ? Math.round((totalGain / totalInvested) * 100) : 0
              const gainColor = totalGain >= 0 ? '#16A34A' : '#DC2626'
              const gainBg = totalGain >= 0 ? '#F0FDF4' : '#FEF2F2'
              const isExpanded = expandedROI === id
              return (
                <div
                  key={id}
                  style={{
                    background: '#F8FAFC', borderRadius: 12,
                    marginBottom: 8, border: '1px solid #E2E8F0', overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '12px', cursor: 'pointer' }} onClick={() => onSelectCompany && onSelectCompany(id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{co.emoji}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 900, color: '#1E293B' }}>{co.name}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                            {entry.locations} location{entry.locations !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      {/* ROI pill — tappable for explanation */}
                      <button
                        onClick={e => { e.stopPropagation(); setExpandedROI(isExpanded ? null : id) }}
                        style={{
                          background: gainBg, borderRadius: 10,
                          padding: '4px 10px', textAlign: 'right',
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 900, color: gainColor }}>
                          {roi >= 0 ? '+' : ''}{roi}% ROI
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: gainColor, opacity: 0.8 }}>
                          {totalGain >= 0 ? '+' : ''}{formatMoney(totalGain)} total gain
                        </div>
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, textAlign: 'center', padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700 }}>Invested</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#374151' }}>{formatMoney(totalInvested)}</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700 }}>Value Now</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1D4ED8' }}>{formatMoney(currentValue)}</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', padding: '6px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700 }}>Profits</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#16A34A' }}>+{formatMoney(profitsCollected)}</div>
                      </div>
                    </div>
                  </div>
                  {/* Expandable ROI explanation */}
                  {isExpanded && (
                    <div style={{
                      background: gainBg,
                      borderTop: `1px solid ${gainColor}30`,
                      padding: '10px 12px',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: gainColor, marginBottom: 4 }}>
                        How ROI is calculated
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', lineHeight: 1.55 }}>
                        <strong>ROI = (Value Change + Profits Collected) ÷ Total Invested</strong>
                        <br />
                        Value change: {valueChange >= 0 ? '+' : ''}{formatMoney(valueChange)} · Profits: +{formatMoney(profitsCollected)}
                        <br />
                        Total gain {totalGain >= 0 ? '+' : ''}{formatMoney(totalGain)} on {formatMoney(totalInvested)} invested = <strong>{roi >= 0 ? '+' : ''}{roi}%</strong>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Totals */}
            {(() => {
              let totalInv = 0, totalVal = 0, totalProf = 0
              ownedIds.forEach(id => {
                const cs = companyStates[id]; const entry = portfolio[id]
                if (!cs || !entry) return
                const locMult = calcLocationsMultiplier(entry.locations)
                totalInv += (entry.purchasePrice || 0) + (entry.locationSpend || 0)
                totalVal += Math.round(cs.profit * cs.multiplier * locMult)
                totalProf += entry.profitsCollected || 0
              })
              const totalGain = (totalVal - totalInv) + totalProf
              const totalROI = totalInv > 0 ? Math.round((totalGain / totalInv) * 100) : 0
              const gc = totalGain >= 0 ? '#16A34A' : '#DC2626'
              return (
                <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Total Portfolio
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#F8FAFC', borderRadius: 10 }}>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700 }}>Invested</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#374151' }}>{formatMoney(totalInv)}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#EFF6FF', borderRadius: 10 }}>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Value</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#1D4ED8' }}>{formatMoney(totalVal)}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: totalGain >= 0 ? '#F0FDF4' : '#FEF2F2', borderRadius: 10 }}>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Total ROI</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: gc }}>{totalROI >= 0 ? '+' : ''}{totalROI}%</div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Economy Status */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            🌍 Economy Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: econColor + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {economy.state === 'booming' ? '📈' : economy.state === 'slowdown' ? '📉' : '📊'}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: econColor }}>{getEconomyLabel(economy.state)}</div>
              {(economy.preSignal === 'preSlowdown' || economy.preSignal === 'preBoom') && (
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginTop: 2 }}>
                  {economy.preSignal === 'preSlowdown' ? '⚠️ Slowdown signal ahead' : '🌱 Recovery signal ahead'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sector Trends */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            🏭 Sector Trends
          </div>
          {Object.values(SECTORS).map(sector => {
            const isUnlocked = level >= sector.unlockLevel
            const cycle = sectorCycles[sector.id]
            const state = cycle ? cycle.state : 'normal'
            const color = getSectorStateColor(state)
            return (
              <div key={sector.id} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #F1F5F9',
                opacity: isUnlocked ? 1 : 0.4,
              }}>
                <span style={{ fontSize: 20, marginRight: 10 }}>{sector.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                    {sector.name}
                    {!isUnlocked && <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 6 }}>🔒 locked</span>}
                  </div>
                  {isUnlocked && cycle && (cycle.preSignal === 'preSlowdown' || cycle.preSignal === 'preBoom') && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginTop: 1 }}>
                      {cycle.preSignal === 'preSlowdown' ? '⚠️ Slowing' : '🌱 Recovering'}
                    </div>
                  )}
                </div>
                {isUnlocked && (
                  <div style={{
                    fontSize: 12, fontWeight: 800, color,
                    background: color + '20', padding: '3px 10px', borderRadius: 20,
                  }}>
                    {getSectorStateLabel(state)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Trophy Case */}
        {(() => {
          const earned = achievements || []
          const unlocked = ACHIEVEMENTS_CATALOG.filter(a => earned.includes(a.id))
          const locked = ACHIEVEMENTS_CATALOG.filter(a => !earned.includes(a.id))
          return (
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  🏆 Trophy Case
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>
                  {unlocked.length}/{ACHIEVEMENTS_CATALOG.length}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 5, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${Math.round((unlocked.length / ACHIEVEMENTS_CATALOG.length) * 100)}%`,
                  background: 'linear-gradient(90deg, #FCD34D, #F59E0B)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              {/* Unlocked trophies */}
              {unlocked.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {unlocked.map(a => (
                    <div key={a.id} style={{
                      background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                      border: '1.5px solid #FCD34D',
                      borderRadius: 10, padding: '6px 10px',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 18 }}>{a.label.split(' ')[0]}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#78350F' }}>
                        {a.label.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600, textAlign: 'center', padding: '8px 0' }}>
                  Play more turns to earn trophies!
                </div>
              )}
              {/* Locked hint row */}
              {locked.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: '#CBD5E1' }}>
                  🔒 {locked.length} more to unlock — keep building!
                </div>
              )}
            </div>
          )
        })()}

        {/* Interest Rate */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            💵 Cash Interest
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#16A34A' }}>{interestRate}%</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', marginLeft: 6 }}>per turn</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Earning this turn</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A' }}>+{formatMoney(Math.round(cash * interestRate / 100))}</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 8, lineHeight: 1.4 }}>
            Your idle cash earns {interestRate}% interest every turn — free money! But companies earn way more. Find the right balance.
          </p>
        </div>

      </div>
    </div>
  )
}
