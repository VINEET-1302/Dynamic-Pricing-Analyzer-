import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calculator } from 'lucide-react'
import { useData } from '../data/DataContext'
import Badge from '../components/Badge'
import { inr, pct, actionFor } from '../services/pricing'

export default function Catalog() {
  const { items, categories } = useData()
  const nav = useNavigate()
  const [f, setF] = useState({ q: '', category: '', demand: '', stock: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const list = items.filter((i) => i.item_name.toLowerCase().includes(f.q.toLowerCase()) && (!f.category || i.category === f.category) && (!f.demand || i.demand_level === f.demand) && (!f.stock || i.inventory_status === f.stock))
  return (
    <>
      <div className="head"><h1>Catalog</h1><p>Latest snapshot for each of the {items.length} items. Click “Optimize” to test a price.</p></div>
      <div className="filters">
        <label className="search"><Search size={16} /><input placeholder="Search items" value={f.q} onChange={set('q')} /></label>
        <select value={f.category} onChange={set('category')}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={f.demand} onChange={set('demand')}><option value="">All demand</option>{['Very High', 'High', 'Medium', 'Low', 'Very Low'].map((d) => <option key={d}>{d}</option>)}</select>
        <select value={f.stock} onChange={set('stock')}><option value="">All stock</option>{['High', 'Medium', 'Low', 'Critical'].map((d) => <option key={d}>{d}</option>)}</select>
      </div>
      {!list.length ? <div className="panel empty">No items match your filters.</div> : (
        <div className="panel tablewrap"><table><thead><tr><th>Item</th><th>Category</th><th>Current Price</th><th>Competitor Price</th><th>Stock</th><th>Demand</th><th>Recommended Price</th><th>Action</th><th /></tr></thead>
          <tbody>{list.map((i) => { const m = pct(i.recommended_price, i.current_price); return (
            <tr key={i.item_id}><td className="strong">{i.item_name}<small>{i.item_id} · {i.condition}</small></td><td>{i.category}</td><td>{inr(i.current_price)}</td><td>{inr(i.competitor_price)}</td>
              <td>{i.inventory_units} <Badge label={i.inventory_status} /></td><td><Badge label={i.demand_level} /></td><td className="hl">{inr(i.recommended_price)}</td><td><Badge label={actionFor(m)} /></td>
              <td><button className="btn small" onClick={() => nav(`/simulator?item=${i.item_id}`)}><Calculator size={14} />Optimize</button></td></tr>) })}</tbody></table></div>)}
    </>
  )
}
