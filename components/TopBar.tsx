'use client'
import { useState, useEffect } from 'react'

export default function TopBar() {
  const [tema, setTema] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema') as 'light' | 'dark' || 'light'
    setTema(temaSalvo)
    document.documentElement.setAttribute('data-theme', temaSalvo)
  }, [])

  function alternarTema() {
    const novoTema = tema === 'light' ? 'dark' : 'light'
    setTema(novoTema)
    localStorage.setItem('tema', novoTema)
    document.documentElement.setAttribute('data-theme', novoTema)
  }

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'var(--red)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 18, fontFamily: 'Poppins' }}>B</div>
        <div>
          <div className="logo-text">BAZAR <span>ABSOLUTO</span></div>
          <div className="logo-sub">USA COMMUNITY</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={alternarTema} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--bg-input)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {tema === 'light' ? '🌙' : '☀️'}
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--bg-input)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          🔔
          <div style={{ width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', position: 'absolute', top: 4, right: 4 }} />
        </div>
      </div>
    </div>
  )
}
