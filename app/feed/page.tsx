'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import PostCard from '@/components/PostCard'

const POSTS_DEMO = [
  {
    id: '1',
    autor_nome: 'Ronaldo Absoluto',
    autor_cidade: 'Boston',
    autor_estado: 'MA',
    conteudo: 'Bem-vindos ao Bazar Absoluto USA! 🇺🇸 A maior comunidade brasileira de Massachusetts. Aqui você encontra empregos, serviços e muito mais. Compartilhe com seus amigos!',
    curtidas: 142,
    comentarios: 38,
    criado_em: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    patrocinado: true,
    autor_role: 'admin'
  },
  {
    id: '2',
    autor_nome: 'Maria Silva',
    autor_cidade: 'Cambridge',
    autor_estado: 'MA',
    conteudo: 'Alguém conhece um bom dentista que fala português em Boston? Preciso urgente! 😅',
    curtidas: 24,
    comentarios: 12,
    criado_em: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: '3',
    autor_nome: 'João Carlos',
    autor_cidade: 'Somerville',
    autor_estado: 'MA',
    conteudo: 'Acabei de tirar minha carteira de motorista americana! 🎉 Demorou mas consegui! Para quem precisar de dicas é só me chamar no WhatsApp.',
    curtidas: 87,
    comentarios: 23,
    criado_em: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: '4',
    autor_nome: 'Ana Beatriz',
    autor_cidade: 'Framingham',
    autor_estado: 'MA',
    conteudo: 'Marmita fitness disponível para entrega em Framingham e região! 🥗 Preços acessíveis, comida caseira e saudável. Me chama no WhatsApp para cardápio da semana!',
    curtidas: 56,
    comentarios: 19,
    criado_em: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    patrocinado: true,
  },
]

const STORIES = ['RA', 'MS', 'JC', 'AB', 'PL', 'KS']

export default function Feed() {
  const [mostrarCriarPost, setMostrarCriarPost] = useState(false)
  const [novoPost, setNovoPost] = useState('')
  const [aba, setAba] = useState('feed')

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {/* Stories */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: 12, overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 58 }}>
          <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'var(--bg-input)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer' }} onClick={() => setMostrarCriarPost(true)}>+</div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Seu post</span>
        </div>
        {STORIES.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 58 }}>
            <div className="story-ring">
              <div className="story-inner">{s}</div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Membro</span>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex' }}>
        {['feed', 'empregos', 'servicos', 'noticias'].map(a => (
          <button key={a} onClick={() => setAba(a)} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: aba === a ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'Nunito' }}>
            {a === 'feed' ? 'Feed' : a === 'empregos' ? 'Empregos' : a === 'servicos' ? 'Serviços' : 'Notícias'}
          </button>
        ))}
      </div>

      {/* Criar post */}
      {mostrarCriarPost && (
        <div style={{ background: 'var(--bg-card)', margin: '12px', borderRadius: 12, border: '1px solid var(--border)', padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>V</div>
            <textarea value={novoPost} onChange={e => setNovoPost(e.target.value)} placeholder="O que você está pensando?" style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: 'var(--text-primary)', resize: 'none', fontFamily: 'Nunito', outline: 'none' }} rows={3} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 12, fontWeight: 700, color: '#1877F2', cursor: 'pointer', fontFamily: 'Nunito' }}>📷 Foto</button>
            <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', fontSize: 12, fontWeight: 700, color: 'var(--red)', cursor: 'pointer', fontFamily: 'Nunito' }}>🎥 Vídeo</button>
            <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 12 }}>Publicar</button>
          </div>
        </div>
      )}

      {!mostrarCriarPost && (
        <div style={{ background: 'var(--bg-card)', margin: '12px', borderRadius: 12, border: '1px solid var(--border)', padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }} onClick={() => setMostrarCriarPost(true)}>
          <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>V</div>
          <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 20, padding: '8px 14px', fontSize: 13, color: 'var(--text-muted)' }}>O que você está pensando?</div>
        </div>
      )}

      {/* Feed de posts */}
      <div className="feed-container" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 12px 12px' }}>
        {POSTS_DEMO.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
