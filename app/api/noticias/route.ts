import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  try {
    let url = ''

    if (tipo === 'geral') {
      // Top headlines dos EUA sobre Massachusetts/Boston
      url = `https://newsapi.org/v2/top-headlines?country=us&q=Massachusetts+Boston&pageSize=20&apiKey=${apiKey}`
    } else {
      // Imigração - everything com data recente
      const hoje = new Date()
      const semanaPassada = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
      const dataFrom = semanaPassada.toISOString().split('T')[0]
      url = `https://newsapi.org/v2/everything?q=immigration+ICE+OR+"green+card"+OR+"social+security"+OR+deportation+OR+asylum&from=${dataFrom}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
    }

    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()

    if (data.status === 'error') {
      // Fallback mais simples
      const fallback = tipo === 'geral'
        ? `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=20&apiKey=${apiKey}`
        : `https://newsapi.org/v2/everything?q=immigration+visa+deportation&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      const res2 = await fetch(fallback, { cache: 'no-store' })
      const data2 = await res2.json()
      return NextResponse.json(data2)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ articles: [], status: 'error' }, { status: 200 })
  }
}
