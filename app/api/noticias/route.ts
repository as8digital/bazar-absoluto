import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  const queries: Record<string, { q: string, domains?: string }> = {
    geral: {
      q: 'Massachusetts OR Boston OR "New England" community news',
      domains: 'bostonglobe.com,wbur.org,wcvb.com,bostonherald.com,masslive.com,cnn.com,reuters.com,apnews.com'
    },
    imigracao: {
      q: 'immigration visa Massachusetts deportation asylum green card',
      domains: 'reuters.com,apnews.com,nbcnews.com,cnn.com,bbc.com,bostonglobe.com,nytimes.com,washingtonpost.com'
    }
  }

  const cfg = queries[tipo] || queries.geral

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(cfg.q)}&domains=${cfg.domains}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    if (data.status === 'error') {
      // Fallback sem filtro de domínio
      const res2 = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(cfg.q)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`,
        { cache: 'no-store' }
      )
      const data2 = await res2.json()
      return NextResponse.json(data2)
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ articles: [] }, { status: 200 })
  }
}
