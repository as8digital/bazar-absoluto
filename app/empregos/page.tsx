'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import MenuAbas from '@/components/MenuAbas'
import { supabase } from '@/lib/supabase'

const EMPREGOS_DEMO = [
  { id: '1', titulo: 'Auxiliar de Limpeza', empresa: 'Boston Cleaning Services', cidade: 'Boston', estado: 'MA', salario: '$18/hora', tipo: 'Tempo integral', descricao: 'Procuramos auxiliar de limpeza para trabalhar em escritórios comerciais.', requisitos: ['Inglês básico', 'Transporte próprio', 'Disponibilidade imediata'], destaque: true, urgente: false, whatsapp: '17819228007' },
  { id: '2', titulo: 'Motorista de Entrega', empresa: 'Amazon Logistics', cidade: 'Cambridge', estado: 'MA', salario: '$22/hora', tipo: 'Tempo integral', descricao: 'Buscamos motoristas para entregas residenciais. Veículo fornecido.', requisitos: ['CNH americana válida', 'Inglês básico'], destaque: true, urgente: true, whatsapp: '17819228007' },
  { id: '3', titulo: 'Babá / Cuidadora', empresa: 'Família particular', cidade: 'Newton', estado: 'MA', salario: '$20/hora', tipo: 'Meio período', descricao: 'Família brasileira procura babá para 2 crianças.', requisitos: ['Experiência com crianças', 'Referências'], destaque: false, urgente: false, whatsapp: '17819228007' },
]

export default function Empregos() {
  const [busca, setBusca] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [vagaSelecionada, setVagaSelecionada] = useState<any>(null)
  const [form, setForm] = useState({
    titulo: '', empresa: '', cidade: '', salario: '',
    tipo: 'Tempo integral', descricao: '', whatsapp: ''
  })

  async function publicarVaga() {
    if (!form.titulo || !form.empresa || !form.descricao) return
    setEnviando(true)
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) { setEnviando(false); return }

    const { error } = await supabase.from('empregos').insert({
      autor_id: user.user.id,
      ...form,
      status: 'pendente',
      destaque: false,
      urgente: false
    })

    if (!error) {
      alert('✅ Vaga enviada para moderação! Aparecerá após aprovação.')
      setMostrarForm(false)
      setForm({ titulo: '', empresa: '', cidade: '', salario: '', tipo: 'Tempo integral', descricao: '', whatsapp: '' })
    }
    setEnviando(false)
  }

  const filtrados = EMPREGOS_DEMO.filter(e =>
    e.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    e.empresa.toLowerCase().includes(busca.toLowerCase()) ||
    e.cidade.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />
      <MenuAbas />

      <div style={{ background: 'var(--blue-dark)', padding: '20px 16px' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>💼 Empregos</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 14 }}>Encontre oportunidades na sua região</p>
        <input className="input-field" placeholder="🔍 Buscar vagas, empresas, cidades..." value={busca} onChange={e => setBusca(e.target.value)} style={{ background: 'white', color: '#1A1A2E' }} />
      </div>

      <div style={{ padding: '12px 12px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{filtrados.length} vagas disponíveis</span>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }} onClick={() => setMostrarForm(!mostrarForm)}>
            + Publicar vaga
          </button>
        </div>

        {/* Formulário publicar vaga */}
        {mostrarForm && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>Publicar nova vaga</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input-field" placeholder="Título da vaga *" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
              <input className="input-field" placeholder="Empresa / Nome *" value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="input-field" placeholder="Cidade *" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} />
                <input className="input-field" placeholder="Salário" value={form.salario} onChange={e => setForm(f => ({ ...f, salario: e.target.value }))} />
              </div>
              <select className="input-field" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option>Tempo integral</option>
                <option>Meio período</option>
                <option>Freelance</option>
                <option>Temporário</option>
              </select>
              <textarea className="input-field" placeholder="Descrição da vaga *" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3} style={{ resize: 'none' }} />
              <input className="input-field" placeholder="WhatsApp para contato (ex: 17819228007)" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} type="tel" />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>⚠️ Vagas passam por moderação antes de aparecer</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setMostrarForm(false)}>Cancelar</button>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={publicarVaga} disabled={enviando}>
                  {enviando ? '⏳ Enviando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detalhe da vaga */}
        {vagaSelecionada && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '20px 20px 0 0', padding: 20, width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{vagaSelecionada.titulo}</h3>
                <button onClick={() => setVagaSelecionada(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>
              <p style={{ fontSize: 15, color: 'var(--red)', fontWeight: 600, marginBottom: 6 }}>{vagaSelecionada.empresa}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>📍 {vagaSelecionada.cidade}, {vagaSelecionada.estado} · {vagaSelecionada.tipo}</p>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 16 }}>{vagaSelecionada.descricao}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {vagaSelecionada.requisitos?.map((r: string, i: number) => <span key={i} className="tag">{r}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`tel:+${vagaSelecionada.whatsapp}`} style={{ flex: 1, padding: '12px', borderRadius: 8, background: 'var(--red)', color: 'white', fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                  📞 Entrar em contato
                </a>
                <a href={`https://wa.me/${vagaSelecionada.whatsapp}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '12px', borderRadius: 8, background: '#25D366', color: 'white', fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Lista de vagas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtrados.map(emprego => (
            <div key={emprego.id} className="card fade-in" style={{ overflow: 'hidden' }}>
              {emprego.destaque && <div className="sponsor-bar">⭐ VAGA EM DESTAQUE</div>}
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{emprego.titulo}</h3>
                    <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{emprego.empresa}</p>
                  </div>
                  {emprego.urgente && <span className="tag-red tag" style={{ flexShrink: 0 }}>URGENTE</span>}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>📍 {emprego.cidade}, {emprego.estado} · {emprego.tipo}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{emprego.descricao}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="tag tag-blue">{emprego.salario}</span>
                  {emprego.requisitos.slice(0, 2).map((r, i) => <span key={i} className="tag">{r}</span>)}
                </div>
                <button className="btn-primary" style={{ fontSize: 13, padding: '10px' }} onClick={() => setVagaSelecionada(emprego)}>
                  Ver detalhes e candidatar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
