'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/comparison', label: 'Comparison' },
  { href: '/audit', label: 'Audit Trail' },
  { href: '/about', label: 'About' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center h-14 gap-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span>CDS Engine</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SimulationControls />
        </div>
      </div>
    </nav>
  );
}

function SimulationControls() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
      <span>Simulation Mode</span>
    </div>
  );
}
