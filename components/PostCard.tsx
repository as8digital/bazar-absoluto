'use client'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
}

export default function PostCard({ post }: { post: Post }) {
  const [curtido, setCurtido] = useState(false)
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [mostrarComentarios, setMostrarComentarios] = useState(false)
  const [comentario, setComentario] = useState('')

  function curtir() {
    if (curtido) {
      setCurtidas(c => c - 1)
    } else {
      setCurtidas(c => c + 1)
    }
    setCurtido(!curtido)
  }

  const iniciais = post.autor_nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const tempo = formatDistanceToNow(new Date(post.criado_em), { addSuffix: true, locale: ptBR })

  return (
    <div className="card fade-in" style={{ overflow: 'hidden' }}>
      {post.patrocinado && <div className="sponsor-bar">⭐ ANUNCIO PATROCINADO</div>}
      
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{iniciais}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{post.autor_nome}</span>
            {post.autor_role === 'admin' && <span className="badge-admin">ADMIN</span>}
            {post.autor_role === 'moderador' && <span className="badge-gold">MOD</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.autor_cidade}, {post.autor_estado} · {tempo}</div>
        </div>
        <div style={{ fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>⋯</div>
      </div>

      {post.conteudo && (
        <div style={{ padding: '0 14px 12px', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{post.conteudo}</div>
      )}

      {post.imagem_url && (
        <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
      )}

      {post.video_url && (
        <video controls style={{ width: '100%', maxHeight: 300 }}>
          <source src={post.video_url} />
        </video>
      )}

      <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
          <div style={{ width: 18, height: 18, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>♥</div>
          {curtidas} curtidas
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setMostrarComentarios(!mostrarComentarios)}>
          {post.comentarios} comentários
        </div>
      </div>

      <div style={{ padding: '4px 8px', display: 'flex' }}>
        <button className={`post-action-btn ${curtido ? 'liked' : ''}`} onClick={curtir}>
          {curtido ? '♥' : '♡'} Curtir
        </button>
        <button className="post-action-btn" onClick={() => setMostrarComentarios(!mostrarComentarios)}>
          💬 Comentar
        </button>
        <button className="post-action-btn">
          ↗ Compartilhar
        </button>
      </div>

      {mostrarComentarios && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>V</div>
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              <input
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Escreva um comentário..."
                style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'Nunito' }}
              />
              <button style={{ background: 'var(--red)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>→</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
