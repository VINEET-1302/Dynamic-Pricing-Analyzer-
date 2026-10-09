import { ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
export const tip = <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #2a3240', borderRadius: 8, color: '#e6edf3' }} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
export const grid = <CartesianGrid stroke="#262d38" vertical={false} />
export const tick = { fill: '#8b98a8', fontSize: 12 }
export const Panel = ({ title, sub, right, children }) => <section className="panel"><div className="panel-head"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>{right}</div>{children}</section>
export const ChartPanel = ({ title, sub, right, height = 260, children }) => <Panel title={title} sub={sub} right={right}><ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer></Panel>
