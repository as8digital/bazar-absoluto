'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  IconHome, IconBriefcase, IconTool, IconNews, IconUser,
  IconSettings, IconMoon, IconSun, IconBell,
} from './Icons'

export default function TopBar() {
  const [tema, setTema] = useState<'light' | 'dark'>('light')
  const [isAdmin, setIsAdmin] = useState(false)
  const [totalNotif, setTotalNotif] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const temaSalvo = (localStorage.getItem('tema') as 'light' | 'dark') || 'light'
    setTema(temaSalvo)
    document.documentElement.setAttribute('data-theme', temaSalvo)
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      setIsAdmin(profile?.role === 'admin' || profile?.role === 'moderador')
      const { count } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', data.user.id)
        .eq('lida', false)
      setTotalNotif(count || 0)
    }
  }

  function alternarTema() {
    const novoTema = tema === 'light' ? 'dark' : 'light'
    setTema(novoTema)
    localStorage.setItem('tema', novoTema)
    document.documentElement.setAttribute('data-theme', novoTema)
  }

  const NAV_ITEMS = [
    { label: 'Feed',     rota: '/feed',     Icon: IconHome },
    { label: 'Empregos', rota: '/empregos', Icon: IconBriefcase },
    { label: 'Serviços', rota: '/servicos', Icon: IconTool },
    { label: 'Notícias', rota: '/noticias', Icon: IconNews },
    { label: 'Perfil',   rota: '/perfil',   Icon: IconUser },
  ] as const

  const iconBtn: React.CSSProperties = {
    width: 38, height: 38, borderRadius: 12,
    border: '1px solid var(--border)', background: 'var(--bg-input)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s',
  }

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 38, height: 38, background: 'var(--red)', borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: 'white', fontSize: 18, fontFamily: 'Poppins',
            cursor: 'pointer', letterSpacing: -1,
          }}
          onClick={() => router.push('/feed')}
        >
          B
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => router.push('/feed')}>
          <div className="logo-text">BAZAR <span>ABSOLUTO</span></div>
          <div className="logo-sub">USA COMMUNITY</div>
        </div>
      </div>

      <nav className="desktop-nav">
        {NAV_ITEMS.map((item) => {
          const ativo = pathname === item.rota
          return (
            <button
              key={item.rota}
              onClick={() => router.push(item.rota)}
              className={`desktop-nav-item ${ativo ? 'active' : ''}`}
            >
              <item.Icon size={16} />
              {item.label}
            </button>
          )
        })}
        {isAdmin && (
          <button
            onClick={() => router.push('/admin')}
            className={`desktop-nav-item ${pathname === '/admin' ? 'active' : ''}`}
            style={{ color: 'var(--gold-dark)' }}
          >
            <IconSettings size={16} />
            Admin
          </button>
        )}
      </nav>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={alternarTema} style={iconBtn} aria-label="Alternar tema">
          {tema === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
        </button>
        <button
          onClick={async () => {
            if (typeof window !== 'undefined' && (window as any).OneSignal) {
              const OneSignal = (window as any).OneSignal
              const isSubscribed = await OneSignal.User?.PushSubscription?.optedIn
              if (!isSubscribed) {
                await OneSignal.Slidedown?.promptPush()
              } else {
                router.push('/notificacoes')
              }
            } else {
              router.push('/notificacoes')
            }
          }}
          style={{ ...iconBtn, position: 'relative' }}
          aria-label="Notificações"
        >
          <IconBell size={18} />
          {totalNotif > 0 && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              minWidth: 18, height: 18, padding: '0 5px',
              background: 'var(--red)', borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: 'white',
              border: '2px solid var(--bg-card)',
            }}>
              {totalNotif > 9 ? '9+' : totalNotif}
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
