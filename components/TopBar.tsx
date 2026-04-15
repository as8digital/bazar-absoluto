'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TopBar() {
  const [tema, setTema] = useState<'light' | 'dark'>('light')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema') as 'light' | 'dark' || 'light'
    setTema(temaSalvo)
    document.documentElement.setAttribute('data-theme', temaSalvo)
    verificarRole()
  }, [])

  async function verificarRole() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      setIsAdmin(profile?.role === 'admin' || profile?.role === 'moderador')
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
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--bg-input)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          🔔
        </div>
      </div>
    </div>
  )
}
