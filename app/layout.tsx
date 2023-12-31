import NavBar from '@/components/NavBar'
import '@/styles/globals.css'
import Provider from '@/utils/Provider'
import type { Metadata } from 'next'
import Head from 'next/head'

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
    <Head>
        <link
          rel="icon"
          href="/favicon.ico" 
          type="image/x-icon"
        />
      </Head>
      <body>
        <Provider>
        <div className="main bg-light-background dark:bg-dark-background ">
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
