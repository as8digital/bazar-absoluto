import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  const hoje = new Date()
  const seteDias = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
  const dataFrom = seteDias.toISOString().split('T')[0]

  const queries: Record<string, string> = {
    geral: `Boston OR Massachusetts OR "New England" news`,
    imigracao: `immigration ICE "green card" "social security" deportation asylum`
  }

  const query = queries[tipo] || queries.geral

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${dataFrom}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()

    if (data.status === 'error' || !data.articles?.length) {
      // Fallback sem filtro de data
      const url2 = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      const res2 = await fetch(url2, { cache: 'no-store' })
      const data2 = await res2.json()
      return NextResponse.json(data2)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ articles: [] }, { status: 200 })
  }
}
