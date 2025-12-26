export default async function handler(req, res) {
  try {
    const pathParam = req.query.path || []
    const backendPath = Array.isArray(pathParam) ? pathParam.join('/') : pathParam
    const qs = Object.keys(req.query)
      .filter((k) => k !== 'path')
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(req.query[k])}`)
      .join('&')
    const backendUrl = `http://127.0.0.1:8000/${backendPath}${qs ? '?' + qs : ''}`
    const r = await fetch(backendUrl)
    const text = await r.text()
    res.status(r.status)
    r.headers.forEach((v, k) => res.setHeader(k, v))
    res.setHeader('x-proxied-by', 'next-pages-proxy')
    res.send(text)
  } catch (e) {
    res.status(502).json({ error: String(e) })
  }
}
