import { Warehouse, AlertOctagon, AlertTriangle, Clock } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Legend } from 'recharts'
import { useData } from '../data/DataContext'
import Kpi from '../components/Kpi'
import Badge from '../components/Badge'
import { ChartPanel, Panel, tip, grid, tick } from '../components/Panel'

const colors = { Critical: '#ef4444', Low: '#f59e0b', Medium: '#38bdf8', High: '#22c55e' }

export default function Stock() {
  const { items } = useData()
  const count = (s) => items.filter((i) => i.inventory_status === s).length
  const status = Object.keys(colors).map((name) => ({ name, value: count(name) }))
  const byCat = Object.entries(items.reduce((m, i) => ({ ...m, [i.category]: (m[i.category] || 0) + i.inventory_units }), {})).map(([name, units]) => ({ name, units }))
  const risk = items.filter((i) => ['Critical', 'Low'].includes(i.inventory_status)).sort((a, b) => a.inventory_units - b.inventory_units)
  return (
    <>
      <div className="head"><h1>Stock & Demand Risk</h1><p>Inventory levels from the latest snapshot of each item.</p></div>
      <div className="kpis four">
        <Kpi icon={Warehouse} label="Total Units in Stock" value={items.reduce((s, i) => s + i.inventory_units, 0).toLocaleString('en-IN')} />
        <Kpi icon={AlertOctagon} label="Critical Items" value={count('Critical')} tone="red" />
        <Kpi icon={AlertTriangle} label="Low Stock Items" value={count('Low')} tone="amber" />
        <Kpi icon={Clock} label="Avg Supplier Lead Time" value={`${(items.reduce((s, i) => s + i.supplier_lead_time_days, 0) / items.length).toFixed(0)} days`} />
      </div>
      <div className="cols2">
        <ChartPanel title="Inventory Status"><PieChart><Pie data={status} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>{status.map((s) => <Cell key={s.name} fill={colors[s.name]} />)}</Pie>{tip}<Legend /></PieChart></ChartPanel>
        <ChartPanel title="Units in Stock by Category"><BarChart data={byCat}>{grid}<XAxis dataKey="name" tick={tick} interval={0} angle={-30} textAnchor="end" height={70} /><YAxis tick={tick} />{tip}<Bar dataKey="units" fill="#f97316" radius={[4, 4, 0, 0]} /></BarChart></ChartPanel>
      </div>
      <Panel title="Restock Watchlist" sub="Critical and low-stock items, lowest first">
        {!risk.length ? <div className="empty">No items at risk.</div> : <div className="tablewrap"><table><thead><tr><th>Item</th><th>Category</th><th>Units</th><th>Status</th><th>Demand</th><th>Lead Time</th><th>Supplier</th></tr></thead>
          <tbody>{risk.map((i) => <tr key={i.item_id}><td className="strong">{i.item_name}</td><td>{i.category}</td><td>{i.inventory_units}</td><td><Badge label={i.inventory_status} /></td><td><Badge label={i.demand_level} /></td><td>{i.supplier_lead_time_days} days</td><td>{i.supplier}</td></tr>)}</tbody></table></div>}
      </Panel>
    </>
  )
}
