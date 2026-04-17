'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Notificacoes() {
  const router = useRouter()
  const [notifs, setNotifs] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregarNotifs() }, [])

  async function carregarNotifs() {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { router.push('/login'); return }
    const { data } = await supabase.from('notificacoes').select('*').eq('usuario_id', auth.user.id).order('criado_em', { ascending: false })
    setNotifs(data || [])
    // Marcar todas como lidas
    await supabase.from('notificacoes').update({ lida: true }).eq('usuario_id', auth.user.id).eq('lida', false)
    setCarregando(false)
  }

  const ICONES: Record<string, string> = {
    comunicado: '📢', emprego: '💼', servico: '🔧', curtida: '♥', comentario: '💬', aprovado: '✅', geral: '🔔'
  }

  const tempo = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
    if (h < 1) return 'agora'
    if (h < 24) return `há ${h}h`
    return `há ${Math.floor(h / 24)} dias`
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), #003DA5)', padding: '16px' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, fontFamily: 'Poppins' }}>🔔 Notificações</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{notifs.length} notificações</p>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 12px 80px' }}>
        {carregando ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div style={{ fontSize: 40 }}>⏳</div></div>
        ) : notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔔</div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>Nenhuma notificação!</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Fique de olho por novidades!</p>
          </div>
        ) : notifs.map(n => (
          <div key={n.id} className="card" style={{ padding: 14, marginBottom: 10, borderLeft: n.lida ? '3px solid var(--border)' : '3px solid var(--red)', opacity: n.lida ? 0.8 : 1 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: n.lida ? 'var(--bg-input)' : 'rgba(204,0,0,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {ICONES[n.tipo] || '🔔'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{n.titulo}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.mensagem}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{tempo(n.criado_em)}</div>
              </div>
              {!n.lida && <div style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
