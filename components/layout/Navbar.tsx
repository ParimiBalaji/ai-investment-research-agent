'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, TrendingUp, Star, Layers, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenWatchlist?: () => void;
  watchlistCount?: number;
}

export function Navbar({ onOpenWatchlist, watchlistCount = 0 }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Cpu className="h-5 w-5" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-none">InsideIIM</span>
              <span className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase leading-none mt-1">Research Labs</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard') || pathname?.startsWith('/research')
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/compare"
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive('/compare')
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Compare Assets
            </Link>
          </nav>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-3">
          {/* Agent Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-indigo-500/10 bg-indigo-500/5 px-3 py-1 text-xs text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="font-semibold">Gemini 2.5 Active</span>
          </div>

          {/* Watchlist Trigger */}
          {onOpenWatchlist && (
            <button
              onClick={onOpenWatchlist}
              className="relative flex h-9 items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-md">
                  {watchlistCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile menu link for Compare */}
          <Link
            href="/compare"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            title="Compare Assets"
          >
            <Layers className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
