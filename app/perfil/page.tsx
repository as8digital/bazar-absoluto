'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const MEUS_POSTS = [
  { id: '1', conteudo: 'Acabei de tirar minha carteira americana! 🎉', curtidas: 87, comentarios: 23, criado_em: '2024-01-15' },
  { id: '2', conteudo: 'Alguém sabe de curso de inglês gratuito em Boston?', curtidas: 34, comentarios: 18, criado_em: '2024-01-10' },
]

export default function Perfil() {
  const router = useRouter()
  const [aba, setAba] = useState('posts')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nome: 'Você',
    bio: 'Brasileiro em Massachusetts 🇧🇷🇺🇸',
    cidade: 'Boston',
    estado: 'MA',
    profissao: 'Profissional',
  })

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      {/* Capa */}
      <div style={{ height: 140, background: 'linear-gradient(135deg, var(--blue-dark), var(--red))', position: 'relative' }}>
        <button style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 600 }}>
          📷 Trocar capa
        </button>
      </div>

      {/* Info do perfil */}
      <div style={{ background: 'var(--bg-card)', padding: '0 16px 16px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ marginTop: -36, position: 'relative' }}>
            <div className="avatar" style={{ width: 72, height: 72, fontSize: 26, border: '3px solid var(--bg-card)' }}>{form.nome[0]}</div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, background: 'var(--red)', border: 'none', borderRadius: '50%', color: 'white', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          <button onClick={() => setEditando(!editando)} style={{ background: editando ? 'var(--red)' : 'var(--bg-input)', color: editando ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>
            {editando ? '💾 Salvar' : '✏️ Editar'}
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
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{form.nome}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{form.bio}</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {form.cidade}, {form.estado}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💼 {form.profissao}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🌎 Brasil</span>
            </div>
          </>
        )}

        {/* Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
          {[{ label: 'Posts', valor: '12' }, { label: 'Seguidores', valor: '48' }, { label: 'Seguindo', valor: '31' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: 'var(--bg-input)', borderRadius: 10, padding: '10px 6px' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)' }}>{s.valor}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Abas do perfil */}
      <div style={{ background: 'var(--bg-card)', display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {['posts', 'empregos', 'servicos'].map(a => (
          <button key={a} onClick={() => setAba(a)} style={{ flex: 1, padding: '10px 4px', fontSize: 12, fontWeight: 700, color: aba === a ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: aba === a ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'Nunito' }}>
            {a === 'posts' ? 'Meus Posts' : a === 'empregos' ? 'Empregos' : 'Serviços'}
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      <div style={{ padding: '12px 12px 80px' }}>
        {aba === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MEUS_POSTS.map(post => (
              <div key={post.id} className="card" style={{ padding: 14 }}>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.5 }}>{post.conteudo}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>♥ {post.curtidas}</span>
                  <span>💬 {post.comentarios}</span>
                  <span>📅 {post.criado_em}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {aba === 'empregos' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhuma vaga publicada ainda</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Publique sua primeira vaga de emprego</p>
          </div>
        )}
        {aba === 'servicos' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum serviço anunciado ainda</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Anuncie seus serviços aqui</p>
          </div>
        )}
      </div>

      {/* Botão sair */}
      <div style={{ padding: '0 12px 90px' }}>
        <button onClick={sair} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>
          🚪 Sair da conta
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
