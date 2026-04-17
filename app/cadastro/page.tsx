'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ESTADOS_EUA = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const PAISES = [
  { code: '+1', flag: '🇺🇸', nome: 'EUA' },
  { code: '+55', flag: '🇧🇷', nome: 'Brasil' },
]

export default function Cadastro() {
  const router = useRouter()
  const [passo, setPasso] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [paisTel, setPaisTel] = useState(PAISES[0])
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const selfieRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '',
    telefone: '', cidade: '', estado: 'Massachusetts',
    paisOrigem: 'Brasil', profissao: '', bio: ''
  })

  function atualizar(campo: string, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function passarPasso1(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.email || !form.telefone || !form.senha) { setErro('Preencha todos os campos obrigatórios!'); return }
    if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem!'); return }
    if (form.senha.length < 6) { setErro('Senha precisa ter pelo menos 6 caracteres!'); return }
    setErro(''); setPasso(2)
  }

  function passarPasso2(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cidade) { setErro('Preencha sua cidade!'); return }
    setErro(''); setPasso(3)
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    if (!selfieFile) { setErro('A selfie é obrigatória para verificação!'); return }
    if (!aceitouTermos) { setErro('Você precisa aceitar os Termos de Uso!'); return }
    setCarregando(true)
    setErro('')

    try {
      // Upload da selfie
      let selfieUrl = null
      if (selfieFile) {
        const formData = new FormData()
        formData.append('file', selfieFile)
        formData.append('upload_preset', 'bazar_absoluto')
        formData.append('folder', 'verificacoes')
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()
        selfieUrl = data.secure_url
      }

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
            selfie_url: selfieUrl,
            role: 'user'
          }
        }
      })

      if (error) {
        setErro(error.message.includes('already registered') ? 'Este email já está cadastrado.' : 'Erro ao cadastrar. Tente novamente.')
      } else {
        router.push('/feed?bemvindo=1')
      }
    } catch {
      setErro('Erro ao cadastrar. Tente novamente.')
    }
    setCarregando(false)
  }

  const PASSOS = ['Dados', 'Perfil', 'Verificação']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: 60, height: 60, background: 'var(--red)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Poppins' }}>B</div>
        <div className="logo-text" style={{ fontSize: 20 }}>BAZAR <span>ABSOLUTO</span></div>
        <div className="logo-sub">USA COMMUNITY</div>
      </div>

      {/* Indicador de passos */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, alignItems: 'center' }}>
        {PASSOS.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: i + 1 <= passo ? 28 : 24, height: i + 1 <= passo ? 28 : 24, borderRadius: '50%', background: i + 1 <= passo ? 'var(--red)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i + 1 <= passo ? 'white' : 'var(--text-muted)', transition: 'all 0.3s' }}>{i + 1}</div>
            <span style={{ fontSize: 11, color: i + 1 === passo ? 'var(--red)' : 'var(--text-muted)', fontWeight: 600, display: 'none' }}>{p}</span>
            {i < PASSOS.length - 1 && <div style={{ width: 20, height: 2, background: i + 1 < passo ? 'var(--red)' : 'var(--border)', borderRadius: 1 }} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {passo === 1 ? 'Criar sua conta' : passo === 2 ? 'Sobre você' : '📸 Verificação de identidade'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          {passo === 1 ? 'Passo 1 de 3 — Dados de acesso' : passo === 2 ? 'Passo 2 de 3 — Informações pessoais' : 'Passo 3 de 3 — Selfie obrigatória'}
        </p>

        <form onSubmit={passo === 1 ? passarPasso1 : passo === 2 ? passarPasso2 : handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Passo 1 */}
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

          {/* Passo 2 */}
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
          </>}

          {/* Passo 3 - Selfie */}
          {passo === 3 && <>
            <div style={{ background: 'rgba(0,31,91,0.06)', borderRadius: 10, padding: 14, marginBottom: 4 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                📸 <strong>Por que precisamos da sua selfie?</strong><br />
                Para garantir que você é uma pessoa real e manter a comunidade segura. Sua foto é analisada pelo admin e não é compartilhada publicamente.
              </p>
            </div>

            <input ref={selfieRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              const f = e.target.files?.[0]
              if (f) {
                setSelfieFile(f)
                const r = new FileReader(); r.onload = () => setSelfiePreview(r.result as string); r.readAsDataURL(f)
              }
            }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={e => {
              const f = e.target.files?.[0]
              if (f) {
                setSelfieFile(f)
                const r = new FileReader(); r.onload = () => setSelfiePreview(r.result as string); r.readAsDataURL(f)
              }
            }} />

            {selfiePreview ? (
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <img src={selfiePreview} alt="Selfie" style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--red)' }} />
                <button type="button" onClick={() => { setSelfiePreview(null); setSelfieFile(null) }} style={{ position: 'absolute', top: 0, right: '50%', transform: 'translateX(80px)', background: 'var(--red)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
                <p style={{ fontSize: 12, color: '#2E7D32', fontWeight: 600, marginTop: 8 }}>✅ Selfie capturada!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button type="button" onClick={() => cameraRef.current?.click()} className="btn-primary" style={{ fontSize: 14 }}>
                  📷 Tirar selfie com a câmera
                </button>
                <button type="button" onClick={() => selfieRef.current?.click()} className="btn-secondary" style={{ fontSize: 14 }}>
                  🖼️ Escolher foto da galeria
                </button>
              </div>
            )}

            {/* Termos de uso */}
            <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={aceitouTermos} onChange={e => setAceitouTermos(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }} />
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Confirmo que tenho mais de 13 anos e aceito os{' '}
                  <a href="/termos" target="_blank" style={{ color: 'var(--red)', fontWeight: 700 }}>Termos de Uso</a>
                  {' '}e a{' '}
                  <a href="/privacidade" target="_blank" style={{ color: 'var(--red)', fontWeight: 700 }}>Política de Privacidade</a>
                  {' '}do Bazar Absoluto USA. Entendo que minha selfie será usada apenas para verificação de identidade.
                </p>
              </div>
            </div>
          </>}

          {erro && <p style={{ fontSize: 13, color: 'var(--red)', background: 'rgba(204,0,0,0.08)', padding: '8px 12px', borderRadius: 8 }}>{erro}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            {passo > 1 && <button type="button" className="btn-secondary" onClick={() => { setPasso(p => p - 1); setErro('') }} style={{ width: 'auto', padding: '12px 20px' }}>← Voltar</button>}
            <button className="btn-primary" type="submit" disabled={carregando}>
              {carregando ? '⏳ Cadastrando...' : passo < 3 ? 'Continuar →' : '🎉 Criar minha conta!'}
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
