'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star, History, Sparkles, TrendingUp, ArrowRight, Award, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WatchlistSidebar } from '@/features/watchlist/watchlist-sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ResearchReport } from '@/types';
import { COMPANY_MAPPING } from '@/services/mockData';

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load watchlist and search history from localStorage
  const [watchlist, setWatchlist] = useLocalStorage<ResearchReport[]>('watchlist_reports', []);
  const [history, setHistory] = useLocalStorage<string[]>('search_history', ['Apple Inc.', 'Tesla, Inc.', 'Microsoft Corporation']);

  // Handle Search Submission
  const handleSearchSubmit = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Save to history
    setHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 8); // Keep last 8 searches
    });

    // Determine target ticker or search term
    let target = trimmed;
    const cleanQuery = trimmed.toLowerCase();
    for (const [key, val] of Object.entries(COMPANY_MAPPING)) {
      if (cleanQuery === key || cleanQuery === val.ticker.toLowerCase() || cleanQuery === val.name.toLowerCase()) {
        target = val.ticker;
        break;
      }
    }

    router.push(`/research/${encodeURIComponent(target)}`);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    handleSearchSubmit(name);
  };

  const handleRemoveWatchlistItem = (ticker: string) => {
    setWatchlist(prev => prev.filter(r => r.company.ticker !== ticker));
  };

  // Filtered suggestions based on query, deduplicated by ticker to prevent duplicate keys (e.g. GOOGL, META)
  const suggestions = Object.values(COMPANY_MAPPING)
    .filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.ticker.toLowerCase().includes(query.toLowerCase())
    )
    .filter((value, index, self) => 
      self.findIndex(t => t.ticker === value.ticker) === index
    );

  return (
    <div className="relative flex min-h-screen flex-col bg-[#030712]">
      {/* Decorative blurs */}
      <div className="glow-bg absolute top-[10%] right-[10%] h-[300px] w-[300px] bg-indigo-500/5 blur-[90px]" />
      <div className="glow-bg absolute bottom-[20%] left-[5%] h-[400px] w-[400px] bg-violet-600/5 blur-[100px]" />

      <Navbar onOpenWatchlist={() => setIsWatchlistOpen(true)} watchlistCount={watchlist.length} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Dashboard Welcome Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Altuni AI Labs Terminal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Investment Research Portal</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Input a corporation's name or stock ticker below to deploy the 5-agent LangGraph network.
          </p>
        </div>

        {/* Central Search Bar Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit(query);
            }}
            className="relative"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by company name or ticker (e.g. NVIDIA, AAPL, Tesla)..."
                className="w-full rounded-xl border border-white/10 bg-gray-950 px-12 py-4 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/30 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                Deploy Agents
              </button>
            </div>

            {/* Auto-Complete Suggestions */}
            {showSuggestions && query && suggestions.length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSuggestions(false)} 
                />
                <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-white/10 bg-gray-950/95 p-2 shadow-2xl backdrop-blur-md max-h-60 overflow-y-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s.ticker}
                      type="button"
                      onClick={() => handleSuggestionClick(s.name)}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-xs text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <span>{s.name}</span>
                      <span className="font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                        {s.ticker}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </form>

          {/* Quick Suggestions Tags */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mr-1">Popular:</span>
            {['Apple', 'Tesla', 'Microsoft', 'Nvidia', 'Google'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setQuery(name);
                  handleSearchSubmit(name);
                }}
                className="rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 px-3 py-1 text-xs text-gray-400 hover:text-white transition-all duration-200"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Watchlist Overview */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4.5 w-4.5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Watchlisted Assets</h2>
            </div>

            {watchlist.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[220px]">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 mb-3">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">Your watchlist is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
                  Research a company and add it to your watchlist to track overall recommendations, scores, and prices here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watchlist.map((report) => {
                  const isInvest = report.recommendation.decision === 'INVEST';
                  return (
                    <div 
                      key={report.company.ticker}
                      className="glass-card p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500">
                              {report.company.industry}
                            </span>
                            <h3 className="text-base font-bold text-white mt-0.5 truncate max-w-[160px]">
                              {report.company.name}
                            </h3>
                          </div>
                          <span className="font-bold text-sm text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                            {report.company.ticker}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="text-left">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Verdict</span>
                            <p className={`text-xs font-bold mt-0.5 ${isInvest ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {report.recommendation.decision}
                            </p>
                          </div>
                          <div className="text-left border-l border-white/5 pl-4">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Overall Score</span>
                            <p className="text-xs font-bold text-white mt-0.5">{report.recommendation.scores.overall}/100</p>
                          </div>
                          <div className="text-left border-l border-white/5 pl-4">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Price</span>
                            <p className="text-xs font-bold text-white mt-0.5">${report.company.stockPrice || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleRemoveWatchlistItem(report.company.ticker)}
                          className="text-xs text-gray-500 hover:text-rose-400 transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => router.push(`/research/${report.company.ticker}`)}
                          className="flex items-center gap-0.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          View Analysis <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Search History & Quick Facts */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4.5 w-4.5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Recent Audits</h2>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-4">
              {history.length === 0 ? (
                <p className="text-xs text-gray-500">Your search history is empty.</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSearchSubmit(item)}
                      className="flex w-full items-center justify-between py-2.5 first:pt-0 last:pb-0 text-left text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{item}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Agent Fact Widget */}
            <div className="rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-5 mt-6">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">How Agents Decide</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                The <strong>Investment Advisor Agent</strong> calculates scores by auditing growth margins (weighted 25%), risk variables (weighted 25%), valuation entries (weighted 20%), balance sheet strength (weighted 20%), and innovation metrics (weighted 10%).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Watchlist Drawer */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemove={handleRemoveWatchlistItem}
      />

      <Footer />
    </div>
  );
}
