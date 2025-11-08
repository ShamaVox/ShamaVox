import { createSupabaseServerClient } from '@/lib/supabaseServer'
import FormRenderer from '@/components/FormRenderer'

export default async function PublicForm({ params }:{ params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const { data: form } = await supabase
    .from('forms')
    .select('id,title,fields')
    .eq('id', params.id)
    .single()

  if (!form) return <p>Form not found</p>

  return (
    <div className="max-w-xl mx-auto">
      <FormRenderer formId={form.id} title={form.title} fields={form.fields} />
    </div>
  )
}
