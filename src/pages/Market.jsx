import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'
import { useData } from '../data/DataContext'
import { ChartPanel, Panel, tip, grid, tick } from '../components/Panel'
import { inr } from '../services/pricing'

export default function Market() {
  const { items, categories, channelStats } = useData()
  const [cat, setCat] = useState('')
  const list = items.filter((i) => !cat || i.category === cat).map((i) => ({ ...i, pos: i.avgGap > 2 ? 'Above market' : i.avgGap < -2 ? 'Below market' : 'At market' })).sort((a, b) => Math.abs(b.avgGap) - Math.abs(a.avgGap))
  const top = list.slice(0, 12).map((i) => ({ name: i.item_name, gap: +i.avgGap.toFixed(1) }))
  return (
    <>
      <div className="head row"><div><h1>Market Position</h1><p>How our prices compare with competitors (average across all records).</p></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="cols2">
        <ChartPanel title="Price Gap by Item" sub="% vs competitor · positive = we are pricier" height={320}><BarChart data={top} layout="vertical" margin={{ left: 40 }}><XAxis type="number" tick={tick} /><YAxis type="category" dataKey="name" tick={tick} width={130} />{tip}<Bar dataKey="gap" radius={[0, 4, 4, 0]}>{top.map((t) => <Cell key={t.name} fill={t.gap > 0 ? '#ef4444' : '#22c55e'} />)}</Bar></BarChart></ChartPanel>
        <ChartPanel title="Price Gap by Sales Channel" sub="% vs competitor" height={320}><BarChart data={channelStats}>{grid}<XAxis dataKey="name" tick={tick} /><YAxis tick={tick} />{tip}<Bar dataKey="gap" fill="#38bdf8" radius={[4, 4, 0, 0]} /></BarChart></ChartPanel>
      </div>
      <Panel title="Competitor Comparison"><div className="tablewrap"><table><thead><tr><th>Item</th><th>Category</th><th>Our Price</th><th>Competitor Price</th><th>Difference</th><th>Position</th></tr></thead>
        <tbody>{list.map((i) => <tr key={i.item_id}><td className="strong">{i.item_name}</td><td>{i.category}</td><td>{inr(i.current_price)}</td><td>{inr(i.competitor_price)}</td><td className={i.current_price > i.competitor_price ? 'red' : 'green'}>{i.current_price > i.competitor_price ? '+' : ''}{inr(i.current_price - i.competitor_price)}</td><td>{i.pos}</td></tr>)}</tbody></table></div></Panel>
    </>
  )
}
