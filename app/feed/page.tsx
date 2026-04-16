'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'

function Avatar({ foto, nome, size = 44 }: { foto?: string, nome: string, size?: number }) {
  const iniciais = nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  if (foto) return <img src={foto} alt={nome} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--border)' }} />
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.35, flexShrink: 0 }}>{iniciais}</div>
}

function ModalDenuncia({ postId, onClose }: { postId: string, onClose: () => void }) {
  const [motivo, setMotivo] = useState('')
  const [enviado, setEnviado] = useState(false)
  async function enviar() {
    const { data } = await supabase.auth.getUser()
    if (!data.user || !motivo) return
    await supabase.from('denuncias').insert({ post_id: postId, denunciante_id: data.user.id, motivo, status: 'pendente' })
    setEnviado(true)
    setTimeout(onClose, 2000)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 360, padding: 20 }}>
        {enviado ? <div style={{ textAlign: 'center', padding: 20 }}><div style={{ fontSize: 48 }}>✅</div><p style={{ fontWeight: 700, marginTop: 8 }}>Denúncia enviada!</p></div> : <>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🚨 Denunciar post</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Conteúdo ofensivo', 'Spam', 'Informação falsa', 'Assédio', 'Conteúdo inapropriado', 'Outro'].map(m => (
              <button key={m} onClick={() => setMotivo(m)} style={{ padding: '10px', borderRadius: 8, border: `2px solid ${motivo === m ? 'var(--red)' : 'var(--border)'}`, background: motivo === m ? 'rgba(204,0,0,0.08)' : 'var(--bg-input)', color: motivo === m ? 'var(--red)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'Nunito' }}>{motivo === m ? '✓ ' : ''}{m}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancelar</button>
            <button onClick={enviar} disabled={!motivo} className="btn-primary" style={{ fontSize: 13, opacity: !motivo ? 0.5 : 1 }}>Enviar</button>
          </div>
        </>}
      </div>
    </div>
  )
}

