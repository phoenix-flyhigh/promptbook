import NavBar from '@/components/NavBar'
import '@/styles/globals.css'
import Provider from '@/utils/Provider'
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
      <body>
        <Provider>
        <div className="main bg-blue-200 dark:bg-primary-blue">
          <div className="gradient" />
        </div>
        <main className="app">
          <NavBar />
          {children}
        </main>
        </Provider>
      </body>
    </html>
  )
}
