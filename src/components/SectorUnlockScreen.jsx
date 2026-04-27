import React, { useEffect, useState } from 'react'
import { COMPANIES, SECTORS } from '../data/companies.js'
import { formatMoney } from '../game/engine.js'
import Chip from './Chip.jsx'

export default function SectorUnlockScreen({ sectorId, onContinue }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const sector = SECTORS[sectorId]
  if (!sector) return null

  const companies = COMPANIES.filter(c => c.sector === sectorId).slice(0, 3)

  const chipMessages = {
    entertainment: "Oh WOW! You've unlocked Entertainment! 🎉 We're talking StreamFlix with 300 million subscribers, Thunder FC with fans on every continent, GameBox Studios, and more. These companies are HUGE — and some earn millions per turn. Time to play in the big leagues!",
    tech: "TECH IS UNLOCKED! 💻🚀 Welcome to the future. Tech companies can have the highest multipliers in the game — investors go crazy for tech. More risk, but the gains? They can be absolutely insane. You've earned this!",
    industrials: "INDUSTRIALS UNLOCKED! ⚙️ You're now a serious empire builder. These are the backbone companies of the whole economy — energy, manufacturing, infrastructure. Steady, powerful, and incredibly valuable. Almost at a billion!",
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 50%, #1E3A8A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px 20px',
      paddingTop: 'env(safe-area-inset-top, 20px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
      overflowY: 'auto',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {/* Stars background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: '50%',
            background: '#fff',
            opacity: Math.random() * 0.6 + 0.2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 2 + 1}s infinite alternate`,
          }} />
        ))}
        <style>{`@keyframes twinkle { from { opacity: 0.2 } to { opacity: 0.9 } }`}</style>
      </div>

      {/* UNLOCKED banner */}
      <div style={{
        fontSize: 13, fontWeight: 900, color: '#FCD34D',
        letterSpacing: '0.25em', textTransform: 'uppercase',
        marginBottom: 12, opacity: 0.9,
      }}>
        🔓 Now Unlocked
      </div>

      {/* Sector emoji */}
      <div style={{
        fontSize: 80,
        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.4))',
        marginBottom: 12,
        animation: 'bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        <style>{`@keyframes bounceIn { from { transform: scale(0.3); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
        {sector.emoji}
      </div>

      {/* Sector name */}
      <div style={{
        fontSize: 32, fontWeight: 900, color: '#fff',
        textAlign: 'center', marginBottom: 6,
        textShadow: '0 2px 20px rgba(255,255,255,0.3)',
      }}>
        {sector.name}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
        textAlign: 'center', marginBottom: 24,
      }}>
        {sector.description}
      </div>

      {/* Company previews */}
      <div style={{ width: '100%', maxWidth: 360, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, textAlign: 'center' }}>
          Companies now available
        </div>
        {companies.map(co => (
          <div key={co.id} style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 14, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 8,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${co.gradientFrom}, ${co.gradientTo})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              {co.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{co.name}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                {formatMoney(co.baseProfit)}/turn · {co.baseMultiplier}× multiplier
              </div>
            </div>
          </div>
        ))}
        {COMPANIES.filter(c => c.sector === sectorId).length > 3 && (
          <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
            + {COMPANIES.filter(c => c.sector === sectorId).length - 3} more companies inside →
          </div>
        )}
      </div>

      {/* Chip's message */}
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 16, padding: '14px 16px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        marginBottom: 20,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ flexShrink: 0, marginTop: -4 }}>
          <Chip mood="excited" size={48} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.55, margin: 0, flex: 1 }}>
          {chipMessages[sectorId] || `Amazing! You've unlocked ${sector.name}! Time to explore incredible new investment opportunities!`}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onContinue}
        style={{
          width: '100%', maxWidth: 360, padding: '16px',
          background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
          color: '#1E293B', border: 'none', borderRadius: 16,
          fontSize: 18, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(252,211,77,0.5)',
          letterSpacing: '0.01em',
        }}
      >
        Let's Go! 🚀
      </button>
    </div>
  )
}
