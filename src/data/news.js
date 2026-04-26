// News template bank for the Empire Gazette

// Economy headlines by state
export const ECONOMY_HEADLINES = {
  booming: [
    "🟢 Markets soar to record highs as consumer confidence reaches 10-year peak",
    "🟢 Jobs report blows past expectations — unemployment at historic lows",
    "🟢 Business investment surges as companies bet big on growth",
    "🟢 GDP growth crushes forecasts — economists revise targets upward",
    "🟢 Stock markets rally as earnings season delivers blockbuster results",
  ],
  steady: [
    "🟡 Mixed economic signals leave analysts cautiously optimistic",
    "🟡 Economy holds steady as growth continues at moderate pace",
    "🟡 Federal Reserve holds interest rates — markets settle into equilibrium",
    "🟡 Business sentiment stable as companies plan modest expansions",
    "🟡 Consumer spending steady — no big swings in either direction",
  ],
  slowdown: [
    "🔴 Rising interest rates dampen business investment outlook",
    "🔴 Consumer spending drops as households tighten budgets",
    "🔴 Layoffs hit major corporations as earnings disappoint",
    "🔴 GDP growth slows sharply — economists warn of prolonged weakness",
    "🔴 Credit conditions tighten as banks become more cautious",
  ],
  preSlowdown: [
    "🟡 Inflation data raises concerns — Federal Reserve may hike rates soon",
    "🟡 Analyst warns: 'The party can't last forever' as growth shows cracks",
    "🟡 Supply chain pressures building — companies brace for headwinds",
    "🟡 Inverted yield curve spooks markets: slowdown signal or false alarm?",
  ],
  preBoom: [
    "🟡 Green shoots emerging: leading economic indicators point up",
    "🟡 Economists spot recovery signs in latest employment report",
    "🟡 Business confidence ticks higher as conditions quietly improve",
    "🟡 'The worst may be behind us,' says top market analyst",
  ],
}

export const ECONOMY_CHIP_TAKES = {
  booming: "The economy is booming! Great time to own growth companies. Just watch for signs of a slowdown — good times don't last forever.",
  steady: "Markets are steady. A good time to research companies and plan your next move!",
  slowdown: "Slowdown mode! Stick with defensive companies like BurgerBlast and FreshMart. Cash is your friend right now.",
  preSlowdown: "Hmm, I'm seeing some warning signs in the economy. Maybe start thinking about which companies hold up best in tough times...",
  preBoom: "Things look like they might be improving! Start thinking about growth companies that could really take off in a boom.",
}

// Sector headlines by sector and state
export const SECTOR_HEADLINES = {
  consumer: {
    boom: [
      "🛍️ Consumer spending hits record — shoppers splurging on everything",
      "🛍️ Retail sales explode as consumers feel flush with cash",
      "🛍️ Brand loyalty surges — consumers rewarding their favorite companies",
    ],
    normal: [
      "🛍️ Consumer market holds steady — spending matches seasonal norms",
      "🛍️ Retail trends: nothing dramatic, just steady traffic",
    ],
    downturn: [
      "🛍️ Consumer confidence drops — shoppers cut discretionary spending",
      "🛍️ Retail slump deepens as households prioritize essentials",
      "🛍️ Fashion and lifestyle brands hit hardest as spending contracts",
    ],
  },
  realEstate: {
    boom: [
      "🏠 Property values surge as housing shortage drives bidding wars",
      "🏠 Real estate boom continues — rents up, vacancies down",
      "🏠 Investors flood into real estate as returns outpace other sectors",
    ],
    normal: [
      "🏠 Real estate market stable — steady rents, normal vacancy rates",
      "🏠 Property market moves sideways — no major shifts either way",
    ],
    downturn: [
      "🏠 Rising mortgage rates cool real estate market significantly",
      "🏠 Office vacancies spike — landlords offer steep discounts to fill space",
      "🏠 Real estate slowdown: transactions drop as buyers sit on sidelines",
    ],
  },
}

