// Minimal CSV parser (the dataset has no quoted commas). Numeric columns become numbers.
export function parseCSV(text) {
  const [head, ...lines] = text.trim().split(/\r?\n/)
  const cols = head.split(',')
  return lines.map((line) => {
    const v = line.split(','), row = {}
    cols.forEach((c, i) => { row[c] = v[i] !== '' && !isNaN(v[i]) && c !== 'item_id' ? Number(v[i]) : v[i] })
    return row
  })
}
