import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') || ''
  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = createSupabaseServerClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Update plan based on active status
      // @ts-ignore
      const sub = event.data.object
      const customerId = sub.customer as string
      const status = sub.status as string
      const plan = status === 'active' ? 'pro' : 'free'
      await supabase.from('profiles').update({ plan }).eq('stripe_customer_id', customerId)
      break
    case 'checkout.session.completed':
      // attach customer id to user profile via email lookup where possible
      // @ts-ignore
      const session = event.data.object
      if (session.customer && session.customer_email) {
        const { data: userRow } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', session.customer_email)
          .single()
        if (userRow) {
          await supabase.from('profiles').update({ stripe_customer_id: session.customer as string }).eq('id', userRow.id)
        }
      }
      break
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false
  }
}
