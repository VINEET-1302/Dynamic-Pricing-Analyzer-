import { Link } from 'react-router-dom'
import { Database, Package, Percent, Scale, IndianRupee, Activity, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { useData } from '../data/DataContext'
import Kpi from '../components/Kpi'
import Badge from '../components/Badge'
import { Panel, ChartPanel, tip, grid, tick } from '../components/Panel'
import { inr, inrShort, pct, actionFor } from '../services/pricing'

export default function Overview() {
  const { rows, items, monthly, categoryStats, seasonStats } = useData()
  const avg = (k) => rows.reduce((s, r) => s + r[k], 0) / rows.length
  const gap = items.reduce((s, i) => s + i.avgGap, 0) / items.length
  const moves = items.map((i) => ({ ...i, move: pct(i.recommended_price, i.current_price) })).sort((a, b) => Math.abs(b.move) - Math.abs(a.move))
  const ups = moves.filter((m) => m.move > 0.5).length, downs = moves.filter((m) => m.move < -0.5).length
  return (
    <>
      <div className="hero">
        <div><span className="eyebrow">Automotive pricing intelligence</span><h1>Set the right price for every part, tyre and service.</h1>
          <p>Combining competitor prices, demand, stock and sales history from {rows.length.toLocaleString('en-IN')} records across {items.length} items.</p>
          <Link to="/simulator" className="btn">Open Price Simulator <ArrowUpRight size={16} /></Link></div>
        <div className="hero-stats"><div><b className="green">{ups}</b><span>items to raise</span></div><div><b className="red">{downs}</b><span>items to cut</span></div><div><b>{items.length - ups - downs}</b><span>hold price</span></div></div>
      </div>
      <div className="kpis">
        <Kpi icon={Database} label="Records" value={rows.length.toLocaleString('en-IN')} />
        <Kpi icon={Package} label="Catalog Items" value={items.length} />
        <Kpi icon={IndianRupee} label="Total Revenue" value={inrShort(rows.reduce((s, r) => s + r.sales_revenue, 0))} />
        <Kpi icon={Scale} label="Avg Price vs Competitor" value={`${gap >= 0 ? '+' : ''}${gap.toFixed(1)}%`} />
        <Kpi icon={Percent} label="Avg Discount" value={`${avg('discount_percent').toFixed(1)}%`} />
        <Kpi icon={Activity} label="Avg Demand Score" value={avg('demand_score').toFixed(1)} />
      </div>
      <div className="cols2">
        <ChartPanel title="Monthly Revenue" sub="₹ crore"><AreaChart data={monthly}>{grid}<XAxis dataKey="month" tick={tick} minTickGap={30} /><YAxis tick={tick} />{tip}<Area dataKey="revenue" stroke="#f97316" fill="rgba(249,115,22,.2)" strokeWidth={2} /></AreaChart></ChartPanel>
        <ChartPanel title="Demand Trend" sub="Average demand score"><LineChart data={monthly}>{grid}<XAxis dataKey="month" tick={tick} minTickGap={30} /><YAxis tick={tick} domain={['auto', 'auto']} />{tip}<Line dataKey="demand" stroke="#38bdf8" strokeWidth={2} dot={false} /></LineChart></ChartPanel>
        <ChartPanel title="Revenue by Category" sub="₹ crore"><BarChart data={categoryStats} layout="vertical" margin={{ left: 30 }}><XAxis type="number" tick={tick} /><YAxis type="category" dataKey="name" tick={tick} width={90} />{tip}<Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]} /></BarChart></ChartPanel>
        <ChartPanel title="Demand by Season"><BarChart data={seasonStats}>{grid}<XAxis dataKey="name" tick={tick} /><YAxis tick={tick} domain={[60, 100]} />{tip}<Bar dataKey="demand" fill="#38bdf8" radius={[4, 4, 0, 0]} /></BarChart></ChartPanel>
      </div>
      <Panel title="Biggest Recommended Price Moves" sub="Latest snapshot per item: dataset recommended price vs current price">
        <div className="tablewrap"><table><thead><tr><th>Item</th><th>Category</th><th>Current</th><th>Recommended</th><th>Change</th><th>Action</th></tr></thead>
          <tbody>{moves.slice(0, 6).map((m) => <tr key={m.item_id}><td className="strong">{m.item_name}</td><td>{m.category}</td><td>{inr(m.current_price)}</td><td className="hl">{inr(m.recommended_price)}</td><td className={m.move >= 0 ? 'green' : 'red'}>{m.move >= 0 ? '+' : ''}{m.move.toFixed(1)}%</td><td><Badge label={actionFor(m.move)} /></td></tr>)}</tbody></table></div>
      </Panel>
    </>
  )
}
