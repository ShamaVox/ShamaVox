import { requireUser } from '@/lib/auth-helpers'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export default async function AccountPage() {
  const { supabase, user } = await requireUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan, stripe_customer_id')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p><span className="font-medium">Plan:</span> {profile?.plan || 'free'}</p>
      <form action="/api/stripe/checkout" method="post">
        <button className="px-3 py-2 bg-black text-white rounded">Upgrade</button>
      </form>
      <form action="/api/stripe/portal" method="post">
        <button className="px-3 py-2 border rounded">Manage Billing</button>
      </form>
      <Link href="/dashboard" className="underline">Back to dashboard</Link>
    </div>
  )
}
