'use client'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  IconHeart, IconHeartFill, IconComment, IconShare,
  IconMoreV, IconPin, IconStar, IconSend,
} from './Icons'

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

/**
 * PostCard refinado — sem emojis, com ícones SVG.
 * Mantém mesma API do seu PostCard atual.
 */
export default function PostCard({ post }: { post: Post }) {
  const [curtido, setCurtido] = useState(false)
  const [curtidas, setCurtidas] = useState(post.curtidas)
  const [mostrarComentarios, setMostrarComentarios] = useState(false)
  const [comentario, setComentario] = useState('')

  function curtir() {
    setCurtidas(c => c + (curtido ? -1 : 1))
    setCurtido(!curtido)
  }

  const iniciais = post.autor_nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const tempo = formatDistanceToNow(new Date(post.criado_em), { addSuffix: true, locale: ptBR })

  return (
    <div className="card fade-in" style={{ overflow: 'hidden', marginBottom: 12 }}>
      {post.patrocinado && (
        <div className="sponsor-bar" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconStar size={11} stroke={2.4} /> Anúncio patrocinado
        </div>
      )}

      {/* Cabeçalho */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{iniciais}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: -0.1 }}>
              {post.autor_nome}
            </span>
            {post.autor_role === 'admin' && <span className="badge-admin">ADMIN</span>}
            {post.autor_role === 'moderador' && <span className="badge-gold">MOD</span>}
          </div>
          <div style={{
            fontSize: 11.5, color: 'var(--text-muted)',
            fontWeight: 600, marginTop: 2,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <IconPin size={11} stroke={2} />
            {post.autor_cidade}, {post.autor_estado}
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{tempo}</span>
          </div>
        </div>
        <button style={{
          width: 32, height: 32, borderRadius: 10,
          border: 'none', background: 'transparent',
          cursor: 'pointer', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} aria-label="Mais">
          <IconMoreV size={18} />
        </button>
      </div>

      {/* Conteúdo */}
      {post.conteudo && (
        <div style={{
          padding: '0 16px 14px',
          fontSize: 14.5, color: 'var(--text-primary)',
          lineHeight: 1.55,
        }}>
          {post.conteudo}
        </div>
      )}

      {post.imagem_url && (
        <img src={post.imagem_url} alt="Post" style={{ width: '100%', maxHeight: 480, objectFit: 'cover' }} />
      )}

      {post.video_url && (
        <video controls style={{ width: '100%', maxHeight: 480, background: '#000' }}>
          <source src={post.video_url} />
        </video>
      )}

      {/* Contadores */}
      <div style={{
        padding: '8px 16px',
        display: 'flex', justifyContent: 'space-between',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <IconHeartFill size={11} />
          </div>
          {curtidas} curtidas
        </div>
        <button
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
          style={{
            fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito',
          }}
        >
          {post.comentarios} comentários
        </button>
      </div>

      {/* Ações */}
      <div style={{ padding: '4px 8px', display: 'flex' }}>
        <button className={`post-action-btn ${curtido ? 'liked' : ''}`} onClick={curtir}>
          {curtido ? <IconHeartFill size={18} /> : <IconHeart size={18} />}
          Curtir
        </button>
        <button className="post-action-btn" onClick={() => setMostrarComentarios(!mostrarComentarios)}>
          <IconComment size={18} />
          Comentar
        </button>
        <button className="post-action-btn">
          <IconShare size={18} />
          Compartilhar
        </button>
      </div>

      {/* Campo de comentário */}
      {mostrarComentarios && (
        <div style={{ padding: '12px 16px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>V</div>
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              <input
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Escreva um comentário..."
                style={{
                  flex: 1, background: 'var(--bg-input)',
                  border: '1px solid var(--border)', borderRadius: 20,
                  padding: '8px 14px', fontSize: 13,
                  color: 'var(--text-primary)', outline: 'none',
                  fontFamily: 'Nunito',
                }}
              />
              <button
                style={{
                  background: 'var(--red)', color: 'white',
                  border: 'none', borderRadius: '50%',
                  width: 36, height: 36, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-label="Enviar"
              >
                <IconSend size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
