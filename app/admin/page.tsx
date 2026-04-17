'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import TopBar from '@/components/TopBar'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function GraficoBarra({ dados, cor }: { dados: { label: string, valor: number }[], cor: string }) {
  const max = Math.max(...dados.map(d => d.valor), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, padding: '0 4px' }}>
      {dados.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>{d.valor}</span>
          <div style={{ width: '100%', height: `${Math.max((d.valor / max) * 70, 4)}px`, background: cor, borderRadius: '4px 4px 0 0', minHeight: 4 }} />
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function CardStat({ icon, label, valor, cor, sub }: { icon: string, label: string, valor: number | string, cor: string, sub?: string }) {
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '14px', border: `1px solid var(--border)`, borderLeft: `4px solid ${cor}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, background: `${cor}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins' }}>{valor}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: cor, fontWeight: 600 }}>{sub}</div>}
        </div>
      </div>
    </div>
  )
}

function ModalPerfil({ usuario, onClose }: { usuario: any, onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 20, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>👤 Perfil do membro</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          {usuario.foto_url
            ? <img src={usuario.foto_url} alt={usuario.nome} style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--red)' }} />
            : <div className="avatar" style={{ width: 70, height: 70, fontSize: 26 }}>{usuario.nome?.[0] || 'U'}</div>
          }
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{usuario.nome}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {usuario.cidade}, {usuario.estado}</div>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 700, background: usuario.status === 'ativo' ? 'rgba(46,125,50,0.15)' : 'rgba(204,0,0,0.1)', color: usuario.status === 'ativo' ? '#2E7D32' : 'var(--red)' }}>
              {usuario.status?.toUpperCase() || 'ATIVO'}
            </span>
          </div>
        </div>

        {/* Selfie de verificação */}
        {usuario.selfie_url && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>📸 SELFIE DE VERIFICAÇÃO</p>
            <img src={usuario.selfie_url} alt="Selfie" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--border)' }} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: '📧 Email', valor: usuario.email || 'Não informado' },
            { label: '📱 Telefone', valor: usuario.telefone || 'Não informado' },
            { label: '💼 Profissão', valor: usuario.profissao || 'Não informado' },
            { label: '🌎 País de origem', valor: usuario.pais_origem || 'Não informado' },
            { label: '📅 Cadastro', valor: new Date(usuario.criado_em).toLocaleDateString('pt-BR') },
            { label: '🎭 Função', valor: usuario.role?.toUpperCase() || 'USER' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{item.valor}</span>
            </div>
          ))}
          {usuario.bio && (
            <div style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>BIO</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{usuario.bio}</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="btn-secondary" style={{ marginTop: 16, fontSize: 13 }}>Fechar</button>
      </div>
    </div>
  )
}

