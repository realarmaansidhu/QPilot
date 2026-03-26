'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

/** OAuth/magic link callback — exchanges code for session, then redirects */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A1628]"><Loader2 className="h-8 w-8 animate-spin text-[#00D4AA]" /></div>}>
      <CallbackHandler />
    </Suspense>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();

    async function handleCallback() {
      // Supabase SSR handles the code exchange automatically via cookies
      const { data: { user } } = await supabase.auth.getUser();
      const next = searchParams.get('next') || '/dashboard';

      if (user) {
        // Check if user has completed onboarding (has API key)
        const { data: keys } = await supabase
          .from('api_keys')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (!keys || keys.length === 0) {
          router.push('/onboarding');
        } else {
          router.push(next);
        }
      } else {
        router.push('/login');
      }
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
      <Loader2 className="h-8 w-8 animate-spin text-[#00D4AA]" />
    </div>
  );
}
