import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  const hoje = new Date()
  const seteDias = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
  const dataFrom = seteDias.toISOString().split('T')[0]

  const query = tipo === 'imigracao'
    ? 'immigration ICE deportation asylum "green card"'
    : 'Boston Massachusetts news community'

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${dataFrom}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ articles: [] }, { status: 200 })
  }
}
