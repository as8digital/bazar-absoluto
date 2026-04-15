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
  curtidas: number
  comentarios: number
  criado_em: string
  patrocinado?: boolean
  autor_role?: string
  status: string
}

function PostCard({ post }: { post: Post }) {
  const [curtido, setCurtido] = useState(false)
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [mostrarComentario, setMostrarComentario] = useState(false)
  const [comentario, setComentario] = useState('')
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

  return (
    <div className="card" style={{ overflow: 'hidden', marginBottom: 10 }}>
      {post.patrocinado && <div className="sponsor-bar">⭐ ANÚNCIO PATROCINADO</div>}
      {post.status === 'pendente' && (
        <div style={{ background: 'rgba(255,165,0,0.1)', borderLeft: '3px solid orange', padding: '6px 12px', fontSize: 11, color: 'orange', fontWeight: 700 }}>
          ⏳ Aguardando aprovação do moderador
        </div>
      )}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{iniciais}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{post.autor_nome}</span>
            {post.autor_role === 'admin' && <span className="badge-admin">ADMIN</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.autor_cidade}, {post.autor_estado} · {tempo()}</div>
        </div>
      </div>
      {post.conteudo && <div style={{ padding: '0 14px 12px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{post.conteudo}</div>}
      {post.imagem_url && <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 350, objectFit: 'cover' }} />}
      <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <div style={{ width: 18, height: 18, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>♥</div>
          {curtidas} curtidas
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setMostrarComentario(!mostrarComentario)}>
          {post.comentarios} comentários
        </div>
      </div>
      <div style={{ padding: '4px 8px', display: 'flex' }}>
        <button className={`post-action-btn ${curtido ? 'liked' : ''}`} onClick={() => { setCurtido(!curtido); setCurtidas(c => curtido ? c-1 : c+1) }}>{curtido ? '♥' : '♡'} Curtir</button>
        <button className="post-action-btn" onClick={() => setMostrarComentario(!mostrarComentario)}>💬 Comentar</button>
        <button className="post-action-btn">↗ Compartilhar</button>
      </div>
      {mostrarComentario && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>V</div>
            <input value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Escreva um comentário..." style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'Nunito' }} />
            <button style={{ background: 'var(--red)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>→</button>
          </div>
        </div>
      )}
    </div>
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
  const [aba, setAba] = useState('feed')
  const [usuario, setUsuario] = useState<any>(null)
  const [mostrarBemVindo, setMostrarBemVindo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    carregarUsuario()
    carregarPosts()
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
        curtidas: p.curtidas || 0,
        comentarios: p.comentarios || 0,
        criado_em: p.criado_em,
        patrocinado: p.patrocinado,
        autor_role: p.profiles?.role,
        status: p.status
      })))
    }
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
        alert('✅ Post enviado! Aparecerá no feed após aprovação do moderador.')
        carregarPosts()
      }
    } catch { alert('Erro ao publicar. Tente novamente.') }
    setPublicando(false)
  }

  const iniciais = usuario?.user_metadata?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'V'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {mostrarBemVindo && (
        <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), var(--red))', padding: '16px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Bem-vindo ao Bazar Absoluto USA!</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>Sua conta foi criada! Explore e conecte-se com a comunidade!</p>
          <button onClick={() => setMostrarBemVindo(false)} style={{ marginTop: 10, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontFamily: 'Nunito' }}>
            Fechar ✕
          </button>
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex' }}>
        {['feed', 'empregos', 'servicos', 'noticias'].map(a => (
          <button key={a} onClick={() => { setAba(a); if (a !== 'feed') router.push(`/${a}`) }} style={{ flex: 1, padding: '10px 4px', fontSize: 12, fontWeight: 700, color: aba === a ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {a === 'feed' ? 'Feed' : a === 'empregos' ? 'Empregos' : a === 'servicos' ? 'Serviços' : 'Notícias'}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', margin: '12px', borderRadius: 12, border: '1px solid var(--border)', padding: 14 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div className="avatar" style={{ width: 38, height: 38, fontSize: 14, flexShrink: 0 }}>{iniciais}</div>
          <textarea value={novoPost} onChange={e => setNovoPost(e.target.value)} placeholder="O que você está pensando? Compartilhe com a comunidade!" style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--text-primary)', resize: 'none', fontFamily: 'Nunito', outline: 'none' }} rows={3} />
        </div>
        {imagemPreview && (
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <img src={imagemPreview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
            <button onClick={() => { setImagemPreview(null); setImagemFile(null) }} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => {
          const file = e.target.files?.[0]
          if (file) { setImagemFile(file); const r = new FileReader(); r.onload = () => setImagemPreview(r.result as string); r.readAsDataURL(file) }
        }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 12, fontWeight: 700, color: '#1877F2', cursor: 'pointer', fontFamily: 'Nunito' }}>📷 Foto</button>
          <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 12, fontWeight: 700, color: 'var(--red)', cursor: 'pointer', fontFamily: 'Nunito' }}>🎥 Vídeo</button>
          <button onClick={publicarPost} disabled={publicando || (!novoPost.trim() && !imagemFile)} className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 12, opacity: (!novoPost.trim() && !imagemFile) ? 0.5 : 1 }}>
            {publicando ? '⏳' : '📤 Publicar'}
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>⚠️ Posts passam por moderação antes de aparecer</p>
      </div>

      <div style={{ padding: '0 12px 80px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📰</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum post aprovado ainda!</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Seja o primeiro a postar algo!</p>
          </div>
        ) : posts.map(post => <PostCard key={post.id} post={post} />)}
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
