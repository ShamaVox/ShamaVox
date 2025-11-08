import './globals.css'
import Navbar from '@/components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FormTailor',
  description: 'AI-assisted intake forms'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-5xl mx-auto px-4">
        <Navbar />
        <main className="py-6">{children}</main>
      </body>
    </html>
  )
}
