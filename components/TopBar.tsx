'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TopBar() {
  const [tema, setTema] = useState<'light' | 'dark'>('light')
  const [isAdmin, setIsAdmin] = useState(false)
  const [totalNotif, setTotalNotif] = useState(0)
  const [usuario, setUsuario] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema') as 'light' | 'dark' || 'light'
    setTema(temaSalvo)
    document.documentElement.setAttribute('data-theme', temaSalvo)
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      setUsuario(data.user)
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      setIsAdmin(profile?.role === 'admin' || profile?.role === 'moderador')
      // Carregar notificações não lidas
      const { count } = await supabase.from('notificacoes').select('*', { count: 'exact', head: true }).eq('usuario_id', data.user.id).eq('lida', false)
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
    { label: '🏠 Feed', rota: '/feed' },
    { label: '💼 Empregos', rota: '/empregos' },
    { label: '🔧 Serviços', rota: '/servicos' },
    { label: '📰 Notícias', rota: '/noticias' },
    { label: '👤 Perfil', rota: '/perfil' },
  ]

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'var(--red)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 18, fontFamily: 'Poppins', cursor: 'pointer' }} onClick={() => router.push('/feed')}>B</div>
        <div style={{ cursor: 'pointer' }} onClick={() => router.push('/feed')}>
          <div className="logo-text">BAZAR <span>ABSOLUTO</span></div>
          <div className="logo-sub">USA COMMUNITY</div>
        </div>
      </div>

      <nav className="desktop-nav">
        {NAV_ITEMS.map(item => (
          <button key={item.rota} onClick={() => router.push(item.rota)} className={`desktop-nav-item ${pathname === item.rota ? 'active' : ''}`}>
            {item.label}
          </button>
        ))}
        {isAdmin && (
          <button onClick={() => router.push('/admin')} className={`desktop-nav-item ${pathname === '/admin' ? 'active' : ''}`} style={{ color: 'var(--gold-dark)', background: 'rgba(255,215,0,0.1)' }}>
            ⚙️ Admin
          </button>
        )}
      </nav>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={alternarTema} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--bg-input)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {tema === 'light' ? '🌙' : '☀️'}
        </button>
        <button onClick={() => router.push('/notificacoes')} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--bg-input)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          🔔
          {totalNotif > 0 && (
            <div style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>
              {totalNotif > 9 ? '9+' : totalNotif}
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
