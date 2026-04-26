import React from 'react'

export default function Sparkline({ data = [], width = 120, height = 36, color = '#22C55E', strokeWidth = 2 }) {
  if (!data || data.length < 2) {
    return (
      <svg width={width} height={height}>
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4 3" />
      </svg>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 3

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return [x, y]
  })

  const pathD = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')

  // Fill area under line
  const fillD = pathD +
    ` L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`

  const lastPoint = points[points.length - 1]
  const trend = data[data.length - 1] >= data[data.length - 2] ? color : '#EF4444'

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sparkFill_${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sparkFill_${color.replace('#','')})`} />
      <path d={pathD} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r={3} fill={trend} />
    </svg>
  )
}
