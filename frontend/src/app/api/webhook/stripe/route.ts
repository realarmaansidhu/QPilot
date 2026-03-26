import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

/** Stripe webhook handler — syncs subscription changes to Supabase */
export async function POST(req: NextRequest) {
  // Lazy-initialize to avoid build-time errors when env vars are missing
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (userId && session.subscription) {
        // Fetch subscription to determine tier
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = sub.items.data[0]?.price.id;
        const tier = mapPriceToTier(priceId);

        await supabase.from('profiles').update({
          subscription_tier: tier,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id;
      const tier = mapPriceToTier(priceId);
      await supabase.from('profiles').update({
        subscription_tier: tier,
      }).eq('stripe_subscription_id', sub.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('profiles').update({
        subscription_tier: 'free',
        stripe_subscription_id: null,
      }).eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

/** Map Stripe price ID to QPilot tier — update these after creating Stripe products */
function mapPriceToTier(priceId: string): string {
  // TODO: Replace with actual Stripe price IDs
  const PRICE_MAP: Record<string, string> = {
    'price_plus_monthly': 'plus',
    'price_plus_yearly': 'plus',
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
  };
  return PRICE_MAP[priceId] || 'free';
}
