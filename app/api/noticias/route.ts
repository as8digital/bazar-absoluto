import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || 'brasileiros Boston Massachusetts'
  const apiKey = process.env.NEWS_API_KEY

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar notícias' }, { status: 500 })
  }
}
