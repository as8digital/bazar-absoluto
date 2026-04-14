'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const EMPREGOS = [
  { id: '1', titulo: 'Auxiliar de Limpeza', empresa: 'Boston Cleaning Services', cidade: 'Boston', estado: 'MA', salario: '$18/hora', tipo: 'Tempo integral', descricao: 'Procuramos auxiliar de limpeza para trabalhar em escritórios comerciais. Experiência prévia desejável mas não obrigatória.', requisitos: ['Inglês básico', 'Transporte próprio', 'Disponibilidade imediata'], destaque: true, urgente: false },
  { id: '2', titulo: 'Motorista de Entrega', empresa: 'Amazon Logistics', cidade: 'Cambridge', estado: 'MA', salario: '$22/hora', tipo: 'Tempo integral', descricao: 'Buscamos motoristas para entregas residenciais. Veículo fornecido pela empresa.', requisitos: ['CNH americana válida', 'Inglês básico', 'Smartphone'], destaque: true, urgente: true },
  { id: '3', titulo: 'Babá / Cuidadora', empresa: 'Família particular', cidade: 'Newton', estado: 'MA', salario: '$20/hora', tipo: 'Meio período', descricao: 'Família brasileira procura babá para 2 crianças pequenas, horário após escola.', requisitos: ['Experiência com crianças', 'Referências', 'Inglês não obrigatório'], destaque: false, urgente: false },
  { id: '4', titulo: 'Ajudante Geral na Construção', empresa: 'Silva Construction', cidade: 'Somerville', estado: 'MA', salario: '$19/hora', tipo: 'Tempo integral', descricao: 'Empresa brasileira contrata ajudante geral para obras residenciais.', requisitos: ['Disponibilidade imediata', 'Transporte'], destaque: false, urgente: true },
]

export default function Empregos() {
  const [busca, setBusca] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const empregosFiltrados = EMPREGOS.filter(e =>
    e.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    e.empresa.toLowerCase().includes(busca.toLowerCase()) ||
    e.cidade.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <TopBar />

      <div style={{ background: 'var(--blue-dark)', padding: '20px 16px' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>💼 Empregos</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 14 }}>Encontre oportunidades na sua região</p>
        <input className="input-field" placeholder="🔍 Buscar vagas, empresas, cidades..." value={busca} onChange={e => setBusca(e.target.value)} style={{ background: 'white', color: '#1A1A2E' }} />
      </div>

      <div style={{ padding: '12px 12px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{empregosFiltrados.length} vagas disponíveis</span>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 12 }} onClick={() => setMostrarFormulario(true)}>
            + Publicar vaga
          </button>
        </div>

        {mostrarFormulario && (
          <div className="card" style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>Publicar nova vaga</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input-field" placeholder="Título da vaga*" />
              <input className="input-field" placeholder="Empresa / Nome*" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="input-field" placeholder="Cidade*" />
                <input className="input-field" placeholder="Salário" />
              </div>
              <textarea className="input-field" placeholder="Descrição da vaga*" rows={3} style={{ resize: 'none' }} />
              <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid var(--gold)', borderRadius: 8, padding: '10px 12px' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>⭐ Destaque sua vaga por apenas $9.99 e apareça no topo!</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                <button className="btn-primary" style={{ fontSize: 13 }}>Publicar grátis</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {empregosFiltrados.map(emprego => (
            <div key={emprego.id} className="card fade-in" style={{ overflow: 'hidden' }}>
              {emprego.destaque && <div className="sponsor-bar">⭐ VAGA EM DESTAQUE</div>}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{emprego.titulo}</h3>
                    <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{emprego.empresa}</p>
                  </div>
                  {emprego.urgente && <span className="tag-red tag" style={{ flexShrink: 0 }}>URGENTE</span>}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>📍 {emprego.cidade}, {emprego.estado}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{emprego.descricao}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="tag tag-blue">{emprego.salario}</span>
                  <span className="tag">{emprego.tipo}</span>
                  {emprego.requisitos.slice(0, 2).map((r, i) => <span key={i} className="tag">{r}</span>)}
                </div>
                <button className="btn-primary" style={{ fontSize: 13, padding: '10px' }}>Ver detalhes e candidatar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
