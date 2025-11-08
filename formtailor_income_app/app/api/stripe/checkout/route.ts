import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireUser } from '@/lib/auth-helpers'

export async function POST() {
  const { supabase, user } = await requireUser()
  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: profile?.stripe_customer_id || undefined,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
  })

  return NextResponse.redirect(session.url!, { status: 303 })
}
