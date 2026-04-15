'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  autor_nome: string
  autor_cidade: string
  autor_estado: string
  conteudo: string
  imagem_url?: string
  video_url?: string
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
    await supabase.from('denuncias').insert({
      post_id: postId,
      denunciante_id: data.user.id,
      motivo,
      status: 'pendente'
    })
    setEnviado(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: 20 }}>
        {enviado ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Denúncia enviada!</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Nossa equipe vai analisar em breve.</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>🚨 Denunciar post</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Conteúdo ofensivo', 'Spam ou propaganda', 'Informação falsa', 'Assédio ou bullying', 'Conteúdo inapropriado', 'Outro motivo'].map(m => (
                <button key={m} onClick={() => setMotivo(m)} style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${motivo === m ? 'var(--red)' : 'var(--border)'}`, background: motivo === m ? 'rgba(204,0,0,0.08)' : 'var(--bg-input)', color: motivo === m ? 'var(--red)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'Nunito' }}>
                  {motivo === m ? '✓ ' : ''}{m}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={onClose} className="btn-secondary" style={{ fontSize: 13 }}>Cancelar</button>
              <button onClick={enviarDenuncia} disabled={!motivo} className="btn-primary" style={{ fontSize: 13, opacity: !motivo ? 0.5 : 1 }}>Enviar denúncia</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function PostCard({ post, usuarioId }: { post: Post, usuarioId: string }) {
  const [curtido, setCurtido] = useState(false)
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [mostrarComentario, setMostrarComentario] = useState(false)
  const [comentario, setComentario] = useState('')
  const [comentarios, setComentarios] = useState<any[]>([])
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [mostrarDenuncia, setMostrarDenuncia] = useState(false)
  const iniciais = post.autor_nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const tempo = () => {
    const diff = Date.now() - new Date(post.criado_em).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'agora'
    if (min < 60) return `há ${min} min`
    const h = Math.floor(min / 60)
    if (h < 24) return `há ${h}h`
    return `há ${Math.floor(h / 24)} dias`
  }

  async function carregarComentarios() {
    const { data } = await supabase
      .from('comentarios')
      .select('*, profiles(nome)')
      .eq('post_id', post.id)
      .order('criado_em', { ascending: true })
    if (data) setComentarios(data)
  }

  async function enviarComentario() {
    if (!comentario.trim() || !usuarioId) return
    await supabase.from('comentarios').insert({
      post_id: post.id,
      autor_id: usuarioId,
      conteudo: comentario
    })
    setComentario('')
    carregarComentarios()
  }

  function abrirComentarios() {
    setMostrarComentario(!mostrarComentario)
    if (!mostrarComentario) carregarComentarios()
  }

  return (
    <>
      {mostrarDenuncia && <ModalDenuncia postId={post.id} onClose={() => setMostrarDenuncia(false)} />}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 12 }}>
        {post.patrocinado && <div className="sponsor-bar">⭐ ANÚNCIO PATROCINADO</div>}

        {/* Header do post */}
        <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 46, height: 46, fontSize: 16, flexShrink: 0 }}>{iniciais}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{post.autor_nome}</span>
              {post.autor_role === 'admin' && <span className="badge-admin">ADMIN</span>}
              {post.autor_role === 'moderador' && <span className="badge-gold">MOD</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {post.autor_cidade}, {post.autor_estado} · {tempo()}</div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMostrarMenu(!mostrarMenu)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⋯</button>
            {mostrarMenu && (
              <div style={{ position: 'absolute', right: 0, top: 36, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, zIndex: 100, minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                <button onClick={() => { setMostrarDenuncia(true); setMostrarMenu(false) }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', borderRadius: 6, fontFamily: 'Nunito' }}>
                  🚨 Denunciar post
                </button>
                <button onClick={() => setMostrarMenu(false)} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', borderRadius: 6, fontFamily: 'Nunito' }}>
                  🔗 Copiar link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        {post.conteudo && (
          <div style={{ padding: '0 14px 12px', fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6 }}>{post.conteudo}</div>
        )}

        {/* Imagem grande */}
        {post.imagem_url && (
          <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block' }} />
        )}

        {/* Vídeo */}
        {post.video_url && (
          <video controls style={{ width: '100%', maxHeight: 400, background: '#000' }}>
            <source src={post.video_url} />
          </video>
        )}

        {/* Stats */}
        <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
            <div style={{ width: 20, height: 20, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white' }}>♥</div>
            {curtidas}
          </div>
          <button onClick={abrirComentarios} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {post.comentarios} comentários
          </button>
        </div>

        {/* Divisor */}
        <div className="divider" />

        {/* Ações */}
        <div style={{ padding: '4px 8px', display: 'flex' }}>
          <button className={`post-action-btn ${curtido ? 'liked' : ''}`} onClick={() => { setCurtido(!curtido); setCurtidas(c => curtido ? c-1 : c+1) }}>
            {curtido ? '♥' : '♡'} Curtir
          </button>
          <button className="post-action-btn" onClick={abrirComentarios}>
            💬 Comentar
          </button>
          <button className="post-action-btn">
            ↗ Compartilhar
          </button>
        </div>

        {/* Comentários */}
        {mostrarComentario && (
          <div style={{ padding: '8px 14px 14px', borderTop: '1px solid var(--border)' }}>
            {comentarios.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 11, flexShrink: 0 }}>
                  {c.profiles?.nome?.[0] || 'U'}
                </div>
                <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 12, padding: '8px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{c.profiles?.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.conteudo}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>V</div>
              <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                <input
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && enviarComentario()}
                  placeholder="Escreva um comentário..."
                  style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'Nunito' }}
                />
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
  const [mostrarBemVindo, setMostrarBemVindo] = useState(false)
  const [membros, setMembros] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    carregarUsuario()
    carregarPosts()
    carregarMembros()
    if (bemVindo) setMostrarBemVindo(true)
  }, [])

  async function carregarUsuario() {
    const { data } = await supabase.auth.getUser()
    if (data.user) setUsuario(data.user)
    else router.push('/login')
  }

  async function carregarPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(nome, cidade, estado, role)')
      .eq('status', 'aprovado')
      .order('criado_em', { ascending: false })
    if (data) {
      setPosts(data.map((p: any) => ({
        id: p.id,
        autor_nome: p.profiles?.nome || 'Usuário',
        autor_cidade: p.profiles?.cidade || '',
        autor_estado: p.profiles?.estado || '',
        conteudo: p.conteudo,
        imagem_url: p.imagem_url,
        video_url: p.video_url,
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
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    setMembros(count || 0)
  }

  async function publicarPost() {
    if (!novoPost.trim() && !imagemFile) return
    if (!usuario) return
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
      const { error } = await supabase.from('posts').insert({
        autor_id: usuario.id, conteudo: novoPost, imagem_url: imagemUrl,
        status: 'pendente', curtidas: 0, comentarios: 0
      })
      if (!error) {
        setNovoPost(''); setImagemPreview(null); setImagemFile(null)
        alert('✅ Post enviado! Aparecerá após aprovação do moderador.')
        carregarPosts()
      }
    } catch { alert('Erro ao publicar.') }
    setPublicando(false)
  }

  const iniciais = usuario?.user_metadata?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'V'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {mostrarBemVindo && (
        <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), var(--red))', padding: '16px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🎉</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Bem-vindo ao Bazar Absoluto USA!</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>Você faz parte da nossa comunidade! Explore e conecte-se!</p>
          <button onClick={() => setMostrarBemVindo(false)} style={{ marginTop: 10, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontFamily: 'Nunito' }}>Fechar ✕</button>
        </div>
      )}

      {/* Banner da comunidade */}
      <div style={{ background: 'linear-gradient(135deg, var(--blue-dark) 0%, #003DA5 50%, var(--red) 100%)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 52, height: 52, background: 'var(--red)', borderRadius: 14, border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'Poppins', flexShrink: 0 }}>B</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'Poppins' }}>Bazar Absoluto USA</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>🔒 Grupo privado · {membros} membros · Massachusetts, EUA</div>
        </div>
      </div>

      {/* Abas estilo Facebook */}
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
            <div className="avatar" style={{ width: 42, height: 42, fontSize: 15, flexShrink: 0 }}>{iniciais}</div>
            <textarea
              value={novoPost}
              onChange={e => setNovoPost(e.target.value)}
              placeholder="Compartilhe algo com a comunidade..."
              style={{ flex: 1, background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '10px 16px', fontSize: 14, color: 'var(--text-primary)', resize: 'none', fontFamily: 'Nunito', outline: 'none', lineHeight: 1.5 }}
              rows={2}
            />
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
            <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 13, fontWeight: 700, color: '#1877F2', cursor: 'pointer', fontFamily: 'Nunito', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>📷 Foto/Vídeo</button>
            <button onClick={publicarPost} disabled={publicando || (!novoPost.trim() && !imagemFile)} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13, opacity: (!novoPost.trim() && !imagemFile) ? 0.5 : 1 }}>
              {publicando ? '⏳ Enviando...' : '📤 Publicar'}
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            ⚠️ Posts passam por moderação antes de aparecer
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📰</div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Nenhum post ainda!</p>
            <p style={{ fontSize: 14 }}>Seja o primeiro a postar algo na comunidade!</p>
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
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>Carregando...</div>}>
      <FeedContent />
    </Suspense>
  )
}
