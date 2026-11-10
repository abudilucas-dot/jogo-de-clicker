const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi']

export function formatNumber(value: number): string {
  const absolute = Math.abs(value)
  if (absolute < 1_000) return Math.floor(value).toLocaleString('pt-BR')
  const tier = Math.min(Math.floor(Math.log10(absolute) / 3), SUFFIXES.length - 1)
  const scaled = value / 1000 ** tier
  return `${scaled >= 100 ? Math.floor(scaled) : scaled.toFixed(scaled >= 10 ? 1 : 2).replace(/\.0+$/, '')}${SUFFIXES[tier]}`
}
