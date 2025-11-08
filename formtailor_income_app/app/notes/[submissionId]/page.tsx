import { requireUser } from '@/lib/auth-helpers'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export default async function NotesPage({ params }:{ params: { submissionId: string } }) {
  await requireUser()
  const supabase = createSupabaseServerClient()
  const { data: note } = await supabase
    .from('notes')
    .select('body, created_at')
    .eq('submission_id', params.submissionId)
    .single()

  if (!note) return <p>No note found.</p>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Draft Notes</h1>
      <pre className="bg-slate-50 p-4 rounded whitespace-pre-wrap">{note.body}</pre>
    </div>
  )
}
