'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import MenuAbas from '@/components/MenuAbas'
import { supabase } from '@/lib/supabase'

const CATEGORIAS = ['Todos', 'Limpeza', 'Construção', 'Beleza', 'Culinária', 'Transporte', 'Educação', 'Saúde', 'Outros']

const SERVICOS_DEMO = [
  { id: '1', nome_profissional: 'Carlos Limpeza', servico: 'Limpeza Residencial e Comercial', cidade: 'Boston', estado: 'MA', preco: 'A partir de $80', categoria: 'Limpeza', avaliacao: 4.9, total_avaliacoes: 47, descricao: 'Limpeza completa, pós-obra, escritórios. Materiais inclusos.', whatsapp: '17819228007', destaque: false },
  { id: '2', nome_profissional: 'Ana Marmitas', servico: 'Marmitas Fitness e Caseiras', cidade: 'Cambridge', estado: 'MA', preco: '$8 por marmita', categoria: 'Culinária', avaliacao: 5.0, total_avaliacoes: 83, descricao: 'Entrega segunda a sexta em toda região de Cambridge.', whatsapp: '17819228007', destaque: true },
  { id: '3', nome_profissional: 'Roberto Elétrica', servico: 'Eletricista Residencial', cidade: 'Somerville', estado: 'MA', preco: 'Orçamento grátis', categoria: 'Construção', avaliacao: 4.8, total_avaliacoes: 29, descricao: 'Instalações, reparos, quadro de distribuição.', whatsapp: '17819228007', destaque: false },
]

function Estrelas({ nota }: { nota: number }) {
  return (
    <span>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= nota ? '#FFD700' : 'var(--border)', fontSize: 13 }}>★</span>)}</span>
  )
}

export default function Servicos() {
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    nome_profissional: '', servico: '', categoria: 'Limpeza',
    cidade: '', estado: '', preco: '', descricao: '', whatsapp: ''
  })

  async function publicarServico() {
    if (!form.nome_profissional || !form.servico || !form.descricao) return
    setEnviando(true)
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) { setEnviando(false); return }
    
    const { error } = await supabase.from('servicos').insert({
      autor_id: user.user.id,
      ...form,
      status: 'pendente',
      avaliacao: 0,
      total_avaliacoes: 0,
      destaque: false
    })
    
    if (!error) {
      alert('✅ Serviço enviado para moderação! Aparecerá após aprovação.')
      setMostrarForm(false)
      setForm({ nome_profissional: '', servico: '', categoria: 'Limpeza', cidade: '', estado: '', preco: '', descricao: '', whatsapp: '' })
    }
    setEnviando(false)
  }

  const filtrados = SERVICOS_DEMO.filter(s =>
    (categoria === 'Todos' || s.categoria === categoria) &&
    (s.servico.toLowerCase().includes(busca.toLowerCase()) || s.nome_profissional.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />
      <MenuAbas />

      <div style={{ background: 'var(--red)', padding: '20px 16px' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🔧 Serviços</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 14 }}>Profissionais brasileiros perto de você</p>
        <input className="input-field" placeholder="🔍 Buscar serviços..." value={busca} onChange={e => setBusca(e.target.value)} style={{ background: 'white', color: '#1A1A2E' }} />
      </div>

      <div style={{ padding: '10px 16px', overflowX: 'auto', display: 'flex', gap: 8, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        {CATEGORIAS.map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: categoria === cat ? 'var(--red)' : 'var(--bg-input)', color: categoria === cat ? 'white' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Nunito' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 12px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{filtrados.length} profissionais</span>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }} onClick={() => setMostrarForm(true)}>
            + Anunciar serviço
          </button>
        </div>

        {/* Formulário anunciar serviço */}
        {mostrarForm && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>Anunciar meu serviço</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input-field" placeholder="Seu nome / nome do negócio *" value={form.nome_profissional} onChange={e => setForm(f => ({ ...f, nome_profissional: e.target.value }))} />
              <input className="input-field" placeholder="Tipo de serviço *" value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))} />
              <select className="input-field" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                {CATEGORIAS.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="input-field" placeholder="Cidade *" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} />
                <input className="input-field" placeholder="Preço / valor" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} />
              </div>
              <textarea className="input-field" placeholder="Descreva seu serviço *" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3} style={{ resize: 'none' }} />
              <input className="input-field" placeholder="WhatsApp para contato (ex: 17819228007)" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} type="tel" />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>⚠️ Anúncios passam por moderação antes de aparecer</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setMostrarForm(false)}>Cancelar</button>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={publicarServico} disabled={enviando}>
                  {enviando ? '⏳ Enviando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {filtrados.map(servico => (
          <div key={servico.id} className="card" style={{ overflow: 'hidden', marginBottom: 12 }}>
            {servico.destaque && <div className="sponsor-bar">⭐ PROFISSIONAL DESTAQUE</div>}
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>{servico.nome_profissional[0]}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{servico.nome_profissional}</h3>
                  <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600, marginBottom: 4 }}>{servico.servico}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Estrelas nota={Math.floor(servico.avaliacao)} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{servico.avaliacao} ({servico.total_avaliacoes})</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>📍 {servico.cidade}, {servico.estado}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{servico.descricao}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{servico.preco}</span>
                <a href={`tel:+${servico.whatsapp}`} style={{ flex: 2, padding: '10px', borderRadius: 8, background: 'var(--red)', color: 'white', fontSize: 13, fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                  📞 Entrar em contato
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
