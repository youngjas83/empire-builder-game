import React from 'react'
import Chip from './Chip.jsx'

export default function NewsTab({ currentNews, economy, turn }) {
  if (!currentNews || !currentNews.headlines) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>
        No news yet.
      </div>
    )
  }

  const { headlines, chipTake } = currentNews

  const tierLabel = {
    economy: '🌍 Economy',
    sector: '🏭 Sector',
    gossip: '📣 Company Gossip',
  }

  const tierColor = {
    economy: '#1D4ED8',
    sector: '#7C3AED',
    gossip: '#EA580C',
  }

  const mood = economy.state === 'booming' ? 'excited'
    : economy.state === 'slowdown' ? 'worried'
    : 'happy'

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B, #374151)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#FCD34D' }}>
          📰 Empire Gazette
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
          Turn {turn} Headlines
        </div>
      </div>

      <div style={{ padding: '12px 14px' }}>
        {headlines.map((item, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 10,
              borderLeft: `4px solid ${tierColor[item.tier] || '#E2E8F0'}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: tierColor[item.tier] || '#9CA3AF',
              textTransform: 'uppercase', letterSpacing: '0.07em',
              marginBottom: 5,
            }}>
              {tierLabel[item.tier] || item.tier}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
              {item.text}
            </div>
          </div>
        ))}

        {/* Chip's Take */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: 14, padding: '14px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          marginTop: 8,
        }}>
          <div style={{ flexShrink: 0, marginTop: -4 }}>
            <Chip mood={mood} size={60} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#1D4ED8', marginBottom: 4 }}>
              Chip's Take
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', lineHeight: 1.5 }}>
              {chipTake}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
