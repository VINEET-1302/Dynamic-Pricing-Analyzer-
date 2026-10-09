import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'
import { useData } from '../data/DataContext'
import Badge from '../components/Badge'
import { Panel, ChartPanel, tip, grid, tick } from '../components/Panel'
import { predictPrice } from '../services/api'
import { inr } from '../services/pricing'

// Build the form from an item's latest snapshot; min/max default to ±15% of the current price
const toForm = (i) => ({ id: i.item_id, currentPrice: i.current_price, competitorPrice: i.competitor_price, inventory: i.inventory_units, demandScore: i.demand_score, discount: i.discount_percent, minPrice: Math.round(i.current_price * 0.85), maxPrice: Math.round(i.current_price * 1.15) })
const fields = [['currentPrice', 'Current Price (₹)'], ['competitorPrice', 'Competitor Price (₹)'], ['inventory', 'Inventory Units'], ['demandScore', 'Demand Score (0-100)'], ['discount', 'Discount (%)'], ['minPrice', 'Minimum Price (₹)'], ['maxPrice', 'Maximum Price (₹)']]

export default function Simulator() {
  const { items } = useData()
  const [params] = useSearchParams()
  const start = items.find((i) => i.item_id === params.get('item')) || items[0]
  const [form, setForm] = useState(toForm(start))
  const [out, setOut] = useState(null)
  const [busy, setBusy] = useState(false)
  const item = items.find((i) => i.item_id === form.id)
  const change = (k) => (e) => setForm({ ...form, [k]: Number(e.target.value) })
  const run = async (e) => { e.preventDefault(); setBusy(true); setOut({ ...(await predictPrice(form)), snap: form }); setBusy(false) }
  const s = out?.snap
  const bars = out && [['Current', s.currentPrice, '#64748b'], ['Competitor', s.competitorPrice, '#38bdf8'], ['Engine Recommended', out.recommendedPrice, '#f97316'], ['Dataset Recommended', item.recommended_price, '#22c55e']].map(([name, value, color]) => ({ name, value, color }))
  return (
    <>
      <div className="head"><h1>Price Simulator</h1><p>Pick an item, adjust market conditions and get a recommended price.</p></div>
      <div className="cols-sim">
        <Panel title="Inputs" sub={item && `${item.category} · ${item.subcategory}`}>
          <form className="form" onSubmit={run}>
            <label>Item<select value={form.id} onChange={(e) => { setForm(toForm(items.find((i) => i.item_id === e.target.value))); setOut(null) }}>{items.map((i) => <option key={i.item_id} value={i.item_id}>{i.item_name}</option>)}</select></label>
            {fields.map(([k, l]) => <label key={k}>{l}<input type="number" min="0" step="any" required value={form[k]} onChange={change(k)} /></label>)}
            <button className="btn" disabled={busy}><Zap size={16} />{busy ? 'Analysing…' : 'Calculate Recommended Price'}</button>
          </form>
        </Panel>
        <div>
          {!out ? <div className="panel empty">Your recommendation will appear here.</div> : (
            <>
              <div className="result"><span className="eyebrow">Recommended Price</span><div className="big">{inr(out.recommendedPrice)}</div>
                <div className="row"><span className={out.changePct >= 0 ? 'green' : 'red'}>{out.changePct >= 0 ? '+' : ''}{out.changePct.toFixed(2)}% vs current</span><Badge label={out.action} /></div>
                <div className="facts"><div><span>Current</span><b>{inr(s.currentPrice)}</b></div><div><span>Competitor</span><b>{inr(s.competitorPrice)}</b></div><div><span>Demand</span><b>{s.demandScore}</b></div><div><span>Inventory</span><b>{s.inventory}</b></div></div>
                <ul>{out.reasons.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <ChartPanel title="Price Comparison"><BarChart data={bars}>{grid}<XAxis dataKey="name" tick={tick} /><YAxis tick={tick} domain={['auto', 'auto']} />{tip}<Bar dataKey="value" radius={[6, 6, 0, 0]}>{bars.map((b) => <Cell key={b.name} fill={b.color} />)}</Bar></BarChart></ChartPanel>
            </>)}
        </div>
      </div>
    </>
  )
}
