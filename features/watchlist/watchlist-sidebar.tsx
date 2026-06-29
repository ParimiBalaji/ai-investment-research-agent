'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Star, Trash2, ArrowUpRight, Award } from 'lucide-react';
import { ResearchReport } from '../../types';

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: ResearchReport[];
  onRemove: (ticker: string) => void;
}

export function WatchlistSidebar({ isOpen, onClose, watchlist, onRemove }: WatchlistSidebarProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleItemClick = (ticker: string) => {
    router.push(`/research/${ticker}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out">
          <div className="flex h-full flex-col border-l border-white/10 bg-gray-950/95 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <h2 className="text-lg font-bold text-white">Your Asset Watchlist</h2>
              </div>
              <button 
                onClick={onClose}
                className="rounded-lg border border-white/5 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
              {watchlist.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gray-500 mb-4">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">No bookmarked assets</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
                    Research a company and click the star icon to pin it to your dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {watchlist.map((report) => {
                    const isInvest = report.recommendation.decision === 'INVEST';
                    return (
                      <div 
                        key={report.company.ticker}
                        className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-white/5 p-4 hover:border-white/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div 
                            className="cursor-pointer"
                            onClick={() => handleItemClick(report.company.ticker)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {report.company.ticker}
                              </span>
                              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                isInvest 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {report.recommendation.decision}
                              </span>
                            </div>
                            <h4 className="text-xs text-gray-400 mt-1 font-medium truncate max-w-[200px]">
                              {report.company.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Score indicator */}
                            <div className="flex items-center gap-1 text-xs font-bold text-white">
                              <Award className="h-3.5 w-3.5 text-indigo-400" />
                              <span>{report.recommendation.scores.overall}</span>
                            </div>
                            
                            <button
                              onClick={() => onRemove(report.company.ticker)}
                              className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-gray-500 hover:text-rose-400 hover:bg-white/5 transition-all duration-200"
                              title="Remove from Watchlist"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quick stock mini info */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3 text-[11px] text-gray-500">
                          <div>
                            Stock Price: <span className="text-white font-medium">${report.company.stockPrice || 'N/A'}</span>
                          </div>
                          <button
                            onClick={() => handleItemClick(report.company.ticker)}
                            className="flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            Report <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WatchlistSidebar;
