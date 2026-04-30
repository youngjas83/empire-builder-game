import React from 'react'
import Chip from './Chip.jsx'
import { COMPANIES, SECTORS } from '../data/companies.js'
import { getSectorStateColor } from '../game/engine.js'

export default function NewsModal({
  turn, currentNews, economy, onClose, onSelectCompany,
  sectorCycles, difficulty, level, chipGuideStep,
}) {
  if (!currentNews) return null

  const { headlines, chipTake } = currentNews

  const chipMood = economy.state === 'booming' ? 'excited'
    : economy.state === 'slowdown' ? 'worried'
    : 'happy'

  const flashItems    = headlines.filter(h => h.tier === 'flash')
  const companyItems  = headlines.filter(h => h.tier === 'companyNews')
  const downturnItems = headlines.filter(h =>
    h.tier === 'sector' && sectorCycles && sectorCycles[h.sectorId] &&
    (sectorCycles[h.sectorId].state === 'downturn' || sectorCycles[h.sectorId].preSignal === 'preSlowdown')
  )

  function handleHeadlineClick(item) {
    if (item.companyId && onSelectCompany) {
      onClose()
      onSelectCompany(item.companyId)
    }
  }

  const visibleSectors = Object.values(SECTORS).filter(s => level >= s.unlockLevel)
  const econState = economy.preSignal || economy.state
  const econLabel = econState === 'booming' ? '🟢 Booming'
    : econState === 'slowdown' ? '🔴 Slowdown'
    : econState === 'preSlowdown' ? '🟡 Steady · ⚠️ Slowing'
    : econState === 'preBoom' ? '🟡 Steady · 🌱 Recovering'
    : '🟡 Steady'
  const econColor = economy.state === 'booming' ? '#4ADE80' : economy.state === 'slowdown' ? '#FCA5A5' : '#FCD34D'

  function getSectorCycleLabel(cycle) {
    if (!cycle) return '🟡 Normal'
    if (cycle.state === 'boom') return '🟢 Boom'
    if (cycle.state === 'downturn') return '🔴 Downturn'
    if (cycle.preSignal === 'preSlowdown') return '🟡 Normal · ⚠️ Slowing'
    if (cycle.preSignal === 'preBoom') return '🟡 Normal · 🌱 Recovering'
    return '🟡 Normal'
  }

  function getOverviewRowBg(cycle) {
    if (!cycle) return null
    if (cycle.state === 'boom') return 'rgba(34,197,94,0.08)'
    if (cycle.state === 'downturn') return 'rgba(239,68,68,0.08)'
    if (cycle.preSignal === 'preSlowdown') return 'rgba(252,211,77,0.06)'
    return null
  }

  const showColors = difficulty === 'easy'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(0,0,16,0.75)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        width: '100%',
        background: '#0F172A',
        borderRadius: '24px 24px 0 0',
        maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderBottom: 'none',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>

        <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, margin: '12px auto 0', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          margin: '12px 12px 0',
          borderRadius: 18,
          padding: '14px 16px',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#E2E8F0' }}>📰 Empire Gazette</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              Turn {turn} · Breaking Headlines
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
            }}
          >✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}>

          {/* Guide step 3 */}
          {chipGuideStep === 3 && (
            <div style={{
              background: 'linear-gradient(135deg, #4338CA, #7C3AED)',
              borderRadius: 14, padding: '12px 14px',
              marginBottom: 10,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              boxShadow: '0 4px 18px rgba(99,102,241,0.3)',
            }}>
              <Chip mood="excited" size={46} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 3 }}>Your profit just landed! 🎉</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.45 }}>
                  Every turn, owned companies pay you profit automatically. Check the news, then keep buying and growing! I'll stop interrupting you now — good luck! 💪
                </div>
              </div>
            </div>
          )}

          {/* FLASH SALE ALERT */}
          {flashItems.map((item, i) => {
            const co = item.companyId ? COMPANIES.find(c => c.id === item.companyId) : null
            return (
              <div
                key={`flash-${i}`}
                onClick={() => handleHeadlineClick(item)}
                style={{
                  background: 'rgba(252,211,77,0.08)',
                  border: '2px solid rgba(252,211,77,0.35)',
                  borderRadius: 16, padding: '14px 16px',
                  marginBottom: 10,
                  cursor: item.companyId ? 'pointer' : 'default',
                  boxShadow: '0 4px 20px rgba(252,211,77,0.12)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 11, fontWeight: 900, color: '#FCD34D',
                    background: 'rgba(252,211,77,0.15)', border: '1px solid rgba(252,211,77,0.3)',
                    borderRadius: 6, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    ⚡ Flash Sale
                  </div>
                  {co && <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(252,211,77,0.7)' }}>Tap to view {co.emoji} →</span>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0', lineHeight: 1.4 }}>
                  {item.text}
                </div>
              </div>
            )
          })}

          {/* DOWNTURN ALERT */}
          {downturnItems.length > 0 && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '2px solid rgba(239,68,68,0.25)',
              borderRadius: 14, padding: '12px 14px',
              marginBottom: 10,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: '#FCA5A5',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
              }}>
                🚨 Sector Alert
              </div>
              {downturnItems.map((item, i) => (
                <div key={i} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(252,165,165,0.85)', lineHeight: 1.45, marginBottom: i < downturnItems.length - 1 ? 6 : 0 }}>
                  {item.text}
                </div>
              ))}
            </div>
          )}

          {/* MARKET OVERVIEW */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '12px 14px',
            marginBottom: 10,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
            }}>
              🌍 Market Overview
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 8px', borderRadius: 8, marginBottom: 4,
              background: showColors
                ? (economy.state === 'booming' ? 'rgba(34,197,94,0.08)' : economy.state === 'slowdown' ? 'rgba(239,68,68,0.08)' : econState === 'preSlowdown' ? 'rgba(252,211,77,0.06)' : 'transparent')
                : 'transparent',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>🌍 Economy</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: econColor }}>{econLabel}</span>
            </div>
            {visibleSectors.map(sector => {
              const cycle = sectorCycles && sectorCycles[sector.id]
              const label = getSectorCycleLabel(cycle)
              const rowBg = showColors ? getOverviewRowBg(cycle) : null
              const sColor = getSectorStateColor(cycle ? cycle.state : 'normal')
              return (
                <div key={sector.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 8px', borderRadius: 8, marginBottom: 2,
                  background: rowBg || 'transparent',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{sector.emoji} {sector.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: sColor }}>{label}</span>
                </div>
              )
            })}
          </div>

          {/* Company news items */}
          {companyItems.map((item, i) => {
            const co = item.companyId ? COMPANIES.find(c => c.id === item.companyId) : null
            const isPos = item.sentiment === 'positive'
            const isNeg = item.sentiment === 'negative'
            const border = isPos ? 'rgba(74,222,128,0.25)' : isNeg ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)'
            const bg     = isPos ? 'rgba(34,197,94,0.07)' : isNeg ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)'
            const tagColor = isPos ? '#4ADE80' : isNeg ? '#FCA5A5' : 'rgba(255,255,255,0.4)'
            return (
              <div
                key={`cn-${i}`}
                onClick={() => handleHeadlineClick(item)}
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 14, padding: '12px 14px',
                  marginBottom: 8,
                  cursor: item.companyId ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{
                    display: 'inline-block',
                    fontSize: 10, fontWeight: 800, color: tagColor,
                    background: tagColor + '18', border: `1px solid ${tagColor}30`,
                    borderRadius: 6, padding: '2px 8px',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    📣 {isPos ? '+6% next turn' : isNeg ? '−6% next turn' : 'Company News'}
                  </div>
                  {co && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: tagColor, opacity: 0.7 }}>
                      {co.emoji} tap to view →
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.45 }}>
                  {item.text}
                </div>
              </div>
            )
          })}

          {/* Chip's Take */}
          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1.5px solid rgba(99,102,241,0.25)',
            borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            marginBottom: 4,
          }}>
            <div style={{ flexShrink: 0, marginTop: -4 }}>
              <Chip mood={chipMood} size={54} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#818CF8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>
                🤖 Chip's Take
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: 0 }}>
                {chipTake}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '10px 12px 14px', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #4338CA, #7C3AED)',
              color: '#fff', border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            Start Turn {turn} →
          </button>
        </div>
      </div>
    </div>
  )
}