function PostCard({ post, usuarioId }: { post: any, usuarioId: string }) {
  const [curtido, setCurtido] = useState(false)
  const [curtidas, setCurtidas] = useState(post.curtidas || 0)
  const [mostrarComentario, setMostrarComentario] = useState(false)
  const [comentario, setComentario] = useState('')
  const [comentarios, setComentarios] = useState<any[]>([])
  const [totalComentarios, setTotalComentarios] = useState(post.comentarios || 0)
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [mostrarDenuncia, setMostrarDenuncia] = useState(false)

  useEffect(() => { if (usuarioId) verificarCurtida() }, [usuarioId])

  async function verificarCurtida() {
    const { data } = await supabase.from('curtidas').select('id').eq('post_id', post.id).eq('usuario_id', usuarioId).maybeSingle()
    if (data) setCurtido(true)
  }

  async function curtir() {
    if (!usuarioId) return
    if (curtido) {
      await supabase.from('curtidas').delete().eq('post_id', post.id).eq('usuario_id', usuarioId)
      await supabase.from('posts').update({ curtidas: Math.max(0, curtidas - 1) }).eq('id', post.id)
      setCurtidas((c: number) => Math.max(0, c - 1))
      setCurtido(false)
    } else {
      await supabase.from('curtidas').insert({ post_id: post.id, usuario_id: usuarioId })
      await supabase.from('posts').update({ curtidas: curtidas + 1 }).eq('id', post.id)
      setCurtidas((c: number) => c + 1)
      setCurtido(true)
    }
  }

  async function carregarComentarios() {
    const { data } = await supabase.from('comentarios').select('*, profiles(nome, foto_url)').eq('post_id', post.id).order('criado_em', { ascending: true })
    if (data) setComentarios(data)
  }

  async function enviarComentario() {
    if (!comentario.trim() || !usuarioId) return
    const { error } = await supabase.from('comentarios').insert({ post_id: post.id, autor_id: usuarioId, conteudo: comentario })
    if (!error) {
      await supabase.from('posts').update({ comentarios: totalComentarios + 1 }).eq('id', post.id)
      setTotalComentarios((c: number) => c + 1)
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
    if (min < 60) return `há ${min}min`
    const h = Math.floor(min / 60)
    if (h < 24) return `há ${h}h`
    return `há ${Math.floor(h / 24)}d`
  }

  return (
    <>
      {mostrarDenuncia && <ModalDenuncia postId={post.id} onClose={() => setMostrarDenuncia(false)} />}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 12 }}>
        {post.patrocinado && <div className="sponsor-bar">⭐ ANÚNCIO PATROCINADO</div>}
        <div style={{ padding: '12px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar foto={post.autor_foto} nome={post.autor_nome} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{post.autor_nome}</span>
              {post.autor_role === 'admin' && <span className="badge-admin">ADMIN</span>}
              {post.autor_role === 'moderador' && <span className="badge-gold">MOD</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {post.autor_cidade}, {post.autor_estado} · {tempo()}</div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMostrarMenu(!mostrarMenu)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>⋯</button>
            {mostrarMenu && (
              <div style={{ position: 'absolute', right: 0, top: 36, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, zIndex: 100, minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                <button onClick={() => { setMostrarDenuncia(true); setMostrarMenu(false) }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'Nunito' }}>🚨 Denunciar</button>
                <button onClick={() => setMostrarMenu(false)} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'Nunito' }}>🔗 Copiar link</button>
              </div>
            )}
          </div>
        </div>
        {post.conteudo && <div style={{ padding: '0 14px 12px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{post.conteudo}</div>}
        {post.imagem_url && <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block' }} />}
        {post.video_url && (
          <video
            controls
            preload="metadata"
            style={{ width: '100%', maxHeight: 400, background: '#000', display: 'block' }}
            onLoadedMetadata={e => {
              const v = e.currentTarget
              v.currentTime = 1
            }}
          >
            <source src={post.video_url} />
          </video>
        )}
        <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
            <div style={{ width: 20, height: 20, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white' }}>♥</div>
            {curtidas}
          </div>
          <button onClick={abrirComentarios} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito' }}>{totalComentarios} comentários</button>
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
              <input value={comentario} onChange={e => setComentario(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviarComentario()} placeholder="Escreva um comentário..." style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'Nunito' }} />
              <button onClick={enviarComentario} style={{ background: 'var(--red)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>→</button>
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
  const [posts, setPosts] = useState<any[]>([])
  const [novoPost, setNovoPost] = useState('')
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [publicando, setPublicando] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [membros, setMembros] = useState<any[]>([])
  const [capaBazar, setCapaBazar] = useState<string | null>(null)
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
    await Promise.all([carregarPosts(), carregarMembros(), carregarCapa()])
  }

  async function carregarPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(nome, cidade, estado, role, foto_url)')
      .eq('status', 'aprovado')
      .order('criado_em', { ascending: false })
    if (data) {
      setPosts(data.map((p: any) => ({
        id: p.id, autor_id: p.autor_id,
        autor_nome: p.profiles?.nome || 'Usuário',
        autor_cidade: p.profiles?.cidade || '',
        autor_estado: p.profiles?.estado || '',
        autor_foto: p.profiles?.foto_url,
        conteudo: p.conteudo, imagem_url: p.imagem_url, video_url: p.video_url,
        curtidas: p.curtidas || 0, comentarios: p.comentarios || 0,
        criado_em: p.criado_em, patrocinado: p.patrocinado,
        autor_role: p.profiles?.role, status: p.status
      })))
    }
  }

  async function carregarMembros() {
    const { data } = await supabase.from('profiles').select('id, nome, foto_url').order('criado_em', { ascending: false }).limit(12)
    setMembros(data || [])
  }

  async function carregarCapa() {
    const { data } = await supabase.from('configuracoes').select('capa_url').eq('id', 1).maybeSingle()
    if (data?.capa_url) setCapaBazar(data.capa_url)
  }

  async function publicarPost() {
    if (!novoPost.trim() && !mediaFile) return
    if (!usuario || !perfil) return
    setPublicando(true)
    try {
      let imagemUrl = null
      let videoUrl = null

      if (mediaFile) {
        const formData = new FormData()
        formData.append('file', mediaFile)
        formData.append('upload_preset', 'bazar_absoluto')
        const resourceType = mediaType === 'video' ? 'video' : 'image'
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()
        if (mediaType === 'video') videoUrl = data.secure_url
        else imagemUrl = data.secure_url
      }

      const isAdmin = perfil?.role === 'admin' || perfil?.role === 'moderador'
      const { error } = await supabase.from('posts').insert({
        autor_id: usuario.id, conteudo: novoPost,
        imagem_url: imagemUrl, video_url: videoUrl,
        status: isAdmin ? 'aprovado' : 'pendente',
        curtidas: 0, comentarios: 0
      })
      if (!error) {
        setNovoPost(''); setMediaPreview(null); setMediaFile(null)
        if (isAdmin) await carregarPosts()
        else alert('✅ Post enviado para moderação!')
      }
    } catch { alert('Erro ao publicar. Tente novamente.') }
    setPublicando(false)
  }

  const isAdmin = perfil?.role === 'admin' || perfil?.role === 'moderador'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {mostrarBemVindo && (
        <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), var(--red))', padding: 16, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🎉</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Bem-vindo ao Bazar Absoluto USA!</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>Você faz parte da nossa comunidade!</p>
          <button onClick={() => setMostrarBemVindo(false)} style={{ marginTop: 10, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontFamily: 'Nunito' }}>Fechar ✕</button>
        </div>
      )}

      {/* Banner/Capa do Bazar */}
      {capaBazar ? (
        <div style={{ width: '100%', maxHeight: 200, overflow: 'hidden' }}>
          <img src={capaBazar} alt="Bazar Absoluto" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg, var(--blue-dark) 0%, #003DA5 40%, var(--red) 100%)', padding: '20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, background: 'var(--red)', borderRadius: 16, border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Poppins', flexShrink: 0 }}>B</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'Poppins' }}>Bazar Absoluto USA</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>🔒 Grupo privado · Massachusetts, EUA</div>
            </div>
          </div>
          {/* Fotos dos membros */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex' }}>
              {membros.slice(0, 8).map((m, i) => (
                <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }}>
                  {m.foto_url
                    ? <img src={m.foto_url} alt={m.nome} style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', objectFit: 'cover' }} />
                    : <div style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>{m.nome?.[0] || 'U'}</div>
                  }
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>{membros.length} membros</span>
          </div>
        </div>
      )}

      {/* Abas */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', position: 'sticky', top: 56, zIndex: 99 }}>
        {[
          { label: 'Feed', rota: '/feed' },
          { label: 'Empregos', rota: '/empregos' },
          { label: 'Serviços', rota: '/servicos' },
          { label: 'Notícias', rota: '/noticias' },
        ].map(a => (
          <button key={a.rota} onClick={() => router.push(a.rota)} style={{ flex: 1, padding: '11px 4px', fontSize: 13, fontWeight: 700, color: a.rota === '/feed' ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: a.rota === '/feed' ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {a.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 12px 80px' }}>
        {/* Criar post */}
        <div className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <Avatar foto={perfil?.foto_url} nome={perfil?.nome || 'V'} size={40} />
            <textarea value={novoPost} onChange={e => setNovoPost(e.target.value)} placeholder="Compartilhe algo com a comunidade..." style={{ flex: 1, background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '10px 14px', fontSize: 14, color: 'var(--text-primary)', resize: 'none', fontFamily: 'Nunito', outline: 'none', lineHeight: 1.5 }} rows={2} />
          </div>
          {mediaPreview && (
            <div style={{ position: 'relative', marginBottom: 10 }}>
              {mediaType === 'video'
                ? <video src={mediaPreview} controls style={{ width: '100%', maxHeight: 200, borderRadius: 10 }} />
                : <img src={mediaPreview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }} />
              }
              <button onClick={() => { setMediaPreview(null); setMediaFile(null) }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
          )}
          <div className="divider" style={{ marginBottom: 10 }} />
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0]
            if (file) {
              setMediaFile(file)
              setMediaType(file.type.startsWith('video') ? 'video' : 'image')
              const r = new FileReader(); r.onload = () => setMediaPreview(r.result as string); r.readAsDataURL(file)
            }
          }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 13, fontWeight: 700, color: '#1877F2', cursor: 'pointer', fontFamily: 'Nunito' }}>📷 Foto/Vídeo</button>
            <button onClick={publicarPost} disabled={publicando || (!novoPost.trim() && !mediaFile)} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13, opacity: (!novoPost.trim() && !mediaFile) ? 0.5 : 1 }}>
              {publicando ? '⏳ Enviando...' : isAdmin ? '📤 Publicar' : '📤 Enviar'}
            </button>
          </div>
          {!isAdmin && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>⚠️ Posts passam por moderação antes de aparecer</p>}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📰</div>
            <p style={{ fontSize: 16, fontWeight: 700 }}>Nenhum post ainda!</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Seja o primeiro a postar algo!</p>
          </div>
        ) : posts.map(post => <PostCard key={post.id} post={post} usuarioId={usuario?.id || ''} />)}
      </div>
      <BottomNav />
    </div>
  )
}

export default function Feed() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-muted)', fontSize: 14 }}>Carregando...</div>}>
      <FeedContent />
    </Suspense>
  )
}
