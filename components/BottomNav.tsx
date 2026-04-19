'use client'
import { useRouter, usePathname } from 'next/navigation'
import {
  IconHome, IconHomeFill,
  IconBriefcase, IconNews, IconUser, IconPlus,
} from './Icons'

type NavItem = {
  label: string
  rota: string
  Icon?: (p: { size?: number; stroke?: number }) => JSX.Element
  IconActive?: (p: { size?: number; stroke?: number }) => JSX.Element
  isPostar?: boolean
}

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const ITENS: NavItem[] = [
    { label: 'Início',   rota: '/feed',     Icon: IconHome, IconActive: IconHomeFill },
    { label: 'Empregos', rota: '/empregos', Icon: IconBriefcase },
    { label: 'Postar',   rota: '/feed',     isPostar: true },
    { label: 'Notícias', rota: '/noticias', Icon: IconNews },
    { label: 'Perfil',   rota: '/perfil',   Icon: IconUser },
  ]

  return (
    <div className="bottomnav">
      {ITENS.map((item) => {
        if (item.isPostar) {
          return (
            <div key={item.label} className="nav-item" onClick={() => router.push(item.rota)}>
              <div style={{
                width: 48, height: 48,
                background: 'var(--red)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                marginTop: -18,
                boxShadow: '0 6px 14px oklch(0.55 0.22 26 / 0.4)',
              }}>
                <IconPlus size={22} stroke={2.4} />
              </div>
            </div>
          )
        }

        const ativo = pathname === item.rota
        const IconToUse = (ativo && item.IconActive ? item.IconActive : item.Icon) as NonNullable<NavItem['Icon']>

        return (
          <div
            key={item.label}
            className={`nav-item ${ativo ? 'active' : ''}`}
            onClick={() => router.push(item.rota)}
          >
            <IconToUse size={22} stroke={ativo ? 2 : 1.8} />
            <span className={`nav-label ${ativo ? 'active' : ''}`}>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
