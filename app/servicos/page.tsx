'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const CATEGORIAS = ['Todos', 'Limpeza', 'Construção', 'Beleza', 'Culinária', 'Transporte', 'Educação', 'Saúde', 'Outros']

const SERVICOS = [
  { id: '1', nome: 'Carlos Limpeza', servico: 'Limpeza Residencial e Comercial', cidade: 'Boston', estado: 'MA', preco: 'A partir de $80', categoria: 'Limpeza', avaliacao: 4.9, avaliacoes: 47, descricao: 'Limpeza completa, pós-obra, escritórios. Materiais inclusos.', whatsapp: '15551234567' },
  { id: '2', nome: 'Ana Marmitas', servico: 'Marmitas Fitness e Caseiras', cidade: 'Cambridge', estado: 'MA', preco: '$8 por marmita', categoria: 'Culinária', avaliacao: 5.0, avaliacoes: 83, descricao: 'Entrega segunda a sexta em toda região de Cambridge. Comida saudável e saborosa!', whatsapp: '15557654321', destaque: true },
  { id: '3', nome: 'Roberto Elétrica', servico: 'Eletricista Residencial', cidade: 'Somerville', estado: 'MA', preco: 'Orçamento grátis', categoria: 'Construção', avaliacao: 4.8, avaliacoes: 29, descricao: 'Instalações, reparos, quadro de distribuição. Mais de 10 anos de experiência.', whatsapp: '15559876543' },
  { id: '4', nome: 'Patricia Hair', servico: 'Cabeleireira e Manicure', cidade: 'Framingham', estado: 'MA', preco: 'A partir de $35', categoria: 'Beleza', avaliacao: 4.9, avaliacoes: 61, descricao: 'Atendo em domicílio ou no meu salão em casa. Especialista em cabelos afro e lisos.', whatsapp: '15553456789', destaque: true },
]

function Estrelas({ nota }: { nota: number }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= nota ? '#FFD700' : 'var(--border)', fontSize: 12 }}>★</span>
      ))}
    </div>
  )
}

export default function Servicos() {
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')

  const filtrados = SERVICOS.filter(s =>
    (categoria === 'Todos' || s.categoria === categoria) &&
    (s.servico.toLowerCase().includes(busca.toLowerCase()) || s.nome.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      <div style={{ background: 'var(--red)', padding: '20px 16px' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🔧 Serviços</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 14 }}>Profissionais brasileiros perto de você</p>
        <input className="input-field" placeholder="🔍 Buscar serviços..." value={busca} onChange={e => setBusca(e.target.value)} style={{ background: 'white', color: '#1A1A2E' }} />
      </div>

      <div style={{ padding: '12px 16px', overflowX: 'auto', display: 'flex', gap: 8, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        {CATEGORIAS.map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: categoria === cat ? 'var(--red)' : 'var(--bg-input)', color: categoria === cat ? 'white' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Nunito' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 12px 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{filtrados.length} profissionais</span>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 12 }}>+ Anunciar serviço</button>
        </div>

        {filtrados.map(servico => (
          <div key={servico.id} className="card fade-in" style={{ overflow: 'hidden' }}>
            {servico.destaque && <div className="sponsor-bar">⭐ PROFISSIONAL DESTAQUE</div>}
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div className="avatar" style={{ width: 52, height: 52, fontSize: 18 }}>{servico.nome[0]}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{servico.nome}</h3>
                  <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600, marginBottom: 4 }}>{servico.servico}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Estrelas nota={Math.floor(servico.avaliacao)} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{servico.avaliacao} ({servico.avaliacoes})</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>📍 {servico.cidade}, {servico.estado}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{servico.descricao}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{servico.preco}</span>
                <button className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: 13 }}>💬 Chamar no WhatsApp</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
