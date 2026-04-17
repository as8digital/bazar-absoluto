import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  const queries: Record<string, string> = {
    geral: 'Massachusetts Boston community news 2025',
    imigracao: 'ICE immigration "green card" "social security" deportation asylum 2025'
  }

  const query = queries[tipo] || queries.geral

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ articles: [] }, { status: 200 })
  }
}
