const BASE = import.meta.env.VITE_API_BASE || ''
const USE_MOCK = String(import.meta.env.VITE_MOCK_DATA ?? 'false').toLowerCase() === 'true'

async function http(path, params=null, opts={}){
  if (USE_MOCK) return { type:'FeatureCollection', features:[] }
  const url = new URL(BASE + path)
  if (params) Object.entries(params).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=='') url.searchParams.set(k,v)})
  const headers = new Headers(opts.headers||{})
  if (!headers.has('Content-Type')) headers.set('Content-Type','application/json')
  const res = await fetch(url.toString(), { ...opts, headers })
  if (!res.ok) { const t = await res.text().catch(()=> ''); throw new Error(`HTTP ${res.status} ${res.statusText} — ${t}`) }
  return res.status===204 ? null : res.json()
}

export const api = {
  zones:   (bbox, time) => http('/v1/zones',   { bbox, time }),
  notams:  (bbox, time) => http('/v1/notams',  { bbox, time }),
  weather: (bbox, time) => http('/v1/weather', { bbox, time }),
  dfpSpoor:        (bbox) => http('/v1/dfp/spoor',        { bbox }),
  dfpLandingsites: (bbox) => http('/v1/dfp/landingsites', { bbox }),
}

export function toBboxString(bounds){
  const s = bounds.getSouth(), n = bounds.getNorth(), w = bounds.getWest(), e = bounds.getEast()
  return `${w.toFixed(6)},${s.toFixed(6)},${e.toFixed(6)},${n.toFixed(6)}`
}
