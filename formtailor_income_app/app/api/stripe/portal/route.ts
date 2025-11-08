import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireUser } from '@/lib/auth-helpers'

export async function POST() {
  const { supabase, user } = await requireUser()
  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No customer' }, { status: 400 })
  }
  const sess = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: process.env.STRIPE_BILLING_PORTAL_RETURN_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/account`
  })
  return NextResponse.redirect(sess.url, { status: 303 })
}
