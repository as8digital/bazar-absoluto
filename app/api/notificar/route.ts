import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { titulo, mensagem, usuario_id } = await request.json()
  const apiKey = process.env.ONESIGNAL_API_KEY
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'cb2509bf-d38a-4037-af4a-9098cdde0b80'

  try {
    const body: any = {
      app_id: appId,
      headings: { en: titulo, pt: titulo },
      contents: { en: mensagem, pt: mensagem },
      url: 'https://bazar-absoluto.vercel.app/notificacoes',
    }

    // Se tiver usuario_id envia só para ele, senão envia para todos
    if (usuario_id) {
      body.filters = [{ field: 'tag', key: 'user_id', relation: '=', value: usuario_id }]
    } else {
      body.included_segments = ['All']
    }

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar notificação' }, { status: 500 })
  }
}
