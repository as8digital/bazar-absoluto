'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    verificarRole()
  }, [])

  async function verificarRole() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      setIsAdmin(profile?.role === 'admin' || profile?.role === 'moderador')
    }
  }

  const ITENS = [
    { label: 'Início', icon: '🏠', rota: '/feed' },
    { label: 'Empregos', icon: '💼', rota: '/empregos' },
    { label: 'Postar', icon: '➕', rota: '/feed' },
    { label: 'Notícias', icon: '📰', rota: '/noticias' },
    { label: 'Perfil', icon: '👤', rota: '/perfil' },
  ]

  return (
    <div className="bottomnav">
      {ITENS.map((item) => {
        const ativo = pathname === item.rota
        return (
          <div key={item.label} className="nav-item" onClick={() => router.push(item.rota)}>
            {item.label === 'Postar' ? (
              <div style={{ width: 44, height: 44, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginTop: -16, boxShadow: '0 4px 12px rgba(204,0,0,0.4)' }}>
                {item.icon}
              </div>
            ) : (
              <>
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <span className={`nav-label ${ativo ? 'active' : ''}`}>{item.label}</span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
