'use client'
import { useRouter, usePathname } from 'next/navigation'

const ITENS = [
  { label: 'Inicio', icon: '🏠', rota: '/feed' },
  { label: 'Empregos', icon: '💼', rota: '/empregos' },
  { label: 'Postar', icon: '➕', rota: '/feed?postar=1' },
  { label: 'Servicos', icon: '🔧', rota: '/servicos' },
  { label: 'Perfil', icon: '👤', rota: '/perfil' },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="bottomnav">
      {ITENS.map((item) => {
        const ativo = pathname === item.rota.split('?')[0]
        return (
          <div key={item.label} className="nav-item" onClick={() => router.push(item.rota)}>
            {item.label === 'Postar' ? (
              <div style={{ width: 44, height: 44, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginTop: -16, boxShadow: '0 4px 12px rgba(204,0,0,0.4)' }}>
                {item.icon}
              </div>
            ) : (
              <>
                <div style={{ fontSize: 20, filter: ativo ? 'none' : 'grayscale(0.5)' }}>{item.icon}</div>
                <span className={`nav-label ${ativo ? 'active' : ''}`}>{item.label}</span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