function ModalComunicado({ usuarios, onClose }: { usuarios: any[], onClose: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [alvo, setAlvo] = useState('todos')
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function enviarComunicado() {
    if (!titulo || !mensagem) return
    setEnviando(true)
    if (alvo === 'todos') {
      const notifs = usuarios.map(u => ({
        usuario_id: u.id, titulo, mensagem, tipo: 'comunicado', lida: false
      }))
      await supabase.from('notificacoes').insert(notifs)
      // Enviar push para todos
      await fetch('/api/notificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, mensagem })
      })
    } else {
      await supabase.from('notificacoes').insert({
        usuario_id: usuarioSelecionado, titulo, mensagem, tipo: 'comunicado', lida: false
      })
      // Enviar push para usuário específico
      await fetch('/api/notificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, mensagem, usuario_id: usuarioSelecionado })
      })
    }
    setEnviado(true)
    setEnviando(false)
    setTimeout(onClose, 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 20 }}>
        {enviado ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 56 }}>✅</div>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>Comunicado enviado!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>📢 Enviar comunicado</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setAlvo('todos')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `2px solid ${alvo === 'todos' ? 'var(--red)' : 'var(--border)'}`, background: alvo === 'todos' ? 'rgba(204,0,0,0.08)' : 'var(--bg-input)', color: alvo === 'todos' ? 'var(--red)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                  👥 Todos os membros
                </button>
                <button onClick={() => setAlvo('especifico')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `2px solid ${alvo === 'especifico' ? 'var(--red)' : 'var(--border)'}`, background: alvo === 'especifico' ? 'rgba(204,0,0,0.08)' : 'var(--bg-input)', color: alvo === 'especifico' ? 'var(--red)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                  👤 Membro específico
                </button>
              </div>
              {alvo === 'especifico' && (
                <select className="input-field" value={usuarioSelecionado} onChange={e => setUsuarioSelecionado(e.target.value)}>
                  <option value="">Selecionar membro...</option>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
              )}
              <input className="input-field" placeholder="Título do comunicado *" value={titulo} onChange={e => setTitulo(e.target.value)} />
              <textarea className="input-field" placeholder="Mensagem *" value={mensagem} onChange={e => setMensagem(e.target.value)} rows={4} style={{ resize: 'none' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={onClose}>Cancelar</button>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={enviarComunicado} disabled={enviando || !titulo || !mensagem || (alvo === 'especifico' && !usuarioSelecionado)}>
                  {enviando ? '⏳ Enviando...' : '📢 Enviar'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  const router = useRouter()
  const [aba, setAba] = useState('dashboard')
  const [pendentes, setPendentes] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [denuncias, setDenuncias] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [stats, setStats] = useState({ totalUsuarios: 0, usuariosHoje: 0, totalPosts: 0, postsHoje: 0, postsPendentes: 0, totalDenuncias: 0, totalComentarios: 0 })
  const [graficoDias, setGraficoDias] = useState<{ label: string, valor: number }[]>([])
  const [config, setConfig] = useState({ moderar_posts: true, moderar_comentarios: false, moderar_anuncios: true })
  const [salvandoConfig, setSalvandoConfig] = useState(false)
  const [capaPreview, setCapaPreview] = useState<string | null>(null)
  const [uploadandoCapa, setUploadandoCapa] = useState(false)
  const [usuarioModal, setUsuarioModal] = useState<any>(null)
  const [mostrarComunicado, setMostrarComunicado] = useState(false)
  const capaRef = useRef<HTMLInputElement>(null)

  useEffect(() => { verificarAdmin(); carregarDados(); carregarConfig() }, [])

  useEffect(() => {
    if (busca.trim() === '') {
      setUsuariosFiltrados(usuarios)
    } else {
      setUsuariosFiltrados(usuarios.filter(u =>
        u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        u.cidade?.toLowerCase().includes(busca.toLowerCase()) ||
        u.profissao?.toLowerCase().includes(busca.toLowerCase())
      ))
    }
  }, [busca, usuarios])

  async function verificarAdmin() {
    const { data } = await supabase.auth.getUser()
    if (!data.user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role !== 'admin' && profile?.role !== 'moderador') router.push('/feed')
  }

  async function carregarConfig() {
    const { data } = await supabase.from('configuracoes').select('*').eq('id', 1).maybeSingle()
    if (data) {
      setConfig({ moderar_posts: data.moderar_posts, moderar_comentarios: data.moderar_comentarios, moderar_anuncios: data.moderar_anuncios })
      if (data.capa_url) setCapaPreview(data.capa_url)
    }
  }

  async function carregarDados() {
    setCarregando(true)
    const hoje = new Date(); hoje.setHours(0,0,0,0)
    const [postsPend, users, denunc, totPosts, totUsers, usersHoje, postsHoje, totDen, totCom] = await Promise.all([
      supabase.from('posts').select('*, profiles(nome, cidade, estado)').eq('status', 'pendente').order('criado_em', { ascending: false }),
      supabase.from('profiles').select('*').order('criado_em', { ascending: false }),
      supabase.from('denuncias').select('*, posts(conteudo), profiles(nome)').eq('status', 'pendente'),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('criado_em', hoje.toISOString()),
      supabase.from('posts').select('*', { count: 'exact', head: true }).gte('criado_em', hoje.toISOString()),
      supabase.from('denuncias').select('*', { count: 'exact', head: true }),
      supabase.from('comentarios').select('*', { count: 'exact', head: true }),
    ])
    setPendentes(postsPend.data || [])
    setUsuarios(users.data || [])
    setUsuariosFiltrados(users.data || [])
    setDenuncias(denunc.data || [])
    setStats({ totalUsuarios: totUsers.count || 0, usuariosHoje: usersHoje.count || 0, totalPosts: totPosts.count || 0, postsHoje: postsHoje.count || 0, postsPendentes: postsPend.data?.length || 0, totalDenuncias: totDen.count || 0, totalComentarios: totCom.count || 0 })
    const dias = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0)
      const prox = new Date(d); prox.setDate(prox.getDate() + 1)
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('criado_em', d.toISOString()).lt('criado_em', prox.toISOString())
      dias.push({ label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3), valor: count || 0 })
    }
    setGraficoDias(dias)
    setCarregando(false)
  }

  async function aprovar(id: string) {
    await supabase.from('posts').update({ status: 'aprovado' }).eq('id', id)
    setPendentes(p => p.filter(post => post.id !== id))
    setStats(s => ({ ...s, postsPendentes: s.postsPendentes - 1 }))
  }

  async function reprovar(id: string) {
    await supabase.from('posts').update({ status: 'reprovado' }).eq('id', id)
    setPendentes(p => p.filter(post => post.id !== id))
    setStats(s => ({ ...s, postsPendentes: s.postsPendentes - 1 }))
  }

  async function resolverDenuncia(id: string, acao: string) {
    await supabase.from('denuncias').update({ status: acao }).eq('id', id)
    setDenuncias(d => d.filter(den => den.id !== id))
  }

  async function toggleStatus(id: string, statusAtual: string) {
    const novoStatus = statusAtual === 'ativo' ? 'suspenso' : 'ativo'
    await supabase.from('profiles').update({ status: novoStatus }).eq('id', id)
    setUsuarios(u => u.map(usr => usr.id === id ? { ...usr, status: novoStatus } : usr))
  }

  async function salvarConfig() {
    setSalvandoConfig(true)
    await supabase.from('configuracoes').update({ ...config, atualizado_em: new Date().toISOString() }).eq('id', 1)
    setSalvandoConfig(false)
    alert('✅ Configurações salvas!')
  }

  async function uploadCapa(file: File) {
    setUploadandoCapa(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'bazar_absoluto')
    formData.append('folder', 'capas')
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
    const data = await res.json()
    if (data.secure_url) {
      await supabase.from('configuracoes').update({ capa_url: data.secure_url }).eq('id', 1)
      setCapaPreview(data.secure_url)
      alert('✅ Capa atualizada!')
    }
    setUploadandoCapa(false)
  }

  const ABAS = [
    { id: 'dashboard', label: '📊 Dashboard', badge: 0 },
    { id: 'pendentes', label: '⏳ Pendentes', badge: stats.postsPendentes },
    { id: 'usuarios', label: '👥 Usuários', badge: 0 },
    { id: 'denuncias', label: '🚨 Denúncias', badge: stats.totalDenuncias },
    { id: 'config', label: '⚙️ Config', badge: 0 },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />
      {usuarioModal && <ModalPerfil usuario={usuarioModal} onClose={() => setUsuarioModal(null)} />}
      {mostrarComunicado && <ModalComunicado usuarios={usuarios} onClose={() => setMostrarComunicado(false)} />}

      <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), #003DA5)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, background: 'var(--gold)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⚙️</div>
          <div>
            <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, fontFamily: 'Poppins' }}>Painel Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Bazar Absoluto USA</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[{ label: 'Usuários', valor: stats.totalUsuarios, icon: '👥' }, { label: 'Posts', valor: stats.totalPosts, icon: '📝' }, { label: 'Pendentes', valor: stats.postsPendentes, icon: '⏳' }].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{s.valor}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ flex: 1, padding: '12px 8px', fontSize: 11, fontWeight: 700, color: aba === a.id ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a.id ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Nunito', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {a.label}
            {a.badge > 0 && <span style={{ background: 'var(--red)', color: 'white', fontSize: 9, padding: '1px 6px', borderRadius: 10 }}>{a.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 12px 80px', maxWidth: 700, margin: '0 auto' }}>
        {carregando ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div><p>Carregando...</p>
          </div>
        ) : <>
          {/* Dashboard */}
          {aba === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <CardStat icon="👥" label="Total usuários" valor={stats.totalUsuarios} cor="#1877F2" sub={`+${stats.usuariosHoje} hoje`} />
                <CardStat icon="📝" label="Total posts" valor={stats.totalPosts} cor="var(--red)" sub={`+${stats.postsHoje} hoje`} />
                <CardStat icon="⏳" label="Pendentes" valor={stats.postsPendentes} cor="orange" sub="aguardando" />
                <CardStat icon="💬" label="Comentários" valor={stats.totalComentarios} cor="#2E7D32" sub="total" />
              </div>
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>📈 Novos membros — 7 dias</h3>
                <GraficoBarra dados={graficoDias} cor="var(--red)" />
              </div>
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🆕 Membros recentes</h3>
                {usuarios.slice(0, 5).map(usr => (
                  <div key={usr.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setUsuarioModal(usr)}>
                    {usr.foto_url
                      ? <img src={usr.foto_url} alt={usr.nome} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{usr.nome?.[0] || 'U'}</div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{usr.nome}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {usr.cidade}, {usr.estado}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(usr.criado_em).toLocaleDateString('pt-BR')}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setMostrarComunicado(true)} style={{ width: '100%', padding: '14px', background: 'var(--blue-dark)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                📢 Enviar comunicado para membros
              </button>
            </div>
          )}

          {/* Pendentes */}
          {aba === 'pendentes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendentes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>Nenhum post pendente!</p>
                </div>
              ) : pendentes.map(post => (
                <div key={post.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{post.profiles?.nome}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {post.profiles?.cidade} · {new Date(post.criado_em).toLocaleString('pt-BR')}</div>
                    </div>
                    <span style={{ background: 'rgba(255,165,0,0.15)', color: 'orange', fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>PENDENTE</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5, background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 8 }}>{post.conteudo}</p>
                  {post.imagem_url && <img src={post.imagem_url} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => reprovar(post.id)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '2px solid var(--red)', background: 'transparent', color: 'var(--red)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>✕ Reprovar</button>
                    <button onClick={() => aprovar(post.id)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#2E7D32', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>✓ Aprovar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Usuários */}
          {aba === 'usuarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Busca */}
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  placeholder="🔍 Buscar por nome, cidade ou profissão..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{usuariosFiltrados.length} membros encontrados</p>

              {usuariosFiltrados.map(usr => (
                <div key={usr.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }} onClick={() => setUsuarioModal(usr)}>
                    {usr.foto_url
                      ? <img src={usr.foto_url} alt={usr.nome} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                      : <div className="avatar" style={{ width: 50, height: 50, fontSize: 18 }}>{usr.nome?.[0] || 'U'}</div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{usr.nome}</span>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: usr.status === 'ativo' ? 'rgba(46,125,50,0.15)' : 'rgba(204,0,0,0.1)', color: usr.status === 'ativo' ? '#2E7D32' : 'var(--red)' }}>
                          {usr.status?.toUpperCase() || 'ATIVO'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {usr.cidade}, {usr.estado}</div>
                      {usr.profissao && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>💼 {usr.profissao}</div>}
                    </div>
                    <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>›</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={() => toggleStatus(usr.id, usr.status || 'ativo')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1.5px solid ${usr.status === 'ativo' ? 'var(--red)' : '#2E7D32'}`, background: 'transparent', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito', color: usr.status === 'ativo' ? 'var(--red)' : '#2E7D32' }}>
                      {usr.status === 'ativo' ? '🚫 Bloquear' : '✓ Reativar'}
                    </button>
                    <button onClick={() => { setMostrarComunicado(true) }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-input)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito', color: 'var(--text-secondary)' }}>
                      📢 Comunicado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Denúncias */}
          {aba === 'denuncias' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {denuncias.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🕊️</div>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>Nenhuma denúncia!</p>
                </div>
              ) : denuncias.map(d => (
                <div key={d.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>De: {d.profiles?.nome}</span>
                    <span style={{ background: 'rgba(204,0,0,0.1)', color: 'var(--red)', fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>PENDENTE</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700, marginBottom: 6 }}>⚠️ {d.motivo}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, background: 'var(--bg-input)', padding: '8px 12px', borderRadius: 8 }}>{d.posts?.conteudo}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => resolverDenuncia(d.id, 'ignorado')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>Ignorar</button>
                    <button onClick={() => resolverDenuncia(d.id, 'resolvido')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: 'var(--red)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>🗑️ Remover</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Config */}
          {aba === 'config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🖼️ Capa do Bazar</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Troque a capa/banner do app a qualquer momento</p>
                {capaPreview && <img src={capaPreview} alt="Capa" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />}
                <input ref={capaRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCapa(f) }} />
                <button onClick={() => capaRef.current?.click()} disabled={uploadandoCapa} className="btn-primary" style={{ fontSize: 13 }}>
                  {uploadandoCapa ? '⏳ Enviando...' : '📷 ' + (capaPreview ? 'Trocar capa' : 'Adicionar capa')}
                </button>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>⚙️ Moderação</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Controle o que precisa de aprovação</p>
                {[
                  { key: 'moderar_posts', label: 'Moderar posts', desc: 'Posts precisam de aprovação antes de aparecer', icon: '📝' },
                  { key: 'moderar_comentarios', label: 'Moderar comentários', desc: 'Comentários precisam de aprovação', icon: '💬' },
                  { key: 'moderar_anuncios', label: 'Moderar anúncios', desc: 'Empregos e serviços precisam de aprovação', icon: '📢' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 22 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <div onClick={() => setConfig(c => ({ ...c, [item.key]: !c[item.key as keyof typeof c] }))} style={{ width: 52, height: 28, borderRadius: 14, background: config[item.key as keyof typeof config] ? 'var(--red)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: config[item.key as keyof typeof config] ? 27 : 3, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                ))}
                <button onClick={salvarConfig} disabled={salvandoConfig} className="btn-primary" style={{ marginTop: 16, fontSize: 13 }}>
                  {salvandoConfig ? '⏳ Salvando...' : '💾 Salvar configurações'}
                </button>
              </div>

              <button onClick={() => setMostrarComunicado(true)} style={{ width: '100%', padding: '14px', background: 'var(--blue-dark)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>
                📢 Enviar comunicado para membros
              </button>
            </div>
          )}
        </>}
      </div>
    </div>
  )
}
