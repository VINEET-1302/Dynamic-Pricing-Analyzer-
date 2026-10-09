const tone = { 'Increase Price': 'up', 'Decrease Price': 'down', 'Maintain Price': 'flat', Critical: 'down', Low: 'warn', Medium: 'flat', High: 'up', 'Very High': 'up', 'Very Low': 'down' }
export default function Badge({ label }) { return <span className={'badge ' + (tone[label] || 'flat')}>{label}</span> }
