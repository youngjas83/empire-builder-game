// Chip Q&A Bank — 16 questions across 4 categories

export const QA_CATEGORIES = [
  {
    id: 'basics',
    label: '📚 Basics',
    questions: [
      {
        id: 'q_what_is_multiplier',
        q: 'What is a Value Multiplier?',
        mood: 'thinking',
        a: "Great question! The Value Multiplier (or 'Mult') tells you how much investors think a company is worth compared to what it earns. If a company earns $200K/turn and has a 20× multiplier, it's worth $4M total. Higher multiplier = investors love this company! Lower multiplier = investors are worried. The formula is always: Profit × Multiplier = Value.",
      },
      {
        id: 'q_what_is_net_worth',
        q: 'What is Net Worth?',
        mood: 'happy',
        a: "Net Worth is your total score — it's everything you own. Cash in your pocket PLUS the value of every company you own. If you have $2M cash and companies worth $8M, your Net Worth is $10M. Your goal is to grow Net Worth from $10M all the way to $1 BILLION!",
      },
      {
        id: 'q_how_do_i_win',
        q: 'How do I win?',
        mood: 'excited',
        a: "Grow your Net Worth to $1,000,000,000 — one billion dollars! You start with $10M and grow it by buying companies, collecting their profits every turn, and selling them for more than you paid. The fastest way is to own great companies, open new locations, and ride economic booms. You've got this!",
      },
      {
        id: 'q_what_is_profit_per_turn',
        q: 'What is Profit per Turn?',
        mood: 'happy',
        a: "Profit per Turn is how much cash a company earns for you each turn. When you tap End Turn, every company you own deposits its profit straight into your cash pile. Own more companies → earn more profit → reach $1B faster. It's that simple!",
      },
      {
        id: 'q_what_is_diversification',
        q: 'What is Diversification?',
        mood: 'thinking',
        a: "Diversification means spreading your money across different companies and sectors instead of putting it all in one place. Why? Because when one sector struggles, others might be booming! A diverse empire is a resilient empire. I'll analyze your portfolio anytime — just check the My Empire tab.",
      },
    ],
  },
  {
    id: 'economy',
    label: '📊 Economy & Sectors',
    questions: [
      {
        id: 'q_what_is_booming',
        q: 'What does Economy: Booming mean?',
        mood: 'excited',
        a: "Economy Booming means everything is going great! Companies earn higher profits and their Value Multipliers go up. Growth companies especially surge in a boom. It's the best time to own risky, fast-growing companies. Just watch for the warning signs — booms always end eventually!",
      },
      {
        id: 'q_what_happens_in_slowdown',
        q: 'What happens in a Slowdown?',
        mood: 'worried',
        a: "A Slowdown means the economy is cooling. Company profits drop and multipliers shrink — that means your companies are worth LESS. But here's the key: defensive companies like BurgerBlast and FreshMart barely feel it. Counter-cyclical companies like FreshMart actually get STRONGER! Stick with the safe ones during tough times.",
      },
      {
        id: 'q_what_is_sector_trend',
        q: 'What is a Sector Trend?',
        mood: 'thinking',
        a: "Each sector (Consumer, Real Estate, etc.) has its OWN mini economy! A sector can be booming even when the overall economy is in slowdown. That's why diversification across sectors is so powerful — if one sector tanks, another might be on fire. Watch the sector traffic lights on the Market tab!",
      },
      {
        id: 'q_why_did_company_lose_value',
        q: 'Why did my company lose value?',
        mood: 'thinking',
        a: "A few possibilities: 1) The economy moved into a Slowdown — all companies feel this. 2) Your company's sector had a downturn. 3) The company has a structural decline (like MegaMall — e-commerce is permanently hurting it). 4) The company's Value Multiplier compressed. Check the Market tab for economy and sector status to diagnose what happened!",
      },
    ],
  },
  {
    id: 'cards',
    label: '🃏 Company Cards',
    questions: [
      {
        id: 'q_what_is_cash_cow',
        q: 'What does Cash Cow mean?',
        mood: 'happy',
        a: "A Cash Cow is a company that reliably generates steady profit every single turn, like a cow producing milk every morning. It might not grow super fast, but you can count on it. Examples: BurgerBlast, SkyFlats, StoreSafe. Every great empire needs a few of these as a stable foundation!",
      },
      {
        id: 'q_what_is_in_decline',
        q: "What does 'In Decline' mean?",
        mood: 'worried',
        a: "In Decline means the company's profit SHRINKS every single turn — even when everything else is fine! This is called structural decline. For MegaMall, it's e-commerce killing physical retail. For TowerOne, it's remote work emptying office buildings. These companies look cheap for a reason. Cheap is NOT always a bargain!",
      },
      {
        id: 'q_what_is_counter_cyclical',
        q: 'What is Counter-Cyclical?',
        mood: 'excited',
        a: "Counter-Cyclical companies actually GROW during slowdowns! When the economy is bad, people trade down to cheaper options — like shopping at FreshMart instead of fancy grocery stores. FreshMart's the perfect example: it's your recession secret weapon. While your other companies are hurting, FreshMart is winning!",
      },
      {
        id: 'q_what_is_fad_alert',
        q: 'What is a Fad Alert?',
        mood: 'thinking',
        a: "Fad Alert companies are riding a trend wave — and trend waves eventually crash. NovaDrip and ToyCraze are classic examples. They can deliver MASSIVE returns when the fad is hot. But one bad season and they can collapse. The skill is timing: buy when the fad is growing, sell BEFORE it peaks. Never hold a fad company forever!",
      },
    ],
  },
  {
    id: 'strategy',
    label: '🎯 Strategy',
    questions: [
      {
        id: 'q_when_open_location',
        q: 'When should I open a new location?',
        mood: 'thinking',
        a: "Opening a new location costs about 30% of the company's current value — much cheaper than buying a whole new company — and adds 30% more profit. Do the math: if a company earns $200K/turn and costs $1.2M to open a new location, you'll earn that back in 6 turns. Great deal! Best to expand your most profitable, steadily-growing companies first.",
      },
      {
        id: 'q_what_to_do_in_slowdown',
        q: 'What should I do in a Slowdown?',
        mood: 'worried',
        a: "Slowdown survival guide: 1) Hold your defensive companies (BurgerBlast, FreshMart, SkyFlats) — they barely feel it. 2) Consider selling risky companies before they lose more value. 3) Your cash earns interest — holding some cash is fine. 4) Watch for the turnaround signals in the news. Slowdowns always end — position yourself to explode upward when they do!",
      },
      {
        id: 'q_hold_cash_or_invest',
        q: 'Should I hold cash or invest?',
        mood: 'thinking',
        a: "Both! Cash earns interest every turn — free money just for holding it. But companies earn much more than cash interest. The real answer: keep some cash as a safety cushion (so you can buy opportunities), and invest the rest in great companies. The exact split depends on the economy — more cash in slowdowns, more invested in booms.",
      },
      {
        id: 'q_how_to_grow_fastest',
        q: 'How do I grow fastest?',
        mood: 'excited',
        a: "The fastest path to $1B: 1) Buy companies as soon as you can afford them. 2) Expand your best companies with new locations — cheap returns! 3) Own a mix of cash cows (steady income) and growth companies (rising value). 4) During booms, own growth companies. During slowdowns, own defensive ones. 5) NEVER sell a great company just because the price dipped temporarily!",
      },
    ],
  },
]

export function searchQA(query) {
  if (!query || query.trim() === '') return QA_CATEGORIES

  const lower = query.toLowerCase()
  return QA_CATEGORIES.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(lower) || q.a.toLowerCase().includes(lower)
    ),
  })).filter(cat => cat.questions.length > 0)
}
