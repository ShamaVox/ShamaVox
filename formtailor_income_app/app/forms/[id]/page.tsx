import { requireUser } from '@/lib/auth-helpers'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import FormRenderer from '@/components/FormRenderer'
import Link from 'next/link'

export default async function FormDetail({ params }:{ params: { id: string } }) {
  const { user } = await requireUser()
  const supabase = createSupabaseServerClient()

  const { data: form } = await supabase
    .from('forms')
    .select('id,title,fields,owner_id')
    .eq('id', params.id)
    .single()

  if (!form) return <p>Form not found</p>
  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/public/${form.id}`

  const { data: subs } = await supabase
    .from('submissions')
    .select('id,values,created_at')
    .eq('form_id', form.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{form.title}</h1>
          <p className="text-sm text-slate-600">Share link: <a className="underline" href={publicUrl} target="_blank">{publicUrl}</a></p>
        </div>
        <Link href={`/public/${form.id}`} className="px-3 py-2 border rounded" target="_blank">Open Public View</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Preview</h2>
          <FormRenderer formId={form.id} title={form.title} fields={form.fields} />
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Submissions</h2>
          <div className="space-y-3">
            {(subs||[]).length === 0 && <p className="text-slate-600">No submissions yet.</p>}
            {(subs||[]).map((s:any) => (
              <div key={s.id} className="border rounded p-3 space-y-2">
                <p className="text-xs text-slate-600">{new Date(s.created_at).toLocaleString()}</p>
                <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto">{JSON.stringify(s.values, null, 2)}</pre>
                <form method="post" action="/api/generate-notes">
                  <input type="hidden" name="submissionId" value={s.id} />
                  <button className="px-2 py-1 bg-black text-white rounded">Generate Draft Notes</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
