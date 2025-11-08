import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { decrypt } from '@/lib/crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const submissionId = String(formData.get('submissionId')||'')
  const supabase = createSupabaseServerClient()

  const { data: sub } = await supabase
    .from('submissions').select('id,form_id,values,created_at')
    .eq('id', submissionId).single()

  if (!sub) return NextResponse.redirect(new URL('/dashboard', req.url))

  const { data: form } = await supabase
    .from('forms').select('id,title').eq('id', sub.form_id).single()

  const raw = Object.fromEntries(
    Object.entries(sub.values||{}).map(([k,v]) => [k, decrypt(String(v))])
  )

  // If OPENAI key missing, return a trivial template.
  const apiKey = process.env.OPENAI_API_KEY
  let notes = `Session Notes for ${form?.title||'Intake'}
Date: ${new Date(sub.created_at).toDateString()}

Summary:
- Chief concern: ${raw['Chief concern']||raw['Concern']||'N/A'}
- Goals: ${raw['Goals']||'N/A'}

Next Steps:
- Schedule follow-up
- Provide resources
`

  if (apiKey) {
    try {
      const { OpenAI } = await import('openai')
      const client = new OpenAI({ apiKey })
      const prompt = `You are a careful assistant generating a concise first-draft client session note.
Use the intake JSON below. Keep it 150-250 words. Provide a "Summary" and "Next Steps" list.
JSON: ${JSON.stringify(raw)}`
      const resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You write succinct, professional clinical-style notes. Never include PHI beyond what is provided.'},
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      })
      const content = resp.choices?.[0]?.message?.content
      if (content) notes = String(content)
    } catch (e) {
      // fall back to template
    }
  }

  await supabase.from('notes').insert({
    submission_id: sub.id,
    body: notes
  })

  return NextResponse.redirect(new URL(`/notes/${sub.id}`, req.url))
}
