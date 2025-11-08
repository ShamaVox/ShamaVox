'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()
  const active = (p: string) => path === p ? 'font-semibold underline' : 'text-slate-700'
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="text-xl font-bold">FormTailor</Link>
      <div className="flex gap-4">
        <Link href="/dashboard" className={active('/dashboard')}>Dashboard</Link>
        <Link href="/forms/new" className={active('/forms/new')}>New Form</Link>
        <Link href="/account" className={active('/account')}>Account</Link>
      </div>
    </nav>
  )
}
