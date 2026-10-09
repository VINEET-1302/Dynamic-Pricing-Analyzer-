import { createContext, useContext, useEffect, useState } from 'react'
import { parseCSV } from './csv'

// To use a different dataset, replace this CSV (same column names) or point this at the Flask endpoint.
const CSV_URL = '/data/automotive_dynamic_pricing_dataset.csv'
const Ctx = createContext({ loading: true })
export const useData = () => useContext(Ctx)

const sum = (a, k) => a.reduce((s, r) => s + r[k], 0)
const mean = (a, k) => sum(a, k) / a.length
const groupBy = (rows, fn) => rows.reduce((m, r) => { (m[fn(r)] ||= []).push(r); return m }, {})

function build(rows) {
  // One entry per item: latest snapshot + full history + averages
  const items = Object.values(groupBy(rows, (r) => r.item_id)).map((list) => {
    list.sort((a, b) => (a.date < b.date ? -1 : 1))
    const last = list[list.length - 1]
    return { ...last, history: list, avgDemand: mean(list, 'demand_score'), totalUnits: sum(list, 'units_sold'), totalRevenue: sum(list, 'sales_revenue'),
      avgGap: ((mean(list, 'current_price') - mean(list, 'competitor_price')) / mean(list, 'competitor_price')) * 100 }
  }).sort((a, b) => a.item_name.localeCompare(b.item_name))

  const monthly = Object.entries(groupBy(rows, (r) => r.date.slice(0, 7))).sort().map(([month, r]) => ({
    month, revenue: +(sum(r, 'sales_revenue') / 1e7).toFixed(1), units: sum(r, 'units_sold'), demand: +mean(r, 'demand_score').toFixed(1),
    gap: +(mean(r.map((x) => ({ g: ((x.current_price - x.competitor_price) / x.competitor_price) * 100 })), 'g')).toFixed(2),
  }))
  const stat = (key, fn) => Object.entries(groupBy(rows, (r) => r[key])).map(([name, r]) => ({ name, ...fn(r) }))
  const categoryStats = stat('category', (r) => ({ revenue: +(sum(r, 'sales_revenue') / 1e7).toFixed(1), units: sum(r, 'units_sold') })).sort((a, b) => b.revenue - a.revenue)
  const seasonStats = stat('season', (r) => ({ demand: +mean(r, 'demand_score').toFixed(1), discount: +mean(r, 'discount_percent').toFixed(1) }))
  const channelStats = stat('sales_channel', (r) => ({ gap: +mean(r.map((x) => ({ g: ((x.current_price - x.competitor_price) / x.competitor_price) * 100 })), 'g').toFixed(2) }))
  return { rows, items, monthly, categoryStats, seasonStats, channelStats, categories: [...new Set(items.map((i) => i.category))].sort() }
}

export function DataProvider({ children }) {
  const [state, setState] = useState({ loading: true })
  useEffect(() => {
    fetch(CSV_URL).then((r) => { if (!r.ok) throw new Error('CSV file not found'); return r.text() })
      .then((t) => setState({ loading: false, ...build(parseCSV(t)) }))
      .catch((e) => setState({ loading: false, error: e.message }))
  }, [])
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>
}
