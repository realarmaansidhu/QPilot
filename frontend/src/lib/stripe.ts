// Stripe helpers — client-side functions that call Next.js API routes

/** Redirect user to Stripe Checkout for subscription upgrade */
export async function createCheckoutSession(priceId: string): Promise<string> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  if (!res.ok) throw new Error('Failed to create checkout session');
  const { url } = await res.json();
  return url;
}

/** Redirect user to Stripe Customer Portal for billing management */
export async function createPortalSession(): Promise<string> {
  const res = await fetch('/api/stripe/portal', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to create portal session');
  const { url } = await res.json();
  return url;
}
