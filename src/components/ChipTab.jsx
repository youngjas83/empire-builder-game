import React from 'react'
import Chip from './Chip.jsx'
import { QA_CATEGORIES, searchQA } from '../data/qa.js'
import { COMPANIES } from '../data/companies.js'
import { formatMoney, calcNetWorth, calcProfitPerTurn, ACHIEVEMENTS_CATALOG } from '../game/engine.js'

export default function ChipTab({ state, onSubTabChange, onSearchChange, onToggleQuestion }) {
  const { chipSubTab, chipSearch, expandedQuestion, portfolio, companyStates, cash, difficulty } = state

  const filteredCategories = searchQA(chipSearch)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #374151, #1F2937)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 0, paddingLeft: 16, paddingRight: 16,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
          🤖 Chip
        </div>
        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'qa', label: 'Q&A Bank' },
            { id: 'empire', label: 'My Empire' },
            { id: 'trophies', label: '🏆 Trophies' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onSubTabChange(tab.id)}
              style={{
                flex: 1, padding: '10px',
                background: 'none', border: 'none',
                borderBottom: `3px solid ${chipSubTab === tab.id ? '#FCD34D' : 'transparent'}`,
                color: chipSubTab === tab.id ? '#FCD34D' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {chipSubTab === 'qa' ? (
          <QABank
            categories={filteredCategories}
            search={chipSearch}
            expandedQuestion={expandedQuestion}
            onSearchChange={onSearchChange}
            onToggleQuestion={onToggleQuestion}
          />
        ) : chipSubTab === 'trophies' ? (
          <Trophies earned={state.achievements || []} />
        ) : (
          <MyEmpire state={state} />
        )}
      </div>
    </div>
  )
}

