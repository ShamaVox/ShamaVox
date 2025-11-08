import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
  const { supabase, user } = await requireUser()
  const { title, fields } = await req.json()
  const { data, error } = await supabase
    .from('forms')
    .insert({ title, fields, owner_id: user.id })
    .select('id')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: data.id })
}
