import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get('tipo') || 'geral'
  const apiKey = process.env.NEWS_API_KEY

  const hoje = new Date()
  const seteDias = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
  const dataFrom = seteDias.toISOString().split('T')[0]

  try {
    if (tipo === 'imigracao') {
      const url = `https://newsapi.org/v2/everything?q=immigration+ICE+deportation+asylum&from=${dataFrom}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      if (data.articles?.length) return NextResponse.json(data)
      
      // Fallback imigração
      const url2 = `https://newsapi.org/v2/everything?q=immigration+visa+border&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      const res2 = await fetch(url2, { cache: 'no-store' })
      return NextResponse.json(await res2.json())
    } else {
      const url = `https://newsapi.org/v2/everything?q=Boston+Massachusetts+news&from=${dataFrom}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      if (data.articles?.length) return NextResponse.json(data)

      // Fallback geral
      const url2 = `https://newsapi.org/v2/everything?q=Massachusetts+community&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      const res2 = await fetch(url2, { cache: 'no-store' })
      return NextResponse.json(await res2.json())
    }
  } catch (error) {
    return NextResponse.json({ articles: [] }, { status: 200 })
  }
}
