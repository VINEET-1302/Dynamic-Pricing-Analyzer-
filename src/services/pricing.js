// Formatting + pricing rules. calculateRecommendedPrice can later be replaced by the Flask / ML model.
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const inrShort = (n) => n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(2)} L` : inr(n)
export const pct = (a, b) => ((a - b) / b) * 100
export const actionFor = (p) => (p > 0.5 ? 'Increase Price' : p < -0.5 ? 'Decrease Price' : 'Maintain Price')
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

export function calculateRecommendedPrice({ currentPrice, competitorPrice, inventory, demandScore, discount, minPrice, maxPrice }) {
  let adj = 0
  const reasons = []
  if (demandScore >= 90) { adj += 3; reasons.push('Demand score is very high (+3%)') }
  else if (demandScore >= 75) { adj += 1.5; reasons.push('Demand score is healthy (+1.5%)') }
  else if (demandScore < 55) { adj -= 2.5; reasons.push('Demand score is weak (−2.5%)') }
  if (inventory < 50) { adj += 2; reasons.push('Stock is low, so scarcity supports a higher price (+2%)') }
  else if (inventory > 700) { adj -= 2; reasons.push('Stock is high, so a lower price helps move units (−2%)') }
  const gap = pct(currentPrice, competitorPrice)
  if (gap > 5) { adj -= 2; reasons.push(`Priced ${gap.toFixed(1)}% above the competitor (−2%)`) }
  else if (gap < -5) { adj += 2; reasons.push(`Priced ${Math.abs(gap).toFixed(1)}% below the competitor (+2%)`) }
  if (discount > 25) { adj -= 1; reasons.push('Deep discount already running (−1%)') }
  if (!reasons.length) reasons.push('Demand, stock and competitor price are balanced')
  const recommendedPrice = clamp(Math.round(currentPrice * (1 + adj / 100)), minPrice, maxPrice)
  const changePct = pct(recommendedPrice, currentPrice)
  return { recommendedPrice, changePct, action: actionFor(changePct), reasons, gap }
}
