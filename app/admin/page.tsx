'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()
  const [aba, setAba] = useState('pendentes')
  const [pendentes, setPendentes] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [stats, setStats] = useState({ usuarios: 0, posts: 0, pendentes: 0 })

  useEffect(() => {
    verificarAdmin()
    carregarDados()
  }, [])

  async function verificarAdmin() {
    const { data } = await supabase.auth.getUser()
    if (!data.user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role !== 'admin' && profile?.role !== 'moderador') {
      router.push('/feed')
    }
  }

  async function carregarDados() {
    setCarregando(true)
    const { data: postsPend } = await supabase
      .from('posts')
      .select('*, profiles(nome, cidade, estado)')
      .eq('status', 'pendente')
      .order('criado_em', { ascending: false })

    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .order('criado_em', { ascending: false })

    const { count: totalPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true })
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: totalPend } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'pendente')

    setPendentes(postsPend || [])
    setUsuarios(users || [])
    setStats({ usuarios: totalUsers || 0, posts: totalPosts || 0, pendentes: totalPend || 0 })
    setCarregando(false)
  }

  async function aprovar(id: string) {
    await supabase.from('posts').update({ status: 'aprovado' }).eq('id', id)
    setPendentes(p => p.filter(post => post.id !== id))
    setStats(s => ({ ...s, pendentes: s.pendentes - 1 }))
  }

  async function reprovar(id: string) {
    await supabase.from('posts').update({ status: 'reprovado' }).eq('id', id)
    setPendentes(p => p.filter(post => post.id !== id))
    setStats(s => ({ ...s, pendentes: s.pendentes - 1 }))
  }

  async function toggleStatus(id: string, statusAtual: string) {
    const novoStatus = statusAtual === 'ativo' ? 'suspenso' : 'ativo'
    await supabase.from('profiles').update({ status: novoStatus }).eq('id', id)
    setUsuarios(u => u.map(usr => usr.id === id ? { ...usr, status: novoStatus } : usr))
  }

  const ABAS = [
    { id: 'pendentes', label: 'Pendentes', badge: stats.pendentes },
    { id: 'usuarios', label: 'Usuários', badge: 0 },
    { id: 'stats', label: 'Estatísticas', badge: 0 },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      <div style={{ background: 'var(--blue-dark)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, background: 'var(--gold)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚙️</div>
          <div>
            <h1 style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Painel Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Bazar Absoluto USA</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Usuários', valor: stats.usuarios, icon: '👥' },
            { label: 'Posts', valor: stats.posts, icon: '📝' },
            { label: 'Pendentes', valor: stats.pendentes, icon: '⏳' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{s.valor}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ flex: 1, padding: '10px 8px', fontSize: 11, fontWeight: 700, color: aba === a.id ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a.id ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {a.label}
            {a.badge > 0 && <span style={{ background: 'var(--red)', color: 'white', fontSize: 9, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{a.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 12px 80px' }}>
        {carregando ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Carregando...</div>
        ) : (
          <>
            {aba === 'pendentes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendentes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum post pendente!</p>
                  </div>
                ) : pendentes.map(post => (
                  <div key={post.id} className="card" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{post.profiles?.nome || 'Usuário'}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>📍 {post.profiles?.cidade}, {post.profiles?.estado}</span>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(post.criado_em).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5, background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 8 }}>{post.conteudo}</p>
                    {post.imagem_url && <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => reprovar(post.id)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--red)', background: 'transparent', color: 'var(--red)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>✕ Reprovar</button>
                      <button onClick={() => aprovar(post.id)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#2E7D32', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>✓ Aprovar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aba === 'usuarios' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {usuarios.map(usr => (
                  <div key={usr.id} className="card" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{usr.nome?.[0] || 'U'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{usr.nome}</span>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: usr.status === 'ativo' ? 'rgba(46,125,50,0.15)' : 'rgba(204,0,0,0.1)', color: usr.status === 'ativo' ? '#2E7D32' : 'var(--red)' }}>
                            {usr.status?.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {usr.cidade}, {usr.estado} · {usr.profissao}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📅 {new Date(usr.criado_em).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <button onClick={() => toggleStatus(usr.id, usr.status)} style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-input)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito', color: usr.status === 'ativo' ? 'var(--red)' : '#2E7D32' }}>
                        {usr.status === 'ativo' ? '🚫 Bloquear' : '✓ Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aba === 'stats' && (
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>📊 Resumo da plataforma</h3>
                {[
                  { label: 'Total de usuários', valor: stats.usuarios },
                  { label: 'Total de posts', valor: stats.posts },
                  { label: 'Posts pendentes', valor: stats.pendentes },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--red)' }}>{s.valor}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
