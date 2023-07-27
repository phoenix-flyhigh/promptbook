import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Promptbook',
  description: 'Discover and share AI prompts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={""}>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  )
}
