import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabaseServer'

export async function requireUser() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  return { supabase, user }
}
