// News template bank for the Empire Gazette
import { COMPANIES, SECTORS } from './companies.js'

// ─── Economy Headlines ────────────────────────────────────────────────────────

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
  booming: "The economy is booming! 🚀 Great time to own growth companies. Just watch for early slowdown signs — good times don't last forever.",
  steady: "Markets are steady. A solid time to research companies and plan your next move!",
  slowdown: "Slowdown mode! 😬 Stick with defensive companies like BurgerBlast and FreshMart. And watch for sector downturns — they drain company value every turn now!",
  preSlowdown: "⚠️ I'm seeing warning signs in the economy. Think about which companies hold up best in tough times — and which ones to sell before a sector downturn hits!",
  preBoom: "Things look like they might be improving! 🌱 Start thinking about growth companies that could really take off when the boom hits.",
}

// ─── Sector Headlines ─────────────────────────────────────────────────────────

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
    preDownturn: [
      "🛍️ ⚠️ Consumer confidence showing early cracks — retail slowdown may be coming",
      "🛍️ ⚠️ Analysts warn: consumer sector may be cooling faster than expected",
    ],
    preBoom: [
      "🛍️ 🌱 Consumer spending showing early signs of recovery",
      "🛍️ 🌱 Retail traffic picking up — consumer sector may be turning the corner",
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
    preDownturn: [
      "🏠 ⚠️ Real estate analysts spot early warning signs — sector may be cooling",
      "🏠 ⚠️ Rising rates could pressure real estate values in the near term",
    ],
    preBoom: [
      "🏠 🌱 Real estate inventory tightening — property demand quietly picking up",
      "🏠 🌱 Mortgage rates easing — property market may be set to rebound",
    ],
  },
  entertainment: {
    boom: [
      "🎭 Entertainment spending surges — people splurging on concerts, streaming, sports",
      "🎭 Box office and streaming numbers smash records this quarter",
      "🎭 Live events sell out in minutes as entertainment boom continues",
    ],
    normal: [
      "🎭 Entertainment sector steady — solid viewership and attendance numbers",
      "🎭 Streaming and live events hold their ground in a balanced quarter",
    ],
    downturn: [
      "🎭 Entertainment budgets squeezed — consumers cut subscriptions first",
      "🎭 Streaming cancellations spike as households tighten belts",
      "🎭 Live event attendance drops — ticket prices still high, wallets aren't",
    ],
    preDownturn: [
      "🎭 ⚠️ Entertainment sector showing stress — subscription churn rising",
      "🎭 ⚠️ Analysts warn entertainment spending may be peaking",
    ],
    preBoom: [
      "🎭 🌱 Entertainment demand quietly recovering — streaming signups tick up",
      "🎭 🌱 Live event bookings recovering — entertainment sector may be bouncing back",
    ],
  },
  tech: {
    boom: [
      "💻 Tech sector explodes — AI investment reaches historic levels",
      "💻 Software stocks surge as enterprise spending accelerates",
    ],
    normal: [
      "💻 Tech sector holds steady — innovation continues at measured pace",
    ],
    downturn: [
      "💻 Tech layoffs accelerate as companies cut costs in slowdown",
      "💻 Enterprise IT budgets frozen — software sector feels the squeeze",
    ],
    preDownturn: [
      "💻 ⚠️ Tech valuations under pressure — investors growing cautious",
    ],
    preBoom: [
      "💻 🌱 Tech hiring picks up — sector may be recovering from slowdown",
    ],
  },
  industrials: {
    boom: [
      "⚙️ Manufacturing output hits record — factory orders backlogged for months",
      "⚙️ Infrastructure spending drives industrial sector boom",
    ],
    normal: [
      "⚙️ Industrials sector stable — steady orders and employment",
    ],
    downturn: [
      "⚙️ Factory orders drop sharply as businesses cut capital spending",
      "⚙️ Industrial sector slowdown deepens — layoffs spreading",
    ],
    preDownturn: [
      "⚙️ ⚠️ Manufacturing data weakening — industrial slowdown may be coming",
    ],
    preBoom: [
      "⚙️ 🌱 Industrial orders recovering — manufacturing sector showing signs of life",
    ],
  },
}

// ─── Company Gossip ───────────────────────────────────────────────────────────

