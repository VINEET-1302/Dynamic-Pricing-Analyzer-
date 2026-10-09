import { NavLink } from 'react-router-dom'
import { Gauge, LayoutGrid, Boxes, Calculator, Swords, Warehouse, LineChart } from 'lucide-react'
const links = [['/', 'Overview', LayoutGrid], ['/catalog', 'Catalog', Boxes], ['/simulator', 'Price Simulator', Calculator], ['/market', 'Market', Swords], ['/stock', 'Stock', Warehouse], ['/trends', 'Trends', LineChart]]
export default function TopNav() {
  return (
    <header className="topnav">
      <div className="logo"><Gauge size={22} /><b>AutoPrice</b><span>Optimizer</span></div>
      <nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'tab active' : 'tab')}><Icon size={16} />{label}</NavLink>)}</nav>
      <div className="me"><span className="avatar">T</span></div>
    </header>
  )
}
