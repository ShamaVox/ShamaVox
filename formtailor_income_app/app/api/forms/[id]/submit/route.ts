import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { encrypt } from '@/lib/crypto'

export async function POST(req: NextRequest, { params }:{ params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const { values } = await req.json()
  // Field-level masking: encrypt all values if ENCRYPTION_KEY is set
  const masked: Record<string,string> = {}
  for (const [k,v] of Object.entries(values||{})) {
    masked[k] = encrypt(typeof v === 'string' ? v : JSON.stringify(v))
  }
  const { error } = await supabase
    .from('submissions')
    .insert({ form_id: params.id, values: masked })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
