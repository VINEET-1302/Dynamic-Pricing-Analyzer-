import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Legend } from 'recharts'
import { useData } from '../data/DataContext'
import Badge from '../components/Badge'
import { ChartPanel, Panel, tip, grid, tick } from '../components/Panel'
import { inr } from '../services/pricing'

export default function Trends() {
  const { items, monthly } = useData()
  const [id, setId] = useState(items[0].item_id)
  const item = items.find((i) => i.item_id === id)
  const h = item.history.map((r) => ({ date: r.date, Current: r.current_price, Competitor: r.competitor_price, Recommended: r.recommended_price, demand: r.demand_score, units: r.units_sold }))
  return (
    <>
      <div className="head row"><div><h1>Trends</h1><p>Price and sales history from the dataset.</p></div>
        <select value={id} onChange={(e) => setId(e.target.value)}>{items.map((i) => <option key={i.item_id} value={i.item_id}>{i.item_name}</option>)}</select></div>
      <ChartPanel title={`Price History — ${item.item_name}`} height={300}><LineChart data={h}>{grid}<XAxis dataKey="date" tick={tick} minTickGap={40} /><YAxis tick={tick} domain={['auto', 'auto']} />{tip}<Legend />
        <Line dataKey="Current" stroke="#94a3b8" strokeWidth={2} dot={false} /><Line dataKey="Competitor" stroke="#38bdf8" strokeWidth={2} dot={false} /><Line dataKey="Recommended" stroke="#f97316" strokeWidth={2} dot={false} /></LineChart></ChartPanel>
      <div className="cols2">
        <ChartPanel title="Units Sold (this item)"><LineChart data={h}>{grid}<XAxis dataKey="date" tick={tick} minTickGap={40} /><YAxis tick={tick} />{tip}<Line dataKey="units" stroke="#22c55e" strokeWidth={2} dot={false} /></LineChart></ChartPanel>
        <ChartPanel title="Units Sold (all items, monthly)"><LineChart data={monthly}>{grid}<XAxis dataKey="month" tick={tick} minTickGap={30} /><YAxis tick={tick} />{tip}<Line dataKey="units" stroke="#f97316" strokeWidth={2} dot={false} /></LineChart></ChartPanel>
      </div>
      <Panel title="Latest Records"><div className="tablewrap"><table><thead><tr><th>Date</th><th>Current</th><th>Previous</th><th>Competitor</th><th>Recommended</th><th>Units Sold</th><th>Demand</th></tr></thead>
        <tbody>{[...item.history].reverse().slice(0, 10).map((r) => <tr key={r.date + r.location}><td>{r.date}</td><td>{inr(r.current_price)}</td><td>{inr(r.previous_price)}</td><td>{inr(r.competitor_price)}</td><td className="hl">{inr(r.recommended_price)}</td><td>{r.units_sold}</td><td><Badge label={r.demand_level} /></td></tr>)}</tbody></table></div></Panel>
    </>
  )
}
