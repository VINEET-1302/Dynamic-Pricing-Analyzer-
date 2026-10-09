import { Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav'
import { useData } from './data/DataContext'
import Overview from './pages/Overview'
import Catalog from './pages/Catalog'
import Simulator from './pages/Simulator'
import Market from './pages/Market'
import Stock from './pages/Stock'
import Trends from './pages/Trends'

export default function App() {
  const { loading, error } = useData()
  return (
    <>
      <TopNav />
      <main className="page">
        {loading ? <div className="state"><div className="spinner" />Loading 10,000 records…</div>
          : error ? <div className="state err">Could not load the dataset: {error}. Make sure the CSV is in <code>public/data/</code> and you are using <code>npm run dev</code>.</div>
          : <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/market" element={<Market />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/trends" element={<Trends />} />
            </Routes>}
      </main>
    </>
  )
}
