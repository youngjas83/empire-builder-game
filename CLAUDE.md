# Empire Builder — Claude Instructions

## Stack
React 18 + Vite 4. Inline styles only. No external UI libraries.
Single `useState` in `App.jsx` for the entire game state tree.

## Project layout
- `src/game/engine.js` — all game logic, `createInitialGameState`, `resolveEndTurn`, achievements
- `src/data/companies.js` — all company + sector + level data
- `src/data/news.js` — news headline banks
- `src/components/` — one file per screen/component

## Tab IDs (BottomNav)
| ID | Label | Component |
|----|-------|-----------|
| `empire` | Empire | EmpireTab.jsx |
| `news` | News | NewsTab.jsx |
| `market` | Stats | MarketTab.jsx |
| `chip` | Help | ChipTab.jsx |

## Rules

### Always plan before a multi-file build
If a request touches 3 or more files, or involves threading a new prop through multiple components, or changes a shared data structure — STOP and produce a plan first using the `/plan` format. Do not make any edits until the user confirms.

### State hygiene
Any new state key used in a component MUST be added to `createInitialGameState` in `engine.js`. Always check this before finishing a feature.

### Prop threading checklist
When adding a new prop to a component: (1) add to function signature, (2) find every place the component is rendered in App.jsx, (3) pass the prop at every render site, (4) add the handler in App.jsx if needed.

### After any multi-file edit batch
Run `npx vite build --mode development` and confirm zero errors before reporting done.

### Terminology
- "Empire Value" not "Net Worth" (renamed throughout)
- "investment gain/loss" not "investment profit" (gain = proceeds − totalInvested)
- "Stats tab" = MarketTab (tab id `market`)
- "Help tab" = ChipTab (tab id `chip`)
