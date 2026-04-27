// Chip Q&A Bank — kid-friendly explanations

export const QA_CATEGORIES = [
  {
    id: 'basics',
    label: '📚 Basics',
    questions: [
      {
        id: 'q_what_is_multiplier',
        q: 'What is a Value Multiplier?',
        mood: 'thinking',
        a: "Think of it like this: if a company earns $200K/turn and has a 20× multiplier, it's worth $4M. The multiplier shows how excited investors are about the company. High multiplier = everyone loves it! Low multiplier = people are worried. The formula is always: Profit × Multiplier = Value. Watch the multiplier go up in a boom — your company gets more valuable even without earning more!",
      },
      {
        id: 'q_what_is_net_worth',
        q: 'What is Net Worth?',
        mood: 'happy',
        a: "Net Worth is your total score! It's everything you own added together — your cash PLUS the value of every company you own. If you have $2M cash and companies worth $8M, your Net Worth is $10M. Your goal is to grow from $10M all the way to $1 BILLION! Check your progress on the Empire tab.",
      },
      {
        id: 'q_how_do_i_win',
        q: 'How do I win?',
        mood: 'excited',
        a: "Grow your Net Worth to $1,000,000,000 — one BILLION dollars! You start with $10M and grow it by buying companies, collecting their profits every turn, and selling them for more than you paid. The fastest way? Own great companies, open new locations (amazing value!), and ride economic booms. You've totally got this!",
      },
      {
        id: 'q_what_is_profit_per_turn',
        q: 'What is Profit per Turn?',
        mood: 'happy',
        a: "Profit per Turn is how much cash a company earns for you each turn. When you tap End Turn, every company you own deposits its profit straight into your cash pile — like collecting rent! Own more companies → earn more profit → reach $1B faster. Simple as that!",
      },
      {
        id: 'q_what_is_diversification',
        q: 'What is Diversification?',
        mood: 'thinking',
        a: "Diversification means spreading your money across different companies and sectors instead of putting it all in one place. Why? Because when one sector is struggling, another might be booming! Think of it like not putting all your eggs in one basket. A diverse empire is a tough empire — one bad sector won't wipe you out.",
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
        a: "Economy Booming means everything is on fire — in a good way! 🔥 Companies earn higher profits and their Value Multipliers go up. Growth companies especially SURGE in a boom. It's the best time to own risky, fast-growing companies. Just watch for the warning signs — booms always end eventually!",
      },
      {
        id: 'q_what_happens_in_slowdown',
        q: 'What happens in a Slowdown?',
        mood: 'worried',
        a: "A Slowdown means the economy is struggling. Company profits drop and multipliers shrink — that means your companies are worth LESS. But here's the key: Super Safe companies like BurgerBlast and FreshMart barely feel it. Recession-Proof companies like FreshMart actually get STRONGER! Stick with the safe ones in tough times.",
      },
      {
        id: 'q_what_is_sector_trend',
        q: 'What is a Sector Trend?',
        mood: 'thinking',
        a: "Each sector (Consumer Market, Property Empire, etc.) has its OWN mini economy! A sector can be booming even when the overall economy is in slowdown. That's why owning companies in different sectors is so powerful — if one sector tanks, another might be exploding. Watch the sector status on the Stats tab!",
      },
      {
        id: 'q_why_did_company_lose_value',
        q: 'Why did my company lose value?',
        mood: 'thinking',
        a: "A few possibilities: 1) The economy moved into a Slowdown — all companies feel this. 2) Your company's sector had a downturn — sector downturns drain value every turn. 3) The company has a 📉 Fading Out badge — it loses value permanently. 4) The Value Multiplier dropped. The company card will now show you exactly why! Check it for the full story.",
      },
    ],
  },
  {
    id: 'cards',
    label: '🃏 Company Cards',
    questions: [
      {
        id: 'q_what_is_cash_cow',
        q: 'What does 💰 Cash Machine mean?',
        mood: 'happy',
        a: "A Cash Machine is a company that reliably generates steady profit every single turn, like a machine printing money. It might not grow super fast, but you can always count on it. Examples: BurgerBlast, SkyFlats, StoreSafe. Every great empire needs at least one of these as a stable money-making foundation!",
      },
      {
        id: 'q_what_is_in_decline',
        q: "What does '📉 Fading Out' mean?",
        mood: 'worried',
        a: "Fading Out means the company's profit SHRINKS every single turn — even when everything else is great! This is called structural decline. For MegaMall, it's online shopping killing physical retail. For TowerOne, it's remote work emptying office buildings. These companies look cheap for a reason. Cheap is NOT always a bargain!",
      },
      {
        id: 'q_what_is_counter_cyclical',
        q: 'What is 🛡️ Recession-Proof?',
        mood: 'excited',
        a: "Recession-Proof companies actually GROW during bad times! When the economy struggles, people trade down to cheaper options — like shopping at FreshMart instead of fancy grocery stores. FreshMart actually gets MORE customers when things are tough. It's your secret weapon against bad economies!",
      },
      {
        id: 'q_what_is_fad_alert',
        q: 'What is ⏰ Fad Alert?',
        mood: 'thinking',
        a: "Fad Alert companies are riding a trend wave — and trend waves always crash eventually. NovaDrip and ToyCraze are classic examples. They can deliver MASSIVE returns when the fad is hot. But one bad season and they can collapse hard. The skill is timing: buy when the fad is growing, sell BEFORE it peaks. Never hold a fad company forever!",
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
        a: "Opening a location is one of the best deals in the game! Here's why: it costs just 15% of the company's value, but adds +30% more profit AND +30% to the company's sell price. That means you're essentially buying growth at HALF price compared to buying a whole new company. Best to expand your most profitable, steadily-growing companies first — the payback is insanely fast!",
      },
      {
        id: 'q_location_arbitrage',
        q: 'Why are locations such a good deal?',
        mood: 'excited',
        a: "Great catch! Here's the secret: a whole company is priced at its FULL value multiplier (like 20× profit). But a new branch only costs 15% of company value — way less per unit of growth. You pay 15% and get +30% profit plus +30% company value. That's like buying $2 for every $1 you spend! Locations are the #1 way smart investors grow fast in this game.",
      },
      {
        id: 'q_what_to_do_in_slowdown',
        q: 'What should I do in a Slowdown?',
        mood: 'worried',
        a: "Slowdown survival guide: 1) Keep your Super Safe companies (BurgerBlast, FreshMart, SkyFlats) — they barely feel it. 2) Think about selling your Very Risky companies before they drop more. 3) Cash earns interest — holding some cash is actually smart right now. 4) Watch the news for recovery signals. Slowdowns always end — get ready to pounce when they do!",
      },
      {
        id: 'q_hold_cash_or_invest',
        q: 'Should I hold cash or invest?',
        mood: 'thinking',
        a: "Both! Cash earns interest every turn — free money just for holding it. But companies earn MUCH more than interest. The smart play: keep some cash as a cushion so you can grab great deals when they appear (especially Flash Sales!), and invest the rest in great companies. More cash during slowdowns, more invested during booms.",
      },
      {
        id: 'q_how_to_grow_fastest',
        q: 'How do I grow fastest?',
        mood: 'excited',
        a: "The fastest path to $1B: 1) Buy companies as soon as you can afford them. 2) Open new locations on your best companies — insane value at 15% cost! 3) Own a mix of Cash Machines (steady income) and Fast Growers (rising value). 4) During booms, own growth companies. During slowdowns, own safe ones. 5) NEVER sell a great company just because the price dipped a little. 6) Grab every Flash Sale you see!",
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
