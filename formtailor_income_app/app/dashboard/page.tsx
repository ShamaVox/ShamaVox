import { requireUser } from '@/lib/auth-helpers'
import Link from 'next/link'

export default async function Dashboard() {
  const { supabase, user } = await requireUser()

  const { data: forms } = await supabase
    .from('forms')
    .select('id,title,created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/forms/new" className="px-3 py-2 bg-black text-white rounded">New Form</Link>
      </div>

      <div className="space-y-2">
        {(forms||[]).length === 0 && <p className="text-slate-600">No forms yet.</p>}
        {(forms||[]).map(f => (
          <div key={f.id} className="border rounded p-3 flex justify-between">
            <div>
              <p className="font-medium">{f.title}</p>
              <p className="text-xs text-slate-600">Form ID: {f.id}</p>
            </div>
            <Link href={`/forms/${f.id}`} className="px-2 py-1 border rounded">Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
