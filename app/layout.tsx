import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bazar Absoluto USA',
  description: 'A maior comunidade brasileira nos EUA',
  themeColor: '#CC0000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
