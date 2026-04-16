import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  const queries: Record<string, string> = {
    geral: 'Massachusetts Boston news community 2025',
    imigracao: 'immigration visa green card Massachusetts Boston 2025',
  }

  const query = queries[tipo] || queries.geral

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    if (data.status === 'error') {
      return NextResponse.json({ articles: [], error: data.message }, { status: 200 })
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ articles: [], error: 'Erro ao buscar' }, { status: 200 })
  }
}
