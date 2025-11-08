'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabaseClient'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (!error) setSent(true)
    else alert(error.message)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
      {sent ? (
        <p>Check your email for the magic link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="you@example.com"
            value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="px-4 py-2 bg-black text-white rounded">Send magic link</button>
        </form>
      )}
    </div>
  )
}
