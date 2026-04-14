'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('Email ou senha incorretos. Tente novamente.')
    } else {
      router.push('/feed')
    }
    setCarregando(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: 72, height: 72, background: 'var(--red)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, fontWeight: 700, color: 'white', fontFamily: 'Poppins' }}>B</div>
        <div className="logo-text" style={{ fontSize: 24 }}>BAZAR <span>ABSOLUTO</span></div>
        <div className="logo-sub" style={{ marginTop: 4 }}>USA COMMUNITY</div>
      </div>

      {/* Card de login */}
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>Entrar na sua conta</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Bem-vindo de volta!</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
            <input className="input-field" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Senha</label>
            <input className="input-field" type="password" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} required />
          </div>
          {erro && <p style={{ fontSize: 13, color: 'var(--red)', background: 'rgba(204,0,0,0.08)', padding: '8px 12px', borderRadius: 8 }}>{erro}</p>}
          <button className="btn-primary" type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Cadastre-se grátis</Link>
          </p>
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 24, textAlign: 'center', maxWidth: 300 }}>
        Ao entrar você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </div>
  )
}