function QABank({ categories, search, expandedQuestion, onSearchChange, onToggleQuestion }) {
  return (
    <div style={{ padding: '12px 14px' }}>
      {/* Search */}
      <div style={{
        position: 'relative', marginBottom: 14,
      }}>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search questions..."
          style={{
            width: '100%', padding: '11px 14px 11px 38px',
            background: '#fff',
            border: '1.5px solid #E2E8F0',
            borderRadius: 12,
            fontSize: 15, fontFamily: 'inherit',
            color: '#1E293B',
            outline: 'none',
          }}
        />
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 16, pointerEvents: 'none',
        }}>
          🔍
        </span>
      </div>

      {categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', color: '#9CA3AF', fontWeight: 600 }}>
          No questions found for "{search}"
        </div>
      )}

      {categories.map(cat => (
        <div key={cat.id} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
            {cat.label}
          </div>
          {cat.questions.map(q => {
            const isExpanded = expandedQuestion === q.id
            return (
              <div
                key={q.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  marginBottom: 8,
                  overflow: 'hidden',
                  border: `1.5px solid ${isExpanded ? '#1D4ED8' : '#E2E8F0'}`,
                }}
              >
                <button
                  onClick={() => onToggleQuestion(q.id)}
                  style={{
                    width: '100%', padding: '13px 14px',
                    background: 'none', border: 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', flex: 1 }}>
                    {q.q}
                  </span>
                  <span style={{ fontSize: 18, color: isExpanded ? '#1D4ED8' : '#9CA3AF', marginLeft: 8, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                    ▾
                  </span>
                </button>
                {isExpanded && (
                  <div style={{
                    padding: '0 14px 14px',
                    borderTop: '1px solid #EFF6FF',
                    background: '#F8FAFC',
                  }}>
                    <div style={{ display: 'flex', gap: 12, paddingTop: 12 }}>
                      <div style={{ flexShrink: 0 }}>
                        <Chip mood={q.mood} size={52} />
                      </div>
                      <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, fontWeight: 500, paddingTop: 4 }}>
                        {q.a}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Trophies({ earned }) {
  const unlockedCount = earned.length
  const totalCount = ACHIEVEMENTS_CATALOG.length

  return (
    <div style={{ padding: '12px 14px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B, #374151)',
        borderRadius: 14, padding: '14px 16px',
        marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ fontSize: 36 }}>🏆</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FCD34D' }}>
            {unlockedCount} / {totalCount} Trophies
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {unlockedCount === totalCount
              ? 'You collected them all! 🎉'
              : `${totalCount - unlockedCount} still to unlock`}
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, marginTop: 8, width: 180 }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${Math.round((unlockedCount / totalCount) * 100)}%`,
              background: 'linear-gradient(90deg, #FCD34D, #F59E0B)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Unlocked */}
      {unlockedCount > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Unlocked
          </div>
          {ACHIEVEMENTS_CATALOG.filter(a => earned.includes(a.id)).map(a => (
            <div key={a.id} style={{
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: '1.5px solid #FCD34D',
              borderRadius: 12, padding: '11px 14px',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{a.label.split(' ')[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#78350F' }}>
                  {a.label.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#A16207', marginTop: 1 }}>
                  {a.desc}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 18 }}>✅</div>
            </div>
          ))}
        </div>
      )}

      {/* Locked */}
      {unlockedCount < totalCount && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Locked
          </div>
          {ACHIEVEMENTS_CATALOG.filter(a => !earned.includes(a.id)).map(a => (
            <div key={a.id} style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 12, padding: '11px 14px',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: 0.6,
            }}>
              <div style={{ fontSize: 26, flexShrink: 0, filter: 'grayscale(1)' }}>{a.label.split(' ')[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#374151' }}>
                  {a.label.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', marginTop: 1 }}>
                  {a.desc}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 18 }}>🔒</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MyEmpire({ state }) {
  const { portfolio, companyStates, cash, difficulty, economy } = state

  const ownedIds = Object.keys(portfolio)
  const netWorth = calcNetWorth(cash, portfolio, companyStates)
  const profitPerTurn = calcProfitPerTurn(portfolio, companyStates)
  const interestRate = difficulty === 'easy' ? 0.03 : difficulty === 'hard' ? 0.01 : 0.02
  const cashInterest = Math.round(cash * interestRate)

  // Rule-based analysis
  const analyses = []

  // 1. Diversification
  const sectors = new Set(ownedIds.map(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co ? co.sector : null
  }).filter(Boolean))
  const sectorCount = sectors.size
  const diversificationMood = sectorCount >= 2 ? 'happy' : 'thinking'
  const diversificationText = ownedIds.length === 0
    ? "You don't own any companies yet! Start by buying one from the Empire tab."
    : sectorCount === 1
    ? `You own ${ownedIds.length} ${ownedIds.length === 1 ? 'company' : 'companies'}, all in one sector. Consider diversifying — buying companies in different sectors protects you from sector downturns!`
    : `Nice work! You own companies in ${sectorCount} different sectors. Diversification is protecting your empire from sector-specific downturns.`
  analyses.push({ emoji: '🌐', title: 'How diversified am I?', text: diversificationText, mood: diversificationMood })

  // 2. Profit per turn
  const totalEarnings = profitPerTurn + cashInterest
  analyses.push({
    emoji: '💵', title: 'How much do I earn per turn?',
    mood: totalEarnings > 0 ? 'happy' : 'thinking',
    text: ownedIds.length === 0
      ? "You're earning cash interest on your $10M but no company profits yet. Buy some companies to supercharge your income!"
      : `You earn ${formatMoney(profitPerTurn)} from your companies + ${formatMoney(cashInterest)} in cash interest = ${formatMoney(totalEarnings)} per turn total!`,
  })

  // 3. Best company
  if (ownedIds.length > 0) {
    let bestId = null, bestGain = -Infinity
    ownedIds.forEach(id => {
      const entry = portfolio[id]
      const cs = companyStates[id]
      if (!cs) return
      const locMult = 1 + (entry.locations - 1) * 0.30
      const currentVal = Math.round(cs.profit * cs.multiplier * locMult)
      const gain = (currentVal - entry.purchasePrice) + (entry.profitsCollected || 0)
      if (gain > bestGain) { bestGain = gain; bestId = id }
    })
    const bestCo = bestId ? COMPANIES.find(c => c.id === bestId) : null
    analyses.push({
      emoji: '🏆', title: 'Which company is my best?',
      mood: 'excited',
      text: bestCo
        ? `${bestCo.emoji} ${bestCo.name} is your top performer with a total gain of ${bestGain >= 0 ? '+' : ''}${formatMoney(bestGain)} (value change + profits collected)!`
        : "Buy some companies to see which one performs best!",
    })
  }

  // 4. Turns to next level
  const currentLevelReq = state.level === 1 ? 0 : [0,5000000,25000000,100000000,1000000000][state.level - 1]
  const nextLevelReqs = [5000000,25000000,100000000,1000000000]
  const nextReq = nextLevelReqs[state.level - 1]
  if (nextReq) {
    const gap = nextReq - netWorth
    const estTurns = totalEarnings > 0 ? Math.ceil(gap / totalEarnings) : '∞'
    analyses.push({
      emoji: '⏱️', title: 'How many turns to next level?',
      mood: 'thinking',
      text: gap <= 0
        ? "You've already reached the next level milestone — check your level bar!"
        : `You need ${formatMoney(gap)} more to reach the next level. At your current rate of ${formatMoney(totalEarnings)}/turn, that's about ${estTurns} turns!`,
    })
  }

  // 5. Portfolio risk
  const riskyCount = ownedIds.filter(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && co.profSens > 1.0
  }).length
  const safeCount = ownedIds.filter(id => {
    const co = COMPANIES.find(c => c.id === id)
    return co && co.profSens <= 0.4
  }).length
  analyses.push({
    emoji: '⚖️', title: 'Is my portfolio too risky?',
    mood: riskyCount > safeCount && economy.state === 'slowdown' ? 'worried' : 'thinking',
    text: ownedIds.length === 0
      ? "No companies yet — nothing to analyze! Start buying to build your portfolio."
      : riskyCount === 0 && safeCount > 0
      ? "Your portfolio is very safe! Great foundation. You could add a growth company for more upside."
      : riskyCount > 0 && safeCount === 0
      ? `You have ${riskyCount} risky ${riskyCount === 1 ? 'company' : 'companies'} and no defensive ones. A slowdown could hurt! Consider adding a low-risk company like BurgerBlast or FreshMart.`
      : `You have ${safeCount} safe and ${riskyCount} risky companies. ${economy.state === 'slowdown' ? 'Good call having defensives in this slowdown!' : 'Good balance — you have stability AND growth potential!'}`,
  })

  // 6. Best expansion candidate
  if (ownedIds.length > 0) {
    let bestExpand = null, bestExpandProfit = 0
    ownedIds.forEach(id => {
      const entry = portfolio[id]
      const cs = companyStates[id]
      const co = COMPANIES.find(c => c.id === id)
      if (!entry || !cs || !co || entry.locations >= 5) return
      const profit = cs.profit
      if (profit > bestExpandProfit) { bestExpandProfit = profit; bestExpand = id }
    })
    const expandCo = bestExpand ? COMPANIES.find(c => c.id === bestExpand) : null
    const expandCs = bestExpand ? companyStates[bestExpand] : null
    const expandCost = expandCo && expandCs
      ? Math.round(expandCs.profit * expandCs.multiplier * expandCo.locationCost)
      : 0
    analyses.push({
      emoji: '📍', title: 'Should I open more locations?',
      mood: expandCo ? 'happy' : 'thinking',
      text: expandCo
        ? `${expandCo.emoji} ${expandCo.name} is your best expansion candidate! A new location costs ${formatMoney(expandCost)} and adds ${formatMoney(Math.round(bestExpandProfit * 0.30))}/turn — you'd recoup the cost in ${expandCost > 0 ? Math.ceil(expandCost / (bestExpandProfit * 0.30)) : '?'} turns!`
        : "All your companies are already at max locations, or you don't own any yet!",
    })
  }

  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 14px', background: '#EFF6FF', borderRadius: 12 }}>
        <Chip mood="thinking" size={56} />
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
          Let me analyze your empire! Tap any question to see my take.
        </p>
      </div>

      {analyses.map((item, i) => (
        <div key={i} style={{
          background: '#fff', borderRadius: 12, padding: '14px',
          marginBottom: 10,
          border: '1.5px solid #E2E8F0',
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', marginBottom: 10 }}>
            {item.emoji} {item.title}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              <Chip mood={item.mood} size={44} />
            </div>
            <p style={{ fontSize: 14, color: '#374151', fontWeight: 500, lineHeight: 1.5, flex: 1 }}>
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
