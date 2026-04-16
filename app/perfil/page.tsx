'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Perfil() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [aba, setAba] = useState('posts')
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [totalMembros, setTotalMembros] = useState(0)
  const [meusPosts, setMeusPosts] = useState<any[]>([])
  const [form, setForm] = useState({ nome: '', bio: '', cidade: '', estado: '', profissao: '' })
  const fotoRef = useRef<HTMLInputElement>(null)
  const capaRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data } = await supabase.auth.getUser()
    if (!data.user) { router.push('/login'); return }
    setUsuario(data.user)

    const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
    if (p) {
      setPerfil(p)
      setForm({ nome: p.nome || '', bio: p.bio || '', cidade: p.cidade || '', estado: p.estado || '', profissao: p.profissao || '' })
    }

    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    setTotalMembros(count || 0)

    const { data: posts } = await supabase.from('posts').select('*').eq('autor_id', data.user.id).order('criado_em', { ascending: false })
    setMeusPosts(posts || [])
  }

  async function salvarPerfil() {
    if (!usuario) return
    setSalvando(true)
    await supabase.from('profiles').update(form).eq('id', usuario.id)
    setPerfil((p: any) => ({ ...p, ...form }))
    setEditando(false)
    setSalvando(false)
  }

  async function uploadFoto(file: File, tipo: 'perfil' | 'capa') {
    if (!usuario) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'bazar_absoluto')
    formData.append('folder', 'perfis')

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
    const data = await res.json()

    if (data.secure_url) {
      const campo = tipo === 'perfil' ? 'foto_url' : 'capa_url'
      await supabase.from('profiles').update({ [campo]: data.secure_url }).eq('id', usuario.id)
      setPerfil((p: any) => ({ ...p, [campo]: data.secure_url }))
    }
  }

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const iniciais = perfil?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'V'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {/* Capa */}
      <div style={{ height: 150, background: perfil?.capa_url ? `url(${perfil.capa_url}) center/cover` : 'linear-gradient(135deg, var(--blue-dark), var(--red))', position: 'relative', cursor: 'pointer' }} onClick={() => capaRef.current?.click()}>
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '4px 10px', color: 'white', fontSize: 11, fontWeight: 600 }}>
          📷 Trocar capa
        </div>
      </div>
      <input ref={capaRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadFoto(f, 'capa') }} />
      <input ref={fotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadFoto(f, 'perfil') }} />

      {/* Info do perfil */}
      <div style={{ background: 'var(--bg-card)', padding: '0 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ marginTop: -40, position: 'relative', cursor: 'pointer' }} onClick={() => fotoRef.current?.click()}>
            {perfil?.foto_url ? (
              <img src={perfil.foto_url} alt="Foto" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--bg-card)', objectFit: 'cover' }} />
            ) : (
              <div className="avatar" style={{ width: 80, height: 80, fontSize: 28, border: '3px solid var(--bg-card)' }}>{iniciais}</div>
            )}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, background: 'var(--red)', border: '2px solid var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📷</div>
          </div>
          <button onClick={() => editando ? salvarPerfil() : setEditando(true)} style={{ background: editando ? 'var(--red)' : 'var(--bg-input)', color: editando ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>
            {salvando ? '⏳' : editando ? '💾 Salvar' : '✏️ Editar'}
          </button>
        </div>

        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="input-field" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Seu nome" />
            <textarea className="input-field" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" rows={2} style={{ resize: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input className="input-field" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="Cidade" />
              <input className="input-field" value={form.profissao} onChange={e => setForm(f => ({ ...f, profissao: e.target.value }))} placeholder="Profissão" />
            </div>
            <button onClick={() => setEditando(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '8px', fontSize: 13, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'Nunito' }}>Cancelar</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{perfil?.nome}</h2>
              {perfil?.verificado && <span style={{ background: '#1877F2', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>✅ Verificado</span>}
              {perfil?.role === 'admin' && <span className="badge-admin">ADMIN</span>}
            </div>
            {perfil?.bio && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>{perfil.bio}</p>}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              {perfil?.cidade && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {perfil.cidade}, {perfil.estado}</span>}
              {perfil?.profissao && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💼 {perfil.profissao}</span>}
              {perfil?.pais_origem && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🌎 {perfil.pais_origem}</span>}
            </div>
          </>
        )}

        {/* Estatísticas — só posts e membros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ textAlign: 'center', background: 'var(--bg-input)', borderRadius: 10, padding: '10px 6px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--red)' }}>{meusPosts.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Meus posts</div>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--bg-input)', borderRadius: 10, padding: '10px 6px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue-mid)' }}>{totalMembros}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Membros</div>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div style={{ background: 'var(--bg-card)', display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {['posts', 'empregos', 'servicos'].map(a => (
          <button key={a} onClick={() => setAba(a)} style={{ flex: 1, padding: '10px 4px', fontSize: 12, fontWeight: 700, color: aba === a ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {a === 'posts' ? 'Meus Posts' : a === 'empregos' ? 'Empregos' : 'Serviços'}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 12px 80px' }}>
        {aba === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meusPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum post ainda!</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Compartilhe algo com a comunidade!</p>
              </div>
            ) : meusPosts.map(post => (
              <div key={post.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 700, background: post.status === 'aprovado' ? 'rgba(46,125,50,0.15)' : post.status === 'pendente' ? 'rgba(255,165,0,0.15)' : 'rgba(204,0,0,0.1)', color: post.status === 'aprovado' ? '#2E7D32' : post.status === 'pendente' ? 'orange' : 'var(--red)' }}>
                    {post.status === 'aprovado' ? '✓ Aprovado' : post.status === 'pendente' ? '⏳ Pendente' : '✕ Reprovado'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(post.criado_em).toLocaleDateString('pt-BR')}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{post.conteudo}</p>
                {post.imagem_url && <img src={post.imagem_url} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  <span>♥ {post.curtidas || 0}</span>
                  <span>💬 {post.comentarios || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === 'empregos' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhuma vaga publicada</p>
            <button onClick={() => router.push('/empregos')} className="btn-primary" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }}>Publicar vaga</button>
          </div>
        )}

        {aba === 'servicos' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum serviço anunciado</p>
            <button onClick={() => router.push('/servicos')} className="btn-primary" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }}>Anunciar serviço</button>
          </div>
        )}
      </div>

      <div style={{ padding: '0 12px 90px' }}>
        <button onClick={sair} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>
          🚪 Sair da conta
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
