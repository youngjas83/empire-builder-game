# Company Audit

Read `src/data/companies.js` and audit the company data. Arguments (if any): $ARGUMENTS

## Step 1 — Always run: display the current data table

Read `src/data/companies.js` in full, then print this table for every company:

| Company | Sector | Badge | Profit | Multiple | Value | Floor | Ceiling | profSens | Drift |
|---------|--------|-------|--------|----------|-------|-------|---------|---------|-------|

- **Value** = `baseProfit × baseMultiplier` (compute it, show as formatted money)
- Sort rows by Sector then by Value ascending
- Flag any row where `multFloor >= baseMultiplier` or `baseMultiplier >= multCeiling` with ⚠️

After the table, print a sector summary:

| Sector | Companies | Value range | Badges present |
|--------|-----------|-------------|----------------|

## Step 2 — If arguments were provided, make the requested changes

Arguments may look like:
- `StoreSafe mult=24` — change baseMultiplier, recalculate baseProfit to keep value the same
- `SunVilla badge=highRisk sens=highRiskCyclical` — change badge and sensitivity profile
- `BurgerBlast profit=167000 mult=18 floor=12 ceiling=26` — explicit values

### Rules for recalculating when only `mult` is given:
- Keep `baseValue = original baseProfit × original baseMultiplier` unchanged
- New `baseProfit = round(baseValue / newMultiplier)`
- Scale `multFloor` and `multCeiling` proportionally: `newFloor = round(oldFloor × newMult / oldMult)`, same for ceiling
- Verify `newFloor < newMult < newCeiling` — if not, flag it and suggest a fix

### Sensitivity profiles available (from companies.js SENS object):
- `lowRiskDefensive`: profSens 0.20, multSens 0.10
- `defensiveGrowth`: profSens 0.40, multSens 0.50
- `steadyRealEstate`: profSens 0.30, multSens 0.20
- `moderateRisk`: profSens 1.00, multSens 0.80
- `highRiskCyclical`: profSens 1.40, multSens 1.60
- `secularDecline`: profSens 1.00, multSens 0.70
- `counterCyclical`: profSens -0.20, multSens 0.10

### Before editing:
Show a "Changes to make" table:

| Company | Field | Old | New |
|---------|-------|-----|-----|

Then ask: "Make these changes? (yes / adjust)"

Wait for confirmation before editing `companies.js`.

## Step 3 — After any edits, reprint the full table to confirm correctness.
