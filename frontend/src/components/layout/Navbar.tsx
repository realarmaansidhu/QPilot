'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

/** Top navbar with ticker search */
export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const ticker = query.trim().toUpperCase();
    if (ticker) {
      router.push(`/stock/${ticker}`);
      setQuery('');
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A1628]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <TrendingUp className="h-5 w-5 text-[#00D4AA]" />
          <span className="font-bold"><span className="text-[#00D4AA]">Q</span>Pilot</span>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search ticker (e.g. AAPL)..."
              className="pl-9 bg-white/5 border-white/10 focus:border-[#00D4AA]/50"
            />
          </div>
        </form>

        <div className="w-8" /> {/* Spacer for alignment */}
      </div>
    </header>
  );
}
