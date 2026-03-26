'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrendingUp, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

/** Login page wrapper with Suspense for useSearchParams */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1628]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    setLoading(false);
    if (!error) setSent(true);
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-4">
      <Card className="w-full max-w-sm bg-[#0A1628]/80 border-white/10">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-8 w-8 text-[#00D4AA]" />
            <span className="text-2xl font-bold">
              <span className="text-[#00D4AA]">Q</span>Pilot
            </span>
          </div>

          {sent ? (
            <div className="text-center space-y-3">
              <Mail className="h-10 w-10 text-[#00D4AA] mx-auto" />
              <h2 className="text-lg font-semibold">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-center text-lg font-semibold">Sign in to QPilot</h2>

              {/* Google OAuth */}
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={handleGoogleLogin}>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-[#0A1628] px-2 text-muted-foreground">or</span></div>
              </div>

              {/* Email magic link */}
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white/5 border-white/10"
                  required
                />
                <Button type="submit" disabled={loading} className="w-full bg-[#00D4AA] text-[#0A1628] hover:bg-[#00D4AA]/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Send Magic Link
                </Button>
              </form>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-6">
            By signing in, you agree to our Terms of Service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
