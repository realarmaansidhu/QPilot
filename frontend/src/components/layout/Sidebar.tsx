'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Star, Settings, TrendingUp } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/screener',  label: 'Screener',  icon: Search },
  { href: '/watchlist',  label: 'Watchlist',  icon: Star },
  { href: '/settings',   label: 'Settings',   icon: Settings },
];

/** App sidebar with QPilot branding and nav links */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#0A1628] border-r border-white/10">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <TrendingUp className="h-6 w-6 text-[#00D4AA]" />
        <span className="text-xl font-bold">
          <span className="text-[#00D4AA]">Q</span>Pilot
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#00D4AA]/10 text-[#00D4AA]'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 text-xs text-muted-foreground">
        QPilot by Realize Labs
      </div>
    </aside>
  );
}
