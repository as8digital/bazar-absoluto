'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  IconHome, IconBriefcase, IconTool, IconNews, IconUser, IconBookmark,
} from './Icons'

/**
 * Sidebar esquerda do desktop — menu vertical "Navegar".
 * Só aparece em telas >= 768px (o CSS .sidebar-left cuida disso).
 */
export default function SidebarLeft() {
  const router = useRouter()
  const pathname = usePathname()
  const [contagens, setContagens] = useState({ empregos: 0, noticias: 0, salvos: 0 })

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    try {
      const [{ count: empregos }, { count: noticias }] = await Promise.all([
        supabase.from('empregos').select('*', { count: 'exact', head: true }),
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
      ])
      setContagens({
        empregos: empregos || 0,
        noticias: noticias || 0,
        salvos: 0,
      })
    } catch {
      // tabelas podem não existir — segue sem contadores
    }
  }

  const ITENS = [
    { label: 'Feed da comunidade', rota: '/feed',       Icon: IconHome },
    { label: 'Empregos',            rota: '/empregos',   Icon: IconBriefcase, badge: contagens.empregos },
    { label: 'Serviços',            rota: '/servicos',   Icon: IconTool },
    { label: 'Notícias',            rota: '/noticias',   Icon: IconNews,      badge: contagens.noticias },
    { label: 'Meu perfil',          rota: '/perfil',     Icon: IconUser },
    { label: 'Salvos',              rota: '/salvos',     Icon: IconBookmark },
  ]

  return (
    <aside className="sidebar-left">
      <div style={{
        fontSize: 10.5, fontWeight: 800,
        letterSpacing: 1.8, textTransform: 'uppercase',
        color: 'var(--text-muted)', padding: '2px 14px 10px',
      }}>
        Navegar
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ITENS.map((it) => {
          const ativo = pathname === it.rota
          return (
            <button
              key={it.rota}
              onClick={() => router.push(it.rota)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                background: ativo ? 'var(--red-soft)' : 'transparent',
                color: ativo ? 'var(--red)' : 'var(--text-primary)',
                border: 'none', borderRadius: 12,
                cursor: 'pointer', fontFamily: 'Nunito',
                fontWeight: ativo ? 700 : 600, fontSize: 14,
                textAlign: 'left', width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!ativo) e.currentTarget.style.background = 'var(--bg-hover)' }}
              onMouseLeave={e => { if (!ativo) e.currentTarget.style.background = 'transparent' }}
            >
              <it.Icon size={18} stroke={ativo ? 2.2 : 1.8} />
              <span style={{ flex: 1 }}>{it.label}</span>
              {!!it.badge && it.badge > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: 'var(--text-muted)',
                  background: 'var(--bg-input)',
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  {it.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
