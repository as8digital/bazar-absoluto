'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { IconUser, IconBriefcase, IconNews } from './Icons'

/**
 * Sidebar direita do desktop — "Comunidade hoje".
 * Mostra contadores rápidos (membros, vagas, posts de hoje).
 */
export default function SidebarRight() {
  const [stats, setStats] = useState({ membros: 0, vagas: 0, posts: 0, novosHoje: 0 })

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    try {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const inicioHoje = hoje.toISOString()

      const membrosQ = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const vagasQ   = await supabase.from('empregos').select('*', { count: 'exact', head: true })
      const postsQ   = await supabase.from('posts').select('*', { count: 'exact', head: true }).gte('criado_em', inicioHoje)
      const novosQ   = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('criado_em', inicioHoje)

      setStats({
        membros:   membrosQ.count || 0,
        vagas:     vagasQ.count   || 0,
        posts:     postsQ.count   || 0,
        novosHoje: novosQ.count   || 0,
      })
    } catch {
      // ok, mostra zeros
    }
  }

  const ITENS = [
    {
      Icon: IconUser,
      numero: stats.membros.toLocaleString('pt-BR'),
      label: 'Membros',
      sub: stats.novosHoje > 0 ? `+${stats.novosHoje} hoje` : null,
    },
    {
      Icon: IconBriefcase,
      numero: stats.vagas.toString(),
      label: 'Vagas',
      sub: 'abertas',
    },
    {
      Icon: IconNews,
      numero: stats.posts.toString(),
      label: 'Posts hoje',
      sub: 'últ. 24h',
    },
  ]

  return (
    <aside className="sidebar-right">
      <div className="card" style={{ padding: '16px' }}>
        <div style={{
          fontSize: 10.5, fontWeight: 800,
          letterSpacing: 1.8, textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: 14,
        }}>
          Comunidade hoje
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ITENS.map((it) => (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'var(--red-soft)',
                color: 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <it.Icon size={18} stroke={2} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Poppins', fontSize: 18, fontWeight: 700,
                  color: 'var(--text-primary)', lineHeight: 1.1,
                  letterSpacing: -0.3,
                }}>
                  {it.numero}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                  {it.label}{it.sub && <span style={{ opacity: 0.7 }}> · {it.sub}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
