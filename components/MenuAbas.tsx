'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function MenuAbas() {
  const router = useRouter()
  const pathname = usePathname()

  const ABAS = [
    { label: 'Feed', rota: '/feed' },
    { label: 'Empregos', rota: '/empregos' },
    { label: 'Serviços', rota: '/servicos' },
    { label: 'Notícias', rota: '/noticias' },
  ]

  return (
    <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', position: 'sticky', top: 56, zIndex: 99 }}>
      {ABAS.map(a => (
        <button key={a.rota} onClick={() => router.push(a.rota)} style={{ flex: 1, padding: '11px 4px', fontSize: 13, fontWeight: 700, color: pathname === a.rota ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: pathname === a.rota ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito' }}>
          {a.label}
        </button>
      ))}
    </div>
  )
}
