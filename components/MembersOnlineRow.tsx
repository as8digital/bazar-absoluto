'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Membro = {
  id: string
  nome: string
  foto_url?: string
}

/**
 * Linha compacta com avatares dos membros online.
 * Substitui o antigo "Stories" (que ocuparia muito espaço no banco).
 * Mostra contador de online + fileira horizontal com bolinha verde.
 *
 * Obs: se você NÃO tiver uma coluna "online" na tabela profiles,
 * este componente apenas mostra os últimos membros cadastrados.
 * Você pode trocar a query por uma real de presença depois.
 */
export default function MembersOnlineRow() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    // Últimos cadastrados (proxy simples para "online")
    // Troque por query real de presença quando tiver.
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, foto_url')
      .order('criado_em', { ascending: false })
      .limit(18)

    if (data) {
      setMembros(data as Membro[])
      // Contagem simulada — troque por count real quando quiser
      setTotal(data.length * 8)
    }
  }

  if (membros.length === 0) return null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '10px 12px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{
          fontFamily: 'Nunito', fontSize: 9, fontWeight: 800,
          letterSpacing: 1.3, textTransform: 'uppercase',
          color: 'var(--text-muted)', lineHeight: 1,
        }}>
          Online agora
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, marginTop: 3,
          fontFamily: 'Poppins', fontWeight: 700, fontSize: 13,
          color: 'var(--text-primary)', letterSpacing: -0.2,
        }}>
          <span className="online-pulse" />
          {total}
        </div>
      </div>

      <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />

      <div
        className="scroll-x"
        style={{
          flex: 1,
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 2,
        }}
      >
        {membros.map((m) => {
          const iniciais = (m.nome || 'U')
            .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          return (
            <div
              key={m.id}
              style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
              title={m.nome}
            >
              {m.foto_url ? (
                <img
                  src={m.foto_url}
                  alt={m.nome}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--bg-card)',
                  }}
                />
              ) : (
                <div
                  className="avatar"
                  style={{ width: 34, height: 34, fontSize: 12 }}
                >
                  {iniciais}
                </div>
              )}
              <div className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0 }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