export const COMPANY_GOSSIP = {
  // Consumer
  burgerblast: {
    positive: [
      "🍔 BurgerBlast goes viral on TikTok — lines stretching around the block",
      "🍔 BurgerBlast announces new value menu — analysts expect traffic surge",
      "🍔 'BurgerBlast hasn't put a foot wrong in years,' says top food analyst",
    ],
    neutral: [
      "🍔 BurgerBlast rolls out loyalty app — early download numbers strong",
      "🍔 BurgerBlast drive-thru overhaul rolls out across 500+ restaurants — speed scores up",
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
      "👟 NovaDrip announces new colorway — social media buzzing",
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
  // Real Estate
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
  // Tech
  cloudcore: {
    positive: [
      "☁️ CloudCore wins massive government cloud contract — analysts raise price targets",
      "☁️ CloudCore enterprise signups hit record — every Fortune 500 company now a customer",
      "☁️ CloudCore unveils AI-powered cloud services — demand surges overnight",
    ],
    neutral: [
      "☁️ CloudCore breaks ground on three new data centers across the country",
      "☁️ CloudCore announces upgraded storage tier — existing customers upgrading fast",
    ],
    negative: [
      "☁️ CloudCore outage takes down thousands of websites for 3 hours — PR nightmare",
      "☁️ New rival launches cloud service at half CloudCore's price — market share at risk",
    ],
  },
  neuralaim: {
    positive: [
      "🤖 NeuralAI's new model scores top marks in every benchmark — investors go wild",
      "🤖 NeuralAI lands $2B enterprise deal — every major bank wants its AI",
      "🤖 NeuralAI breakthrough: model solves problems in seconds that took humans years",
    ],
    neutral: [
      "🤖 NeuralAI announces research partnership with top university",
      "🤖 NeuralAI releases developer toolkit — 50,000 companies sign up in a week",
    ],
    negative: [
      "🤖 Competitor launches AI model that outperforms NeuralAI at half the cost",
      "🤖 AI hype cooling? Analysts warn NeuralAI's sky-high valuation can't last",
      "🤖 NeuralAI faces regulatory probe into data privacy practices",
    ],
  },
  pixelphone: {
    positive: [
      "📱 PixelPhone pre-orders smash records — 10M units reserved before launch day",
      "📱 PixelPhone named 'Best Smartphone Ever Made' — waiting lists in every country",
      "📱 PixelPhone's new camera gets perfect scores — upgrade cycle accelerating",
    ],
    neutral: [
      "📱 PixelPhone announces annual event — new model details leak fuel excitement",
      "📱 PixelPhone expanding repair network — customer satisfaction scores climb",
    ],
    negative: [
      "📱 PixelPhone faces chip shortage — holiday shipments may fall short of demand",
      "📱 Rival launches premium phone at lower price — analysts cut PixelPhone estimates",
    ],
  },
  appnation: {
    positive: [
      "📲 AppNation's top game earns $100M in one week — platform cut is enormous",
      "📲 AppNation reports record downloads — new markets driving explosive growth",
      "📲 AppNation raises developer fees — more revenue per transaction than ever",
    ],
    neutral: [
      "📲 AppNation developer conference draws biggest crowd in company history",
      "📲 AppNation launches subscription bundle — early sign-up numbers strong",
    ],
    negative: [
      "📲 Antitrust regulators investigating AppNation's 30% app fee — legal costs mounting",
      "📲 Major developer pulls flagship app from AppNation — users furious",
      "📲 AppNation faces developer backlash over new policy changes",
    ],
  },
  cybershield: {
    positive: [
      "🔒 Massive data breach hits rivals — panicked companies flood CyberShield with orders",
      "🔒 CyberShield wins 5-year government contract to protect critical infrastructure",
      "🔒 CyberShield's new AI threat detector stops largest cyberattack in history",
    ],
    neutral: [
      "🔒 CyberShield achieves highest security certification — opens new government market",
      "🔒 CyberShield releases annual threat report — downloads driving brand credibility",
    ],
    negative: [
      "🔒 High-profile client suffers breach despite CyberShield protection — PR damage",
      "🔒 Competitor wins marquee contract CyberShield had been counting on",
    ],
  },
  chipforge: {
    positive: [
      "⚡ AI server boom sends ChipForge orders soaring — factories running 24/7",
      "⚡ ChipForge's next-gen chip outperforms all rivals — tech giants in bidding war",
      "⚡ ChipForge wins exclusive 3-year supply deal with world's largest smartphone maker",
    ],
    neutral: [
      "⚡ ChipForge breaks ground on $8B advanced chip factory — capacity doubling",
      "⚡ ChipForge announces new chip architecture — developers excited about performance leap",
    ],
    negative: [
      "⚡ Tech slowdown triggers wave of ChipForge order cancellations — outlook slashed",
      "⚡ Rival launches chip at same speed for 30% less — ChipForge market share at risk",
      "⚡ ChipForge warns of oversupply — prices falling faster than expected",
    ],
  },
  // Entertainment
  streamflix: {
    positive: [
      "🎬 StreamFlix's new series breaks all viewing records — subscriber surge incoming",
      "🎬 StreamFlix beats earnings estimates — ad-supported tier growing faster than expected",
      "🎬 StreamFlix lands exclusive deal with Hollywood's hottest director",
    ],
    neutral: [
      "🎬 StreamFlix rolls out new features — early user response positive",
      "🎬 StreamFlix expands into live sports streaming — analysts bullish",
    ],
    negative: [
      "🎬 StreamFlix subscriber growth slows — password-sharing crackdown causes churn",
      "🎬 Content budget cuts at StreamFlix raise concerns about future slate quality",
    ],
  },
  thunderfc: {
    positive: [
      "⚽ Thunder FC wins major trophy — global jersey sales go through the roof",
      "⚽ Thunder FC's star player signs long-term extension — fans and investors relieved",
      "⚽ Thunder FC sells out 20 consecutive home matches — record merchandising revenue",
    ],
    neutral: [
      "⚽ Thunder FC announces new stadium expansion — capacity up 30%",
      "⚽ Thunder FC signs lucrative global TV broadcast deal",
    ],
    negative: [
      "⚽ Thunder FC star player injured — playoff hopes and revenue at risk",
      "⚽ Thunder FC in early-round cup exit — merchandising hit expected",
    ],
  },
  gameboxstudios: {
    positive: [
      "🕹️ GameBox Studios' new title breaks launch records — 10M copies in 48 hours",
      "🕹️ GameBox Studios announces sequel to biggest franchise — stock analyst upgrades",
      "🕹️ GameBox Studios wins multiple Game of the Year awards — massive PR boost",
    ],
    neutral: [
      "🕹️ GameBox Studios teases new IP — early trailers generating buzz",
      "🕹️ GameBox Studios acquires indie studio with cult following",
    ],
    negative: [
      "🕹️ GameBox Studios' latest title delayed 6 months — revenue miss expected",
      "🕹️ Review scores disappoint for GameBox Studios' newest release",
      "🕹️ GameBox Studios faces backlash over in-game purchases policy",
    ],
  },
  celebbuzz: {
    positive: [
      "🌟 CelebBuzz signs three A-list celebrities in one week — agency on a roll",
      "🌟 CelebBuzz client tops music charts globally — management fee windfall",
      "🌟 CelebBuzz named top talent agency — bidding war for their roster begins",
    ],
    neutral: [
      "🌟 CelebBuzz expanding into sports representation — new revenue stream",
    ],
    negative: [
      "🌟 CelebBuzz client in controversy — reputational risk for agency",
      "🌟 Major CelebBuzz star leaves for rival agency — revenue hit expected",
      "🌟 CelebBuzz celebrity goes quiet on social media — brand deals on hold",
    ],
  },
  soundwave: {
    positive: [
      "🎵 SoundWave's headlining artist breaks streaming records — royalty windfall",
      "🎵 SoundWave announces global concert tour — live revenue to spike",
      "🎵 SoundWave subscriber growth accelerates — new markets driving signups",
    ],
    neutral: [
      "🎵 SoundWave launches hi-fi audio tier — premium subscribers growing",
      "🎵 SoundWave partners with major festival circuit — live events expanding",
    ],
    negative: [
      "🎵 SoundWave loses licensing deal with major label — content gap ahead",
      "🎵 SoundWave facing royalty rate increase — margins under pressure",
    ],
  },
  nightowl: {
    positive: [
      "🍿 NightOwl Cinemas lands exclusive summer blockbuster premiere rights",
      "🍿 NightOwl's premium recliner upgrade drives ticket price increases",
    ],
    neutral: [
      "🍿 NightOwl Cinemas converting screens to premium format — capex heavy",
    ],
    negative: [
      "🍿 NightOwl Cinemas attendance down 15% as streaming releases day-and-date",
      "🍿 Major studio announces streaming-only release — bypasses NightOwl entirely",
      "🍿 NightOwl closes 12 underperforming locations — restructuring underway",
    ],
  },
}

// ─── Flash Sale Headlines ─────────────────────────────────────────────────────

function getFlashSaleHeadline(companyId) {
  const co = COMPANIES.find(c => c.id === companyId)
  if (!co) return null
  return `⚡ FLASH DEAL: ${co.emoji} ${co.name} available at 20% OFF — for 2 turns only!`
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Generate News ────────────────────────────────────────────────────────────

export function generateNews(economy, sectorCycles, ownedCompanies, turn, flashSale, level = 1) {
  const headlines = []

  // 1. Economy headline
  const econState = economy.preSignal || economy.state
  const econHeadlines = ECONOMY_HEADLINES[econState] || ECONOMY_HEADLINES[economy.state]
  headlines.push({ tier: 'economy', text: pickRandom(econHeadlines) })

  // 2. Sector headlines — always show sectors that have owned companies,
  //    plus consumer & realEstate as the always-available sectors
  const sectorsToShow = new Set(['consumer', 'realEstate'])
  ownedCompanies.forEach(id => {
    const co = COMPANIES.find(c => c.id === id)
    if (co) sectorsToShow.add(co.sector)
  })

  sectorsToShow.forEach(sectorId => {
    const cycle = sectorCycles[sectorId]
    if (!cycle) return
    const sectorPool = SECTOR_HEADLINES[sectorId]
    if (!sectorPool) return

    // Use preSignal state if available for this sector
    let stateKey = cycle.state
    if (cycle.preSignal === 'preSlowdown') stateKey = 'preDownturn'
    else if (cycle.preSignal === 'preBoom') stateKey = 'preBoom'

    const pool = sectorPool[stateKey] || sectorPool[cycle.state] || sectorPool.normal
    if (pool && pool.length > 0) {
      headlines.push({ tier: 'sector', sectorId, text: pickRandom(pool) })
    }
  })

  // 3. Flash sale announcement (highest priority gossip)
  if (flashSale && flashSale.turnsLeft === 2) {
    const headline = getFlashSaleHeadline(flashSale.companyId)
    if (headline) {
      headlines.push({ tier: 'flash', companyId: flashSale.companyId, text: headline })
    }
  } else if (flashSale && flashSale.turnsLeft === 1) {
    const co = COMPANIES.find(c => c.id === flashSale.companyId)
    if (co) {
      headlines.push({
        tier: 'flash',
        companyId: flashSale.companyId,
        text: `⚡ LAST CHANCE: ${co.emoji} ${co.name} 20% flash deal expires next turn!`,
      })
    }
  }

  // 4. Company news — owned companies always included, fill with 1-2 random unowned
  //    Total: 2-3 items per turn. Positive/negative sentiments carry a ±6% multiplier effect.
  //    Only include companies from sectors the player has unlocked.
  const unlockedSectorIds = new Set(
    Object.values(SECTORS)
      .filter(s => level >= s.unlockLevel)
      .map(s => s.id)
  )
  const allIds = COMPANIES.filter(c => unlockedSectorIds.has(c.sector)).map(c => c.id)
  const unownedIds = allIds.filter(id => !ownedCompanies.includes(id))

  // Build ordered pick list: owned first, then shuffled unowned
  const shuffledUnowned = [...unownedIds].sort(() => Math.random() - 0.5)
  const ownedToShow = ownedCompanies.slice(0, 2)
  const targetTotal = ownedToShow.length === 0 ? 2 : ownedToShow.length < 2 ? 2 : 3
  const extraUnowned = shuffledUnowned.slice(0, Math.max(1, targetTotal - ownedToShow.length))
  const newsPool = [...ownedToShow, ...extraUnowned].slice(0, targetTotal)

  for (const id of newsPool) {
    const companyData = COMPANY_GOSSIP[id]
    if (!companyData) continue
    // Sentiment weighted toward neutral/positive in boom, negative in slowdown
    let sentimentRoll = Math.random()
    let sentiment
    if (economy.state === 'booming') {
      sentiment = sentimentRoll < 0.5 ? 'positive' : sentimentRoll < 0.8 ? 'neutral' : 'negative'
    } else if (economy.state === 'slowdown') {
      sentiment = sentimentRoll < 0.5 ? 'negative' : sentimentRoll < 0.75 ? 'neutral' : 'positive'
    } else {
      sentiment = sentimentRoll < 0.35 ? 'positive' : sentimentRoll < 0.65 ? 'neutral' : 'negative'
    }
    const pool = companyData[sentiment] || companyData.neutral || companyData.positive
    if (pool && pool.length > 0) {
      headlines.push({ tier: 'companyNews', companyId: id, sentiment, text: pickRandom(pool) })
    }
  }

  // 5. Chip's take — economy-aware, mentions downturns if relevant
  let chipTake = ECONOMY_CHIP_TAKES[economy.state] || ECONOMY_CHIP_TAKES.steady
  if (economy.preSignal) {
    chipTake = ECONOMY_CHIP_TAKES[economy.preSignal] || chipTake
  }

  return { headlines, chipTake }
}
