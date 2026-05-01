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
  const [marketSubTab, setMarketSubTab] = useState('overview')

  const econColor = getEconomyColor(economy.state)
  const netWorth = calcNetWorth(cash, portfolio, companyStates)
  const ownedIds = Object.keys(portfolio)

  const startNW = netWorthHistory[0] || 10000000
  const nwGrowth = netWorth - startNW
  const nwGrowthPct = startNW > 0 ? Math.round((nwGrowth / startNW) * 100) : 0
  const moic = startNW > 0 ? (netWorth / startNW).toFixed(2) : '1.00'

  const card = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '14px',
    marginBottom: 12,
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 90 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F1A3D, #0F172A)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#E2E8F0', marginBottom: 12 }}>
          📊 Stats
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {[{ id: 'overview', label: 'Overview' }, { id: 'trophies', label: '🏆 Trophies' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMarketSubTab(tab.id)}
              style={{
                flex: 1, padding: '10px',
                background: 'none', border: 'none',
                borderBottom: `3px solid ${marketSubTab === tab.id ? '#818CF8' : 'transparent'}`,
                color: marketSubTab === tab.id ? '#818CF8' : 'rgba(255,255,255,0.4)',
                fontSize: 14, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1,
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 14, padding: '10px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
              💰 Cash
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#4ADE80' }}>
              {formatMoney(cash)}
            </div>
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14, padding: '10px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
              📈 Empire Value
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#818CF8' }}>
              {formatMoney(netWorth)}
            </div>
          </div>
        </div>
      </div>

      {marketSubTab === 'trophies' ? (
        <TrophyCase earned={achievements || []} />
      ) : null}

      {marketSubTab === 'overview' && <div style={{ padding: '12px 14px' }}>

        {/* Net Worth History */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, position: 'relative' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📈 Empire Value History
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {showMOICTooltip && (
                <div style={{
                  position: 'absolute', right: 60, top: 0,
                  background: '#1E293B', color: '#E2E8F0', borderRadius: 10,
                  padding: '8px 12px', fontSize: 12, fontWeight: 600,
                  width: 200, lineHeight: 1.5, zIndex: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}>
                  <strong>MOIC</strong> = Multiple on Invested Capital. Shows how many times you've multiplied your starting money. 2×= doubled, 10×= 10× your money.
                </div>
              )}
              <button
                onClick={() => setShowMOICTooltip(t => !t)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, color: 'rgba(255,255,255,0.35)', padding: 0, fontFamily: 'inherit',
                }}
              >ℹ️</button>
              <button
                onClick={() => setShowMOIC(m => !m)}
                style={{
                  fontSize: 12, fontWeight: 700,
                  color: nwGrowth >= 0 ? '#4ADE80' : '#FCA5A5',
                  background: nwGrowth >= 0 ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                  padding: '2px 8px', borderRadius: 10,
                  border: nwGrowth >= 0 ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(239,68,68,0.25)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {showMOIC ? `${moic}× your money` : `${nwGrowth >= 0 ? '+' : ''}${nwGrowthPct}% all time`}
              </button>
            </div>
          </div>
          {netWorthHistory.length > 1 ? (
            <>
              <Sparkline data={netWorthHistory} width={320} height={64} color="#818CF8" strokeWidth={2.5} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Start: {formatMoney(netWorthHistory[0])}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#818CF8' }}>Now: {formatMoney(netWorthHistory[netWorthHistory.length - 1])}</span>
              </div>
            </>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 600, padding: '12px 0' }}>
              Chart appears after your first turn!
            </div>
          )}
        </div>

        {/* Empire Value Breakdown */}
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            💼 Empire Value Breakdown
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '9px 10px', background: 'rgba(74,222,128,0.08)', borderRadius: 10, marginBottom: 6,
            border: '1px solid rgba(74,222,128,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>💰</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Cash</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#4ADE80' }}>{formatMoney(cash)}</span>
          </div>

          {ownedIds.length === 0 && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textAlign: 'center', padding: '12px 0' }}>
              Buy your first company to see it here!
            </div>
          )}
          {(() => {
            let portfolioTotal = 0
            const rows = ownedIds.map(id => {
              const co = COMPANIES.find(c => c.id === id)
              const cs = companyStates[id]
              const entry = portfolio[id]
              if (!co || !cs || !entry) return null
              const locMult = calcLocationsMultiplier(entry.locations)
              const companyValue = Math.round(cs.profit * cs.multiplier * locMult)
              portfolioTotal += companyValue
              return { id, co, cs, entry, locMult, companyValue }
            }).filter(Boolean)
            const breakdownTotal = Math.round(cash) + portfolioTotal
            return (
              <>
                {rows.map(({ id, co, cs, entry, locMult, companyValue }) => (
                  <div
                    key={id}
                    onClick={() => onSelectCompany && onSelectCompany(id)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '9px 10px', borderRadius: 10, marginBottom: 6,
                      background: 'rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{co.emoji}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{co.name}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>
                          {entry.locations} loc{entry.locations !== 1 ? 's' : ''} · {formatMoney(Math.round(cs.profit * locMult))}/turn
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#818CF8' }}>{formatMoney(companyValue)}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>tap to view →</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 6, paddingTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#E2E8F0' }}>📈 Empire Value</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#818CF8' }}>{formatMoney(breakdownTotal)}</span>
                  </div>
                  <div style={{
                    marginTop: 6, padding: '6px 10px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 8,
                    fontSize: 12, fontWeight: 700, color: '#818CF8', textAlign: 'center',
                  }}>
                    $1B goal · {Math.min(100, Math.round((breakdownTotal / 1000000000) * 100))}% there
                  </div>
                </div>
              </>
            )
          })()}
        </div>

        {/* Portfolio ROI */}
        {ownedIds.length > 0 && (
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
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
              const gainColor  = totalGain >= 0 ? '#4ADE80' : '#FCA5A5'
              const gainBg     = totalGain >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)'
              const gainBorder = totalGain >= 0 ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'
              const isExpanded = expandedROI === id
              return (
                <div key={id} style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 12, marginBottom: 8,
                  border: '1px solid rgba(255,255,255,0.07)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px', cursor: 'pointer' }} onClick={() => onSelectCompany && onSelectCompany(id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{co.emoji}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#E2E8F0' }}>{co.name}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>
                            {entry.locations} location{entry.locations !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setExpandedROI(isExpanded ? null : id) }}
                        style={{
                          background: gainBg, border: `1px solid ${gainBorder}`,
                          borderRadius: 10, padding: '4px 10px', textAlign: 'right',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 900, color: gainColor }}>{roi >= 0 ? '+' : ''}{roi}% ROI</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: gainColor, opacity: 0.8 }}>{totalGain >= 0 ? '+' : ''}{formatMoney(totalGain)} total</div>
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { label: 'Invested', val: formatMoney(totalInvested),         color: 'rgba(255,255,255,0.6)' },
                        { label: 'Value Now', val: formatMoney(currentValue),          color: '#818CF8'               },
                        { label: 'Profits',   val: '+' + formatMoney(profitsCollected), color: '#4ADE80'               },
                      ].map(item => (
                        <div key={item.label} style={{
                          flex: 1, textAlign: 'center', padding: '6px',
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>{item.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ background: gainBg, borderTop: `1px solid ${gainBorder}`, padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: gainColor, marginBottom: 4 }}>How ROI is calculated</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>
                        <strong>ROI = (Value Change + Profits Collected) ÷ Total Invested</strong><br />
                        Value change: {valueChange >= 0 ? '+' : ''}{formatMoney(valueChange)} · Profits: +{formatMoney(profitsCollected)}<br />
                        Total gain {totalGain >= 0 ? '+' : ''}{formatMoney(totalGain)} on {formatMoney(totalInvested)} invested = <strong>{roi >= 0 ? '+' : ''}{roi}%</strong>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {(() => {
              let totalInv = 0, totalVal = 0, totalProf = 0
              ownedIds.forEach(id => {
                const cs = companyStates[id]; const entry = portfolio[id]
                if (!cs || !entry) return
                const locMult = calcLocationsMultiplier(entry.locations)
                totalInv  += (entry.purchasePrice || 0) + (entry.locationSpend || 0)
                totalVal  += Math.round(cs.profit * cs.multiplier * locMult)
                totalProf += entry.profitsCollected || 0
              })
              const totalGain = (totalVal - totalInv) + totalProf
              const totalROI  = totalInv > 0 ? Math.round((totalGain / totalInv) * 100) : 0
              const gc = totalGain >= 0 ? '#4ADE80' : '#FCA5A5'
              return (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Total Portfolio
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { label: 'Invested', val: formatMoney(totalInv),  color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.04)' },
                      { label: 'Value',    val: formatMoney(totalVal),   color: '#818CF8',               bg: 'rgba(99,102,241,0.1)'   },
                      { label: 'ROI',      val: (totalROI >= 0 ? '+' : '') + totalROI + '%', color: gc,
                        bg: totalGain >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)' },
                    ].map(item => (
                      <div key={item.label} style={{ flex: 1, textAlign: 'center', padding: '8px', background: item.bg, borderRadius: 10 }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: item.color }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Economy Status */}
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            🌍 Economy Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: econColor + '20',
              border: `1px solid ${econColor}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {economy.state === 'booming' ? '📈' : economy.state === 'slowdown' ? '📉' : '📊'}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: econColor }}>{getEconomyLabel(economy.state)}</div>
              {(economy.preSignal === 'preSlowdown' || economy.preSignal === 'preBoom') && (
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {economy.preSignal === 'preSlowdown' ? '⚠️ Leading Indicator: Recession ahead' : '🌱 Leading Indicator: Expansion ahead'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sector Trends */}
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
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
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                opacity: isUnlocked ? 1 : 0.35,
              }}>
                <span style={{ fontSize: 20, marginRight: 10 }}>{sector.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isUnlocked ? '#E2E8F0' : 'rgba(255,255,255,0.4)' }}>
                    {sector.name}
                    {!isUnlocked && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>🔒 locked</span>}
                  </div>
                  {isUnlocked && cycle && (cycle.preSignal === 'preSlowdown' || cycle.preSignal === 'preBoom') && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                      {cycle.preSignal === 'preSlowdown' ? '⚠️ Leading Indicator: Downturn' : '🌱 Leading Indicator: Expansion'}
                    </div>
                  )}
                </div>
                {isUnlocked && (
                  <div style={{
                    fontSize: 12, fontWeight: 700, color,
                    background: color + '18',
                    border: `1px solid ${color}30`,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {getSectorStateLabel(state)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>}

    </div>
  )
}

function TrophyCase({ earned }) {
  const unlockedCount = earned.length
  const totalCount = ACHIEVEMENTS_CATALOG.length

  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{
        background: 'rgba(252,211,77,0.08)',
        border: '1px solid rgba(252,211,77,0.2)',
        borderRadius: 14, padding: '14px 16px',
        marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ fontSize: 36 }}>🏆</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FCD34D' }}>
            {unlockedCount} / {totalCount} Trophies
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {unlockedCount === totalCount ? 'You collected them all! 🎉' : `${totalCount - unlockedCount} still to unlock`}
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 8 }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${Math.round((unlockedCount / totalCount) * 100)}%`,
              background: 'linear-gradient(90deg, #FCD34D, #F59E0B)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {unlockedCount > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Unlocked
          </div>
          {ACHIEVEMENTS_CATALOG.filter(a => earned.includes(a.id)).map(a => (
            <div key={a.id} style={{
              background: 'rgba(252,211,77,0.08)',
              border: '1.5px solid rgba(252,211,77,0.25)',
              borderRadius: 12, padding: '11px 14px',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{a.label.split(' ')[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#FCD34D' }}>{a.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(252,211,77,0.6)', marginTop: 1 }}>{a.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 18 }}>✅</div>
            </div>
          ))}
        </div>
      )}

      {unlockedCount < totalCount && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Locked
          </div>
          {ACHIEVEMENTS_CATALOG.filter(a => !earned.includes(a.id)).map(a => (
            <div key={a.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '11px 14px',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: 0.5,
            }}>
              <div style={{ fontSize: 26, flexShrink: 0, filter: 'grayscale(1)' }}>{a.label.split(' ')[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#E2E8F0' }}>{a.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{a.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 18 }}>🔒</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
