'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'

const POSTS_PENDENTES = [
  { id: '1', autor: 'Pedro Lima', conteudo: 'Vendo carro Honda Civic 2018, ótimo estado, $12.000. WhatsApp: (555) 123-4567', tipo: 'Anúncio', tempo: '5 min atrás' },
  { id: '2', autor: 'Fernanda Costa', conteudo: 'Serviço de limpeza disponível em toda região de Boston. Chama no zap!', tipo: 'Serviço', tempo: '12 min atrás' },
  { id: '3', autor: 'Lucas Mendes', conteudo: 'Alguém sabe onde comprar produtos brasileiros em Boston?', tipo: 'Post', tempo: '18 min atrás' },
]

const USUARIOS = [
  { id: '1', nome: 'João Carlos', email: 'joao@email.com', cidade: 'Boston', status: 'ativo', posts: 12, criado: '2024-01-01' },
  { id: '2', nome: 'Maria Silva', email: 'maria@email.com', cidade: 'Cambridge', status: 'ativo', posts: 8, criado: '2024-01-05' },
  { id: '3', nome: 'Pedro Hater', email: 'hater@email.com', cidade: 'Somerville', status: 'suspenso', posts: 3, criado: '2024-01-10' },
]

const DENUNCIAS = [
  { id: '1', autor: 'João Silva', motivo: 'Conteúdo ofensivo', post: 'Texto impróprio...', status: 'pendente' },
  { id: '2', autor: 'Ana Costa', motivo: 'Spam / Propaganda', post: 'Anúncio repetido...', status: 'pendente' },
]

export default function Admin() {
  const [aba, setAba] = useState('pendentes')
  const [pendentes, setPendentes] = useState(POSTS_PENDENTES)
  const [usuarios, setUsuarios] = useState(USUARIOS)

  function aprovar(id: string) {
    setPendentes(p => p.filter(post => post.id !== id))
  }

  function reprovar(id: string) {
    setPendentes(p => p.filter(post => post.id !== id))
  }

  function toggleStatus(id: string) {
    setUsuarios(u => u.map(usr => usr.id === id ? { ...usr, status: usr.status === 'ativo' ? 'suspenso' : 'ativo' } : usr))
  }

  const ABAS = [
    { id: 'pendentes', label: 'Pendentes', badge: pendentes.length },
    { id: 'usuarios', label: 'Usuários', badge: 0 },
    { id: 'denuncias', label: 'Denúncias', badge: DENUNCIAS.length },
    { id: 'stats', label: 'Estatísticas', badge: 0 },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {/* Header admin */}
      <div style={{ background: 'var(--blue-dark)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, background: 'var(--gold)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚙️</div>
          <div>
            <h1 style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Painel Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Bazar Absoluto USA</p>
          </div>
        </div>

        {/* Cards de estatísticas rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { label: 'Usuários', valor: '234', icon: '👥' },
            { label: 'Posts hoje', valor: '47', icon: '📝' },
            { label: 'Pendentes', valor: String(pendentes.length), icon: '⏳' },
            { label: 'Denúncias', valor: String(DENUNCIAS.length), icon: '🚨' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>{s.valor}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Abas */}
      <div style={{ background: 'var(--bg-card)', display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ flex: 1, padding: '10px 8px', fontSize: 11, fontWeight: 700, color: aba === a.id ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a.id ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Nunito', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {a.label}
            {a.badge > 0 && <span style={{ background: 'var(--red)', color: 'white', fontSize: 9, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{a.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 12px 80px' }}>

        {/* Posts pendentes */}
        {aba === 'pendentes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendentes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum post pendente!</p>
              </div>
            )}
            {pendentes.map(post => (
              <div key={post.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{post.autor}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{post.tempo}</span>
                  </div>
                  <span className="tag">{post.tipo}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5, background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 8 }}>{post.conteudo}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => reprovar(post.id)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--red)', background: 'transparent', color: 'var(--red)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                    ✕ Reprovar
                  </button>
                  <button onClick={() => aprovar(post.id)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#2E7D32', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                    ✓ Aprovar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gestão de usuários */}
        {aba === 'usuarios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="input-field" placeholder="🔍 Buscar usuário..." style={{ marginBottom: 4 }} />
            {usuarios.map(usr => (
              <div key={usr.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{usr.nome[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{usr.nome}</span>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: usr.status === 'ativo' ? 'rgba(46,125,50,0.15)' : 'rgba(204,0,0,0.1)', color: usr.status === 'ativo' ? '#2E7D32' : 'var(--red)' }}>
                        {usr.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{usr.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {usr.cidade} · {usr.posts} posts</div>
                  </div>
                  <button onClick={() => toggleStatus(usr.id)} style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-input)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito', color: usr.status === 'ativo' ? 'var(--red)' : '#2E7D32' }}>
                    {usr.status === 'ativo' ? '🚫 Bloquear' : '✓ Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Denúncias */}
        {aba === 'denuncias' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DENUNCIAS.map(d => (
              <div key={d.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Denúncia de {d.autor}</span>
                  <span className="tag-red tag">PENDENTE</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, marginBottom: 6 }}>Motivo: {d.motivo}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, background: 'var(--bg-input)', padding: '8px 12px', borderRadius: 8 }}>{d.post}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>Ignorar</button>
                  <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: 'var(--red)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>Remover post</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {aba === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>📊 Resumo da plataforma</h3>
              {[
                { label: 'Total de usuários', valor: '234', cor: 'var(--blue-dark)' },
                { label: 'Posts publicados', valor: '1.247', cor: 'var(--red)' },
                { label: 'Vagas de emprego', valor: '89', cor: '#2E7D32' },
                { label: 'Serviços anunciados', valor: '156', cor: '#F4A100' },
                { label: 'Anúncios pagos', valor: '23', cor: 'var(--gold-dark)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: s.cor }}>{s.valor}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>💰 Receita</h3>
              {[
                { label: 'Anúncios este mês', valor: '$230' },
                { label: 'Destaques vendidos', valor: '$115' },
                { label: 'Total do mês', valor: '$345' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#2E7D32' }}>{s.valor}</span>
                </div>
              ))}
            </div>

            <button style={{ width: '100%', padding: '14px', background: 'var(--blue-dark)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
              📢 Enviar aviso para todos os usuários
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