// Company gossip headlines (mix of real signals and red herrings)
export const COMPANY_GOSSIP = {
  burgerblast: {
    positive: [
      "🍔 BurgerBlast goes viral on TikTok — lines stretching around the block",
      "🍔 BurgerBlast announces new value menu — analysts expect traffic surge",
      "🍔 'BurgerBlast hasn't put a foot wrong in years,' says top food analyst",
    ],
    neutral: [
      "🍔 BurgerBlast rolls out loyalty app — early download numbers strong",
      "🍔 BurgerBlast opens 50 new locations in the Midwest this quarter",
    ],
    negative: [
      "🍔 Health food trend concerns analysts — will BurgerBlast adapt in time?",
      "🍔 BurgerBlast faces higher ingredient costs — margin squeeze ahead?",
    ],
  },
  novadrip: {
    positive: [
      "👟 NovaDrip collaboration with top rapper sells out in 4 minutes",
      "👟 NovaDrip named 'Brand of the Year' by Teen Vogue — demand exploding",
      "👟 NovaDrip limited drop creates overnight campouts outside stores",
    ],
    neutral: [
      "👟 NovaDrip announces new colorway — social media buzzing with opinions",
    ],
    negative: [
      "👟 Rival brand poaching NovaDrip's celebrity endorsers",
      "👟 'Is NovaDrip losing its cool?' — fashion blogs raise questions",
      "👟 NovaDrip hit by supply issues — limited inventory this season",
    ],
  },
  glowlab: {
    positive: [
      "✨ GlowLab celebrity endorsement deal announced — subscriptions soaring",
      "✨ GlowLab named #1 skincare brand by major beauty publication",
      "✨ Dermatologist study backs GlowLab's flagship serum — credibility boost",
    ],
    neutral: [
      "✨ GlowLab launches new men's line — early reception positive",
      "✨ GlowLab expands to 20 new countries this year",
    ],
    negative: [
      "✨ Social media backlash over GlowLab ingredient controversy — minor",
    ],
  },
  freshmart: {
    positive: [
      "🛒 FreshMart customer count up 18% — budget-conscious shoppers pile in",
      "🛒 FreshMart store-brand products beating national brands on price",
      "🛒 FreshMart wins 'Best Value Grocery' award for third year running",
    ],
    neutral: [
      "🛒 FreshMart expanding private label line — analysts say margins will improve",
    ],
    negative: [
      "🛒 FreshMart struggles in boom times — customers upgrade to premium stores",
    ],
  },
  toycraze: {
    positive: [
      "🎮 ToyCraze collectible named 'Toy of the Year' — parents panic-buying",
      "🎮 ToyCraze sells out nationally — resale prices 10× retail on eBay",
      "🎮 ToyCraze featured in major movie — demand about to explode",
    ],
    neutral: [
      "🎮 ToyCraze announces Series 2 — fans divided on whether it'll be as hot",
    ],
    negative: [
      "🎮 ToyCraze inventory flooding stores — the craze may be cooling off",
      "🎮 Competitor launches similar toy at half the price of ToyCraze",
      "🎮 ToyCraze trend reversal? Social media posts down 40% vs. last month",
    ],
  },
  pixelwear: {
    positive: [
      "👕 PixelWear collaboration with top gaming streamer drives massive sales",
      "👕 PixelWear named official apparel sponsor of major esports tournament",
    ],
    neutral: [
      "👕 PixelWear drops new collection — reviews mixed but sales solid",
    ],
    negative: [
      "👕 PixelWear's latest drop underwhelms — critics call it 'uninspired'",
      "👕 Gaming apparel market getting crowded — PixelWear faces new rivals",
    ],
  },
  skyflats: {
    positive: [
      "🏢 SkyFlats reports 99% occupancy — waiting lists growing in all cities",
      "🏢 SkyFlats raises rents 8% — tenants staying anyway, demand is that strong",
    ],
    neutral: [
      "🏢 SkyFlats acquires two new apartment buildings in prime locations",
    ],
    negative: [
      "🏢 New zoning laws may add costs to SkyFlats expansion plans",
    ],
  },
  megamall: {
    positive: [
      "🏪 MegaMall Black Friday traffic up — but analysts warn it's seasonal noise",
    ],
    neutral: [
      "🏪 MegaMall diversifying into pop-up experiences to drive foot traffic",
    ],
    negative: [
      "🏪 Another anchor tenant leaves MegaMall — now 3 vacant storefronts",
      "🏪 MegaMall foot traffic down 22% year-over-year as online shopping grows",
      "🏪 Online shopping hits new record — analysts question MegaMall's future",
    ],
  },
  storesafe: {
    positive: [
      "📦 StoreSafe reports record occupancy — city living drives storage demand",
      "📦 StoreSafe's newest facility in downtown opens fully booked",
    ],
    neutral: [
      "📦 StoreSafe raising prices 5% — customers willing to pay for convenience",
    ],
    negative: [
      "📦 StoreSafe faces competition from new low-cost storage startup",
    ],
  },
  towerone: {
    positive: [
      "🏙️ TowerOne lands big tech company as anchor tenant — floors filling up",
    ],
    neutral: [
      "🏙️ TowerOne converting unused office floors to residential — bold move",
    ],
    negative: [
      "🏙️ TowerOne vacancy rate hits 35% as companies cut office space",
      "🏙️ Major TowerOne tenant announces work-from-home permanently",
      "🏙️ Downtown office market in freefall — TowerOne in the crosshairs",
    ],
  },
  warehousex: {
    positive: [
      "🏭 WarehouseX wins 10-year contract with nation's largest retailer",
      "🏭 WarehouseX capacity utilization at 97% — cannot keep up with demand",
      "🏭 E-commerce holiday rush sets new record — WarehouseX running 24/7",
    ],
    neutral: [
      "🏭 WarehouseX breaks ground on massive new robotics-enabled facility",
    ],
    negative: [
      "🏭 WarehouseX faces worker shortage — operations running below capacity",
    ],
  },
  sunvilla: {
    positive: [
      "🏖️ SunVilla resort bookings up 40% — luxury travel boom in full swing",
      "🏖️ SunVilla wins 'Best Luxury Resort' award — bookings spike overnight",
    ],
    neutral: [
      "🏖️ SunVilla launches new wellness package — early demand encouraging",
    ],
    negative: [
      "🏖️ Hurricane season forecast dampens SunVilla's beachfront bookings",
      "🏖️ SunVilla feeling the pinch as consumers cut luxury travel spending",
    ],
  },
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateNews(economy, sectorCycles, ownedCompanies, turn) {
  const headlines = []

  // Economy headline (always 1)
  const econState = economy.preSignal || economy.state
  const econHeadlines = ECONOMY_HEADLINES[econState] || ECONOMY_HEADLINES[economy.state]
  headlines.push({ tier: 'economy', text: pickRandom(econHeadlines) })

  // Sector headlines (1 per unlocked sector)
  const unlockedSectors = ['consumer', 'realEstate']
  unlockedSectors.forEach(sectorId => {
    const sectorState = sectorCycles[sectorId] ? sectorCycles[sectorId].state : 'normal'
    const sectorPool = SECTOR_HEADLINES[sectorId]
    if (sectorPool) {
      const pool = sectorPool[sectorState] || sectorPool.normal
      headlines.push({ tier: 'sector', sectorId, text: pickRandom(pool) })
    }
  })

  // Company gossip (1-2 items, prefer owned companies)
  const allIds = ['burgerblast','novadrip','glowlab','freshmart','toycraze','pixelwear','skyflats','megamall','storesafe','towerone','warehousex','sunvilla']
  const gossipPool = ownedCompanies.length > 0
    ? [...ownedCompanies, ...allIds.filter(id => !ownedCompanies.includes(id))].slice(0, 4)
    : allIds.slice(0, 4)

  const gossipCount = Math.random() < 0.5 ? 1 : 2
  const usedIds = new Set()
  for (let i = 0; i < gossipCount && gossipPool.length > 0; i++) {
    let id = null
    for (const candidate of gossipPool) {
      if (!usedIds.has(candidate)) { id = candidate; break }
    }
    if (!id) break
    usedIds.add(id)
    const companyGossip = COMPANY_GOSSIP[id]
    if (!companyGossip) continue
    const sentiment = Math.random() < 0.4 ? 'negative' : Math.random() < 0.6 ? 'positive' : 'neutral'
    const pool = companyGossip[sentiment] || companyGossip.neutral || companyGossip.positive
    if (pool && pool.length > 0) {
      headlines.push({ tier: 'gossip', companyId: id, text: pickRandom(pool) })
    }
  }

  const chipTake = ECONOMY_CHIP_TAKES[economy.state] || ECONOMY_CHIP_TAKES.steady

  return { headlines, chipTake }
}
