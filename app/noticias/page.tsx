'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import MenuAbas from '@/components/MenuAbas'
import { supabase } from '@/lib/supabase'

export default function Noticias() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tipo, setTipo] = useState('geral')
  const [perfil, setPerfil] = useState<any>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [form, setForm] = useState({ titulo: '', descricao: '', url: '', imagem: '' })

  useEffect(() => { carregarPerfil() }, [])
  useEffect(() => { buscarNoticias() }, [tipo])

  async function carregarPerfil() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      setPerfil(p)
    }
  }

  async function buscarNoticias() {
    setCarregando(true)
    setErro('')
    setNoticias([])
    try {
      const res = await fetch(`/api/noticias?tipo=${tipo}&t=${Date.now()}`)
      const data = await res.json()
      if (data.articles?.length > 0) {
        setNoticias(data.articles.filter((a: any) => a.title && a.description && a.title !== '[Removed]').map((a: any) => ({
          titulo: a.title?.replace(/ [-|] .*$/, ''),
          descricao: a.description,
          url: a.url,
          imagem: a.urlToImage,
          fonte: a.source?.name || 'Notícia',
          publicado_em: a.publishedAt,
        })))
      } else {
        setErro('Nenhuma notícia encontrada. Tente atualizar.')
      }
    } catch {
      setErro('Erro ao carregar. Tente novamente.')
    }
    setCarregando(false)
  }

  async function publicarNoFeed(noticia: any) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    await supabase.from('posts').insert({
      autor_id: user.user.id,
      conteudo: `📰 ${noticia.titulo}\n\n${noticia.descricao}`,
      imagem_url: noticia.imagem || null,
      link_url: noticia.url,
      link_titulo: noticia.titulo,
      link_fonte: noticia.fonte,
      status: 'aprovado',
      curtidas: 0,
      comentarios: 0
    })
    alert('✅ Notícia publicada no feed!')
  }

  async function publicarManual() {
    if (!form.titulo || !form.descricao) return
    setPublicando(true)
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) { setPublicando(false); return }
    await supabase.from('posts').insert({
      autor_id: user.user.id,
      conteudo: `📰 ${form.titulo}\n\n${form.descricao}`,
      imagem_url: form.imagem || null,
      link_url: form.url || null,
      link_titulo: form.titulo,
      link_fonte: 'Bazar Absoluto USA',
      status: 'aprovado',
      curtidas: 0,
      comentarios: 0
    })
    alert('✅ Notícia publicada!')
    setMostrarForm(false)
    setForm({ titulo: '', descricao: '', url: '', imagem: '' })
    setPublicando(false)
  }

  const tempo = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
    if (h < 1) return 'agora'
    if (h < 24) return `há ${h}h`
    return `há ${Math.floor(h / 24)} dias`
  }

  const isAdmin = perfil?.role === 'admin' || perfil?.role === 'moderador'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />
      <MenuAbas />

      <div style={{ background: 'linear-gradient(135deg, var(--blue-dark), #003DA5)', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, fontFamily: 'Poppins' }}>📰 Notícias</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Atualizadas automaticamente</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={buscarNoticias} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>🔄</button>
            {isAdmin && <button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: 'var(--red)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito' }}>+ Publicar</button>}
          </div>
        </div>
      </div>

      {/* Apenas 2 categorias */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex' }}>
        {[
          { id: 'geral', label: '📰 Notícias' },
          { id: 'imigracao', label: '📋 Imigração' },
        ].map(cat => (
          <button key={cat.id} onClick={() => setTipo(cat.id)} style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 700, color: tipo === cat.id ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: tipo === cat.id ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 12px 80px' }}>
        {/* Form Ronaldo Absoluto Informa */}
        {mostrarForm && isAdmin && (
          <div className="card" style={{ padding: 16, marginBottom: 16, border: '2px solid var(--gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: 'var(--gold)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📣</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Ronaldo Absoluto Informa</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Publique uma notícia oficial da comunidade</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input-field" placeholder="Título *" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
              <textarea className="input-field" placeholder="Texto da notícia *" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={4} style={{ resize: 'none' }} />
              <input className="input-field" placeholder="Link da matéria (opcional)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
              <input className="input-field" placeholder="Link da imagem (opcional)" value={form.imagem} onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setMostrarForm(false)}>Cancelar</button>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={publicarManual} disabled={publicando}>{publicando ? '⏳' : '📤 Publicar'}</button>
              </div>
            </div>
          </div>
        )}

        {carregando ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>Buscando notícias...</p>
          </div>
        ) : erro ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <p style={{ fontSize: 14 }}>{erro}</p>
            <button onClick={buscarNoticias} className="btn-primary" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }}>🔄 Atualizar</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {noticias.map((n, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                {n.imagem && <img src={n.imagem} alt={n.titulo} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />}
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, background: 'var(--blue-dark)', color: 'white', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{n.fonte}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🕐 {tempo(n.publicado_em)}</span>
                    {isAdmin && (
                      <button onClick={() => publicarNoFeed(n)} style={{ marginLeft: 'auto', background: 'rgba(204,0,0,0.1)', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>+ Feed</button>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>{n.titulo}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{n.descricao}</p>
                  <a href={n.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Ler notícia completa →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
