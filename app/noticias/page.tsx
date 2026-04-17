'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import MenuAbas from '@/components/MenuAbas'
import { supabase } from '@/lib/supabase'

const CATEGORIAS = [
  { id: 'geral', label: '📰 Notícias', tipo: 'geral' },
  { id: 'imigracao', label: '📋 Imigração', tipo: 'imigracao' },
]

export default function Noticias() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [perfil, setPerfil] = useState<any>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [novaNoticia, setNovaNoticia] = useState({ titulo: '', descricao: '', url: '', imagem: '' })

  useEffect(() => { carregarPerfil() }, [])
  useEffect(() => { buscarNoticias() }, [categoria])

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
      const res = await fetch(`/api/noticias?tipo=${categoria.tipo}`)
      const data = await res.json()
      if (data.articles) {
        const formatadas = data.articles
          .filter((a: any) => a.title && a.description && a.title !== '[Removed]' && a.url)
          .map((a: any) => ({
            titulo: a.title?.replace(/ - .*$/, '').replace(/ \| .*$/, ''),
            descricao: a.description,
            url: a.url,
            imagem: a.urlToImage,
            fonte: a.source?.name || 'Notícia',
            publicado_em: a.publishedAt,
          }))
        setNoticias(formatadas)
        if (formatadas.length === 0) setErro('Nenhuma notícia encontrada para esta categoria.')
      }
    } catch (e) {
      setErro('Erro ao carregar notícias. Tente novamente.')
    }
    setCarregando(false)
  }

  async function publicarNoFeed(noticia: any) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    // Salva o link junto com o conteúdo de forma estruturada
    const conteudo = `📰 **${noticia.titulo}**\n\n${noticia.descricao}`
    await supabase.from('posts').insert({
      autor_id: user.user.id,
      conteudo,
      imagem_url: noticia.imagem || null,
      link_url: noticia.url || null,
      link_titulo: noticia.titulo,
      link_fonte: noticia.fonte,
      status: 'aprovado',
      curtidas: 0,
      comentarios: 0
    })
    alert('✅ Notícia publicada no feed!')
  }

  async function publicarManual() {
    if (!novaNoticia.titulo || !novaNoticia.descricao) return
    setPublicando(true)
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) { setPublicando(false); return }
    await supabase.from('posts').insert({
      autor_id: user.user.id,
      conteudo: `📰 **${novaNoticia.titulo}**\n\n${novaNoticia.descricao}`,
      imagem_url: novaNoticia.imagem || null,
      link_url: novaNoticia.url || null,
      link_titulo: novaNoticia.titulo,
      status: 'aprovado',
      curtidas: 0,
      comentarios: 0
    })
    alert('✅ Notícia publicada no feed!')
    setMostrarForm(false)
    setNovaNoticia({ titulo: '', descricao: '', url: '', imagem: '' })
    setPublicando(false)
  }

  const tempo = (data: string) => {
    const diff = Date.now() - new Date(data).getTime()
    const h = Math.floor(diff / 3600000)
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
        {CATEGORIAS.map(cat => (
          <button key={cat.id} onClick={() => setCategoria(cat)} style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 700, color: categoria.id === cat.id ? 'var(--red)' : 'var(--text-muted)', background: 'transparent', border: 'none', borderBottom: categoria.id === cat.id ? '3px solid var(--red)' : '3px solid transparent', cursor: 'pointer', fontFamily: 'Nunito' }}>
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 12px 80px' }}>
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
              <input className="input-field" placeholder="Título da notícia *" value={novaNoticia.titulo} onChange={e => setNovaNoticia(n => ({ ...n, titulo: e.target.value }))} />
              <textarea className="input-field" placeholder="Escreva a notícia aqui... *" value={novaNoticia.descricao} onChange={e => setNovaNoticia(n => ({ ...n, descricao: e.target.value }))} rows={4} style={{ resize: 'none' }} />
              <input className="input-field" placeholder="Link de referência (opcional)" value={novaNoticia.url} onChange={e => setNovaNoticia(n => ({ ...n, url: e.target.value }))} />
              <input className="input-field" placeholder="Link da imagem (opcional)" value={novaNoticia.imagem} onChange={e => setNovaNoticia(n => ({ ...n, imagem: e.target.value }))} />
              <div style={{ background: 'rgba(255,215,0,0.1)', borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 11, color: 'var(--gold-dark)' }}>⭐ Esta notícia aparecerá no feed com destaque como publicação oficial do Bazar Absoluto USA</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setMostrarForm(false)}>Cancelar</button>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={publicarManual} disabled={publicando}>{publicando ? '⏳' : '📤 Publicar agora'}</button>
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
            <p style={{ fontSize: 14, fontWeight: 600 }}>{erro}</p>
            <button onClick={buscarNoticias} className="btn-primary" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }}>🔄 Tentar novamente</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {noticias.map((noticia, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                {noticia.imagem && (
                  <img src={noticia.imagem} alt={noticia.titulo} style={{ width: '100%', height: 180, objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                )}
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, background: 'var(--blue-dark)', color: 'white', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{noticia.fonte}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🕐 {tempo(noticia.publicado_em)}</span>
                    {isAdmin && (
                      <button onClick={() => publicarNoFeed(noticia)} style={{ marginLeft: 'auto', background: 'rgba(204,0,0,0.1)', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}>
                        + Feed
                      </button>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>{noticia.titulo}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{noticia.descricao}</p>
                  <a href={noticia.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                    Ler notícia completa →
                  </a>
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
