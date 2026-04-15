'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ESTADOS_EUA = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const PAISES = [
  { code: '+1', flag: '🇺🇸', nome: 'Estados Unidos' },
  { code: '+55', flag: '🇧🇷', nome: 'Brasil' },
]

export default function Cadastro() {
  const router = useRouter()
  const [passo, setPasso] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [paisTel, setPaisTel] = useState(PAISES[0])
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '',
    telefone: '', cidade: '', estado: 'Massachusetts',
    paisOrigem: 'Brasil', profissao: '', bio: ''
  })

  function atualizar(campo: string, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem!'); return }
    if (form.senha.length < 6) { setErro('A senha precisa ter pelo menos 6 caracteres!'); return }
    setCarregando(true)
    setErro('')
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome: form.nome,
            telefone: `${paisTel.code} ${form.telefone}`,
            cidade: form.cidade,
            estado: form.estado,
            pais_origem: form.paisOrigem,
            profissao: form.profissao,
            bio: form.bio,
            role: 'user'
          }
        }
      })
      if (error) {
        if (error.message.includes('already registered')) {
          setErro('Este email já está cadastrado.')
        } else {
          setErro('Erro ao cadastrar. Tente novamente.')
        }
      } else {
        router.push('/feed?bemvindo=1')
      }
    } catch (err) {
      setErro('Erro ao cadastrar. Tente novamente.')
    }
    setCarregando(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: 60, height: 60, background: 'var(--red)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Poppins' }}>B</div>
        <div className="logo-text" style={{ fontSize: 20 }}>BAZAR <span>ABSOLUTO</span></div>
        <div className="logo-sub">USA COMMUNITY</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[1,2].map(n => (
          <div key={n} style={{ width: n === passo ? 32 : 12, height: 6, borderRadius: 3, background: n <= passo ? 'var(--red)' : 'var(--border)', transition: 'all 0.3s' }} />
        ))}
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          {passo === 1 ? 'Criar sua conta' : 'Sobre você'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          {passo === 1 ? 'Passo 1 de 2 — Dados de acesso' : 'Passo 2 de 2 — Informações pessoais'}
        </p>

        <form onSubmit={passo === 1 ? (e) => { e.preventDefault(); if (!form.nome || !form.email || !form.telefone || !form.senha) { setErro('Preencha todos os campos obrigatórios!'); return; } if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem!'); return; } setErro(''); setPasso(2) } : handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {passo === 1 && <>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Nome completo *</label>
              <input className="input-field" placeholder="Seu nome completo" value={form.nome} onChange={e => atualizar('nome', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email *</label>
              <input className="input-field" type="email" placeholder="seu@email.com" value={form.email} onChange={e => atualizar('email', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Telefone / WhatsApp *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={paisTel.code} onChange={e => setPaisTel(PAISES.find(p => p.code === e.target.value) || PAISES[0])} style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '12px 10px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', fontFamily: 'Nunito', flexShrink: 0 }}>
                  {PAISES.map(p => <option key={p.code} value={p.code}>{p.flag} {p.code}</option>)}
                </select>
                <input className="input-field" type="tel" placeholder="(555) 000-0000" value={form.telefone} onChange={e => atualizar('telefone', e.target.value)} required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Senha * (mínimo 6 caracteres)</label>
              <input className="input-field" type="password" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={e => atualizar('senha', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Confirmar senha *</label>
              <input className="input-field" type="password" placeholder="Repita a senha" value={form.confirmarSenha} onChange={e => atualizar('confirmarSenha', e.target.value)} required />
            </div>
          </>}

          {passo === 2 && <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Cidade *</label>
                <input className="input-field" placeholder="Ex: Boston" value={form.cidade} onChange={e => atualizar('cidade', e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Estado *</label>
                <select className="input-field" value={form.estado} onChange={e => atualizar('estado', e.target.value)}>
                  {ESTADOS_EUA.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>País de origem</label>
              <select className="input-field" value={form.paisOrigem} onChange={e => atualizar('paisOrigem', e.target.value)}>
                <option value="Brasil">🇧🇷 Brasil</option>
                <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                <option value="Portugal">🇵🇹 Portugal</option>
                <option value="Outro">🌎 Outro</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Profissão</label>
              <input className="input-field" placeholder="Ex: Eletricista, Babá, Motorista..." value={form.profissao} onChange={e => atualizar('profissao', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Bio (opcional)</label>
              <textarea className="input-field" placeholder="Fale um pouco sobre você..." value={form.bio} onChange={e => atualizar('bio', e.target.value)} rows={3} style={{ resize: 'none' }} />
            </div>
            <div style={{ background: 'rgba(204,0,0,0.06)', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>✅ Confirmo que tenho mais de 13 anos e aceito os Termos de Uso e Política de Privacidade do Bazar Absoluto USA.</p>
            </div>
          </>}

          {erro && <p style={{ fontSize: 13, color: 'var(--red)', background: 'rgba(204,0,0,0.08)', padding: '8px 12px', borderRadius: 8 }}>{erro}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            {passo === 2 && <button type="button" className="btn-secondary" onClick={() => setPasso(1)} style={{ width: 'auto', padding: '12px 20px' }}>Voltar</button>}
            <button className="btn-primary" type="submit" disabled={carregando}>
              {carregando ? 'Cadastrando...' : passo === 1 ? 'Continuar →' : '🎉 Criar conta!'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
