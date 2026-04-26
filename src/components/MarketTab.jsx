import React from 'react'
import { SECTORS } from '../data/companies.js'
import Sparkline from './Sparkline.jsx'
import { formatMoney, getEconomyLabel, getEconomyColor, getSectorStateLabel, getSectorStateColor } from '../game/engine.js'

export default function MarketTab({ economy, sectorCycles, netWorthHistory, cash, difficulty, level }) {
  const econColor = getEconomyColor(economy.state)
  const interestRate = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 1 : 2

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
          📊 Market Overview
        </div>
      </div>

      <div style={{ padding: '12px 14px' }}>

        {/* Economy Status */}
        <div style={{
          background: '#fff', borderRadius: 14,
          padding: '16px', marginBottom: 12,
          border: `2px solid ${econColor}40`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Economy Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: econColor + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {economy.state === 'booming' ? '📈' : economy.state === 'slowdown' ? '📉' : '📊'}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: econColor }}>
                {getEconomyLabel(economy.state)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginTop: 2 }}>
                {economy.turnsLeft} turn{economy.turnsLeft !== 1 ? 's' : ''} remaining
                {economy.preSignal === 'preSlowdown' ? ' · ⚠️ Slowdown approaching' : ''}
                {economy.preSignal === 'preBoom' ? ' · 🌱 Recovery approaching' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Sector Trends */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
            Sector Trends
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
                borderBottom: '1px solid #F1F5F9',
                opacity: isUnlocked ? 1 : 0.4,
              }}>
                <span style={{ fontSize: 20, marginRight: 10 }}>{sector.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                    {sector.name}
                    {!isUnlocked && <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 6 }}>🔒 locked</span>}
                  </div>
                  {isUnlocked && cycle && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginTop: 1 }}>
                      {cycle.turnsLeft} turn{cycle.turnsLeft !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
                {isUnlocked && (
                  <div style={{
                    fontSize: 12, fontWeight: 800,
                    color: color,
                    background: color + '20',
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {getSectorStateLabel(state)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Net Worth History */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
            Net Worth History
          </div>
          {netWorthHistory.length > 1 ? (
            <>
              <Sparkline
                data={netWorthHistory}
                width={320}
                height={64}
                color="#1D4ED8"
                strokeWidth={2.5}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
                  Start: {formatMoney(netWorthHistory[0])}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#1D4ED8' }}>
                  Now: {formatMoney(netWorthHistory[netWorthHistory.length - 1])}
                </span>
              </div>
            </>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 600, padding: '16px 0' }}>
              Net worth chart appears after your first turn!
            </div>
          )}
        </div>

        {/* Interest Rate */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Cash Interest Rate
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#16A34A' }}>{interestRate}%</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', marginLeft: 6 }}>per turn</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>Cash on hand</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>{formatMoney(cash)}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', fontWeight: 600, marginTop: 8, lineHeight: 1.4 }}>
            Your idle cash earns {interestRate}% interest every turn. Holding cash is safe — but companies can earn much more. Find the right balance!
          </p>
        </div>

      </div>
    </div>
  )
}
