'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  autor_id: string
  autor_nome: string
  autor_cidade: string
  autor_estado: string
  autor_foto?: string
  conteudo: string
  imagem_url?: string
  curtidas: number
  comentarios: number
  criado_em: string
  patrocinado?: boolean
  autor_role?: string
  status: string
}

function ModalDenuncia({ postId, onClose }: { postId: string, onClose: () => void }) {
  const [motivo, setMotivo] = useState('')
  const [enviado, setEnviado] = useState(false)

  async function enviarDenuncia() {
    const { data } = await supabase.auth.getUser()
    if (!data.user || !motivo) return
    await supabase.from('denuncias').insert({ post_id: postId, denunciante_id: data.user.id, motivo, status: 'pendente' })
    setEnviado(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: 20 }}>
        {enviado ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>Denúncia enviada!</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🚨 Denunciar post</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Conteúdo ofensivo', 'Spam ou propaganda', 'Informação falsa', 'Assédio ou bullying', 'Conteúdo inapropriado', 'Outro motivo'].map(m => (
                <button key={m} onClick={() => setMotivo(m)} style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${motivo === m ? 'var(--red)' : 'var(--border)'}`, background: motivo === m ? 'rgba(204,0,0,0.08)' : 'var(--bg-input)', color: motivo === m ? 'var(--red)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'Nunito' }}>
                  {motivo === m ? '✓ ' : ''}{m}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancelar</button>
              <button onClick={enviarDenuncia} disabled={!motivo} className="btn-primary" style={{ fontSize: 13, opacity: !motivo ? 0.5 : 1 }}>Enviar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Avatar({ foto, nome, size = 44 }: { foto?: string, nome: string, size?: number }) {
  const iniciais = nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  if (foto) {
    return <img src={foto} alt={nome} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  }
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.35, flexShrink: 0 }}>{iniciais}</div>
  )
}

function PostCard({ post, usuarioId }: { post: Post, usuarioId: string }) {
  const [curtido, setCurtido] = useState(false)
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [mostrarComentario, setMostrarComentario] = useState(false)
  const [comentario, setComentario] = useState('')
  const [comentarios, setComentarios] = useState<any[]>([])
  const [totalComentarios, setTotalComentarios] = useState(post.comentarios)
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [mostrarDenuncia, setMostrarDenuncia] = useState(false)

  useEffect(() => {
    if (usuarioId) verificarCurtida()
  }, [usuarioId])

  async function verificarCurtida() {
    const { data } = await supabase.from('curtidas').select('id').eq('post_id', post.id).eq('usuario_id', usuarioId).single()
    if (data) setCurtido(true)
  }

  async function curtir() {
    if (!usuarioId) return
    if (curtido) {
      await supabase.from('curtidas').delete().eq('post_id', post.id).eq('usuario_id', usuarioId)
      await supabase.from('posts').update({ curtidas: curtidas - 1 }).eq('id', post.id)
      setCurtidas(c => c - 1)
      setCurtido(false)
    } else {
      await supabase.from('curtidas').insert({ post_id: post.id, usuario_id: usuarioId })
      await supabase.from('posts').update({ curtidas: curtidas + 1 }).eq('id', post.id)
      setCurtidas(c => c + 1)
      setCurtido(true)
    }
  }

  async function carregarComentarios() {
    const { data } = await supabase
      .from('comentarios')
      .select('*, profiles(nome, foto_url)')
      .eq('post_id', post.id)
      .order('criado_em', { ascending: true })
    if (data) setComentarios(data)
  }

  async function enviarComentario() {
    if (!comentario.trim() || !usuarioId) return
    const { error } = await supabase.from('comentarios').insert({ post_id: post.id, autor_id: usuarioId, conteudo: comentario })
    if (!error) {
      await supabase.from('posts').update({ comentarios: totalComentarios + 1 }).eq('id', post.id)
      setTotalComentarios(c => c + 1)
      setComentario('')
      carregarComentarios()
    }
  }

  function abrirComentarios() {
    setMostrarComentario(!mostrarComentario)
    if (!mostrarComentario) carregarComentarios()
  }

  const tempo = () => {
    const diff = Date.now() - new Date(post.criado_em).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'agora'
    if (min < 60) return `há ${min} min`
    const h = Math.floor(min / 60)
    if (h < 24) return `há ${h}h`
    return `há ${Math.floor(h / 24)} dias`
  }

  return (
    <>
      {mostrarDenuncia && <ModalDenuncia postId={post.id} onClose={() => setMostrarDenuncia(false)} />}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 12 }}>
        {post.patrocinado && <div className="sponsor-bar">⭐ ANÚNCIO PATROCINADO</div>}

        <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar foto={post.autor_foto} nome={post.autor_nome} size={46} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{post.autor_nome}</span>
              {post.autor_role === 'admin' && <span className="badge-admin">ADMIN</span>}
              {post.autor_role === 'moderador' && <span className="badge-gold">MOD</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {post.autor_cidade}, {post.autor_estado} · {tempo()}</div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMostrarMenu(!mostrarMenu)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}>⋯</button>
            {mostrarMenu && (
              <div style={{ position: 'absolute', right: 0, top: 36, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, zIndex: 100, minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                <button onClick={() => { setMostrarDenuncia(true); setMostrarMenu(false) }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', borderRadius: 6, fontFamily: 'Nunito' }}>🚨 Denunciar</button>
              </div>
            )}
          </div>
        </div>

        {post.conteudo && <div style={{ padding: '0 14px 12px', fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6 }}>{post.conteudo}</div>}
        {post.imagem_url && <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block' }} />}

        <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
            <div style={{ width: 20, height: 20, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white' }}>♥</div>
            {curtidas}
          </div>
          <button onClick={abrirComentarios} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {totalComentarios} comentários
          </button>
        </div>

        <div style={{ padding: '4px 8px', display: 'flex' }}>
          <button className={`post-action-btn ${curtido ? 'liked' : ''}`} onClick={curtir}>{curtido ? '♥' : '♡'} Curtir</button>
          <button className="post-action-btn" onClick={abrirComentarios}>💬 Comentar</button>
          <button className="post-action-btn">↗ Compartilhar</button>
        </div>

        {mostrarComentario && (
          <div style={{ padding: '8px 14px 14px', borderTop: '1px solid var(--border)' }}>
            {comentarios.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <Avatar foto={c.profiles?.foto_url} nome={c.profiles?.nome || 'U'} size={32} />
                <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 12, padding: '8px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{c.profiles?.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.conteudo}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>V</div>
              <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                <input value={comentario} onChange={e => setComentario(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviarComentario()} placeholder="Escreva um comentário..." style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'Nunito' }} />
                <button onClick={enviarComentario} style={{ background: 'var(--red)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>→</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function FeedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemVindo = searchParams?.get('bemvindo') === '1'
  const [posts, setPosts] = useState<Post[]>([])
  const [novoPost, setNovoPost] = useState('')
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [membros, setMembros] = useState<any[]>([])
  const [mostrarBemVindo, setMostrarBemVindo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    carregarTudo()
    if (bemVindo) setMostrarBemVindo(true)
  }, [])

  async function carregarTudo() {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { router.push('/login'); return }
    setUsuario(auth.user)

    const { data: p } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single()
    setPerfil(p)

    await carregarPosts()
    await carregarMembros()
  }

  async function carregarPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(nome, cidade, estado, role, foto_url)')
      .eq('status', 'aprovado')
      .order('criado_em', { ascending: false })

    if (data) {
      setPosts(data.map((p: any) => ({
        id: p.id,
        autor_id: p.autor_id,
        autor_nome: p.profiles?.nome || 'Usuário',
        autor_cidade: p.profiles?.cidade || '',
        autor_estado: p.profiles?.estado || '',
        autor_foto: p.profiles?.foto_url,
        conteudo: p.conteudo,
        imagem_url: p.imagem_url,
        curtidas: p.curtidas || 0,
        comentarios: p.comentarios || 0,
        criado_em: p.criado_em,
        patrocinado: p.patrocinado,
        autor_role: p.profiles?.role,
        status: p.status
      })))
    }
  }

  async function carregarMembros() {
    const { data } = await supabase.from('profiles').select('id, nome, foto_url').order('criado_em', { ascending: false }).limit(10)
    setMembros(data || [])
  }

  async function publicarPost() {
    if (!novoPost.trim() && !imagemFile) return
    if (!usuario || !perfil) return
    setPublicando(true)

    try {
      let imagemUrl = null
      if (imagemFile) {
        const formData = new FormData()
        formData.append('file', imagemFile)
        formData.append('upload_preset', 'bazar_absoluto')
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
        const data = await res.json()
        imagemUrl = data.secure_url
      }

      // Admin e moderador postam direto sem precisar de aprovação
      const isAdmin = perfil?.role === 'admin' || perfil?.role === 'moderador'
      const status = isAdmin ? 'aprovado' : 'pendente'

      const { error } = await supabase.from('posts').insert({
        autor_id: usuario.id, conteudo: novoPost, imagem_url: imagemUrl,
        status, curtidas: 0, comentarios: 0
      })

      if (!error) {
        setNovoPost(''); setImagemPreview(null); setImagemFile(null)
        if (isAdmin) {
          await carregarPosts()
        } else {
          alert('✅ Post enviado! Aparecerá após aprovação do moderador.')
        }
      }
    } catch { alert('Erro ao publicar.') }
    setPublicando(false)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {mostrarBemVindo && (
        <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), var(--red))', padding: '16px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🎉</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Bem-vindo ao Bazar Absoluto USA!</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>Você faz parte da nossa comunidade!</p>
          <button onClick={() => setMostrarBemVindo(false)} style={{ marginTop: 10, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontFamily: 'Nunito' }}>Fechar ✕</button>
        </div>
      )}

      {/* Banner estilo grupo Facebook com fotos dos membros */}
      <div style={{ background: 'linear-gradient(135deg, var(--blue-dark) 0%, #003DA5 50%, var(--red) 100%)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 52, height: 52, background: 'var(--red)', borderRadius: 14, border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'Poppins', flexShrink: 0 }}>B</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'Poppins' }}>Bazar Absoluto USA</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>🔒 Grupo privado · {membros.length} membros recentes</div>
          </div>
        </div>

        {/* Fotos dos membros estilo Facebook */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            {membros.slice(0, 8).map((m, i) => (
              <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 10 - i }}>
                {m.foto_url ? (
                  <img src={m.foto_url} alt={m.nome} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                    {m.nome?.[0] || 'U'}
                  </div>
                )}
              </div>
            ))}
          </div>
          {membros.length > 8 && (
            <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>+{membros.length - 8} membros</span>
          )}
        </div>
      </div>

      {/* Abas */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', overflowX: 'auto', padding: '0 8px' }}>
        {[
          { id: 'feed', label: 'Discussão' },
          { id: 'empregos', label: 'Empregos' },
          { id: 'servicos', label: 'Serviços' },
          { id: 'noticias', label: 'Notícias' },
        ].map(a => (
          <button key={a.id} onClick={() => { if (a.id !== 'feed') router.push(`/${a.id}`) }} style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: a.id === 'feed' ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: a.id === 'feed' ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Nunito' }}>
            {a.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 12px 80px' }}>
        {/* Criar post */}
        <div className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <Avatar foto={perfil?.foto_url} nome={perfil?.nome || 'V'} size={42} />
            <textarea value={novoPost} onChange={e => setNovoPost(e.target.value)} placeholder="Compartilhe algo com a comunidade..." style={{ flex: 1, background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '10px 16px', fontSize: 14, color: 'var(--text-primary)', resize: 'none', fontFamily: 'Nunito', outline: 'none', lineHeight: 1.5 }} rows={2} />
          </div>
          {imagemPreview && (
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <img src={imagemPreview} alt="Preview" style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 10 }} />
              <button onClick={() => { setImagemPreview(null); setImagemFile(null) }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
          )}
          <div className="divider" style={{ marginBottom: 10 }} />
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0]
            if (file) { setImagemFile(file); const r = new FileReader(); r.onload = () => setImagemPreview(r.result as string); r.readAsDataURL(file) }
          }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 13, fontWeight: 700, color: '#1877F2', cursor: 'pointer', fontFamily: 'Nunito' }}>📷 Foto/Vídeo</button>
            <button onClick={publicarPost} disabled={publicando || (!novoPost.trim() && !imagemFile)} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13, opacity: (!novoPost.trim() && !imagemFile) ? 0.5 : 1 }}>
              {publicando ? '⏳' : perfil?.role === 'admin' || perfil?.role === 'moderador' ? '📤 Publicar' : '📤 Enviar'}
            </button>
          </div>
          {perfil?.role !== 'admin' && perfil?.role !== 'moderador' && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>⚠️ Posts passam por moderação antes de aparecer</p>
          )}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📰</div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nenhum post ainda!</p>
            <p style={{ fontSize: 14 }}>Seja o primeiro a postar algo!</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} usuarioId={usuario?.id || ''} />)
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default function Feed() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Carregando...</div>}>
      <FeedContent />
    </Suspense>
  )
}
