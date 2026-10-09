export default function Kpi({ icon: Icon, label, value, hint, tone = '' }) {
  return <div className={'kpi ' + tone}><div className="kpi-icon"><Icon size={18} /></div><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div>{hint && <div className="kpi-hint">{hint}</div>}</div>
}
