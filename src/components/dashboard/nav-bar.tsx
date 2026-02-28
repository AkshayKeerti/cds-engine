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
    <nav className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center h-12 gap-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="text-sm tracking-tight">CDS Engine</span>
        </Link>

        <div className="flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded text-[13px] font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary/8 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-clinical-safe" />
            <span>Simulation</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
