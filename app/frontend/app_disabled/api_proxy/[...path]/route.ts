import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: any) {
  const path = params.path || []
  const backendPath = path.join('/')
  const url = new URL(req.url)
  const search = url.search
  const backendUrl = `http://127.0.0.1:8000/${backendPath}${search}`
  const resp = await fetch(backendUrl)
  const text = await resp.text()
  const headers = new Headers(resp.headers)
  // ensure CORS safe
  headers.set('x-proxied-by','next-api-proxy')
  return new NextResponse(text, { status: resp.status, headers })
}
