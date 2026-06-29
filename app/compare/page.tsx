'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ResearchReport } from '@/types';
import { COMPANY_MAPPING } from '@/services/mockData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Cpu, Sparkles, Scale, AlertTriangle, ArrowLeftRight, 
  CheckCircle, XCircle, Award, RefreshCw 
} from 'lucide-react';

export default function ComparePage() {
  const [comp1Query, setComp1Query] = useState('');
  const [comp2Query, setComp2Query] = useState('');
  const [comp1Report, setComp1Report] = useState<ResearchReport | null>(null);
  const [comp2Report, setComp2Report] = useState<ResearchReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  const [watchlist, setWatchlist] = useLocalStorage<ResearchReport[]>('watchlist_reports', []);

  // Safe mount check for Recharts
  useEffect(() => {
    setIsMounted(true);

    // Read URL Search Parameters for c1 and c2
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const c1 = searchParams.get('c1');
      const c2 = searchParams.get('c2');
      if (c1) setComp1Query(c1);
      if (c2) setComp2Query(c2);

      if (c1 && c2) {
        triggerComparison(c1, c2);
      } else if (c1) {
        // Auto resolve report 1 if c1 is defined and load placeholder
        fetchReport1(c1);
      }
    }
  }, []);

  const handleRemoveWatchlistItem = (ticker: string) => {
    setWatchlist(prev => prev.filter(r => r.company.ticker !== ticker));
  };

  const fetchReport1 = async (q1: string) => {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: q1 })
      });
      if (res.ok) {
        const data = await res.json();
        setComp1Report(data);
      }
    } catch (err) {
      console.warn('Could not auto-load company 1:', err);
    }
  };

  const triggerComparison = async (q1: string, q2: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Resolve ticker keys
      const resolveTicker = (query: string) => {
        const clean = query.trim().toLowerCase();
        for (const [key, val] of Object.entries(COMPANY_MAPPING)) {
          if (clean === key || clean === val.ticker.toLowerCase() || clean === val.name.toLowerCase()) {
            return val.ticker;
          }
        }
        return query.trim();
      };

      const ticker1 = resolveTicker(q1);
      const ticker2 = resolveTicker(q2);

      if (ticker1.toLowerCase() === ticker2.toLowerCase()) {
        throw new Error('Please select two different companies to compare');
      }

      // 2. Fetch reports for both companies (runs parallel)
      const [res1, res2] = await Promise.all([
        fetch('/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName: ticker1 })
        }),
        fetch('/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName: ticker2 })
        })
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error('One or both agent research threads failed. Please check inputs.');
      }

      const data1 = await res1.json();
      const data2 = await res2.json();

      setComp1Report(data1);
      setComp2Report(data2);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate comparison');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comp1Query.trim() || !comp2Query.trim()) return;
    triggerComparison(comp1Query, comp2Query);
  };

  // Format chart data for Recharts overlay
  const scoreChartData = (comp1Report && comp2Report) ? [
    { name: 'Growth', [comp1Report.company.ticker]: comp1Report.recommendation.scores.growth, [comp2Report.company.ticker]: comp2Report.recommendation.scores.growth },
    { name: 'Risk Safety', [comp1Report.company.ticker]: comp1Report.recommendation.scores.risk, [comp2Report.company.ticker]: comp2Report.recommendation.scores.risk },
    { name: 'Valuation', [comp1Report.company.ticker]: comp1Report.recommendation.scores.valuation, [comp2Report.company.ticker]: comp2Report.recommendation.scores.valuation },
    { name: 'Financial', [comp1Report.company.ticker]: comp1Report.recommendation.scores.financial, [comp2Report.company.ticker]: comp2Report.recommendation.scores.financial },
    { name: 'Innovation', [comp1Report.company.ticker]: comp1Report.recommendation.scores.innovation, [comp2Report.company.ticker]: comp2Report.recommendation.scores.innovation },
    { name: 'Overall', [comp1Report.company.ticker]: comp1Report.recommendation.scores.overall, [comp2Report.company.ticker]: comp2Report.recommendation.scores.overall }
  ] : [];

  return (
    <div className="relative flex min-h-screen flex-col bg-[#030712] text-gray-200">
      {/* Decorative blurs */}
      <div className="glow-bg absolute top-[10%] left-[5%] h-[300px] w-[300px] bg-indigo-500/5 blur-[90px]" />
      <div className="glow-bg absolute bottom-[20%] right-[5%] h-[300px] w-[300px] bg-violet-600/5 blur-[100px]" />

      <Navbar onOpenWatchlist={() => setIsWatchlistOpen(true)} watchlistCount={watchlist.length} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Scale className="h-4 w-4" />
            <span>Asset Overlay Analysis</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Compare Financial Portfolios</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Input two companies side-by-side to deploy dual research threads and compare metrics.
          </p>
        </div>

        {/* Inputs form */}
        <form onSubmit={handleCompareSubmit} className="glass-panel rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company 1</label>
              <input
                type="text"
                value={comp1Query}
                onChange={(e) => setComp1Query(e.target.value)}
                placeholder="e.g. Apple or AAPL..."
                className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/30 transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company 2</label>
              <input
                type="text"
                value={comp2Query}
                onChange={(e) => setComp2Query(e.target.value)}
                placeholder="e.g. Microsoft or MSFT..."
                className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/30 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Runs dual asynchronous Multi-Agent audits.</span>
            </div>
            <button
              type="submit"
              disabled={loading || !comp1Query.trim() || !comp2Query.trim()}
              className="w-full sm:w-auto flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 text-xs font-semibold text-white transition-colors disabled:bg-white/5 disabled:text-gray-500"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Auditing Portfolios...</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Execute Comparison</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error panel */}
        {error && (
          <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-4 flex items-center gap-3 mb-8">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <span className="text-xs text-rose-400">{error}</span>
          </div>
        )}

        {/* Comparison Dashboard Display */}
        {comp1Report && comp2Report && (
          <div className="space-y-8 animate-fade-in">
            {/* Chart Section */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-indigo-400" />
                <span>Scores Matrix Overlay</span>
              </h3>
              
              <div className="h-80 w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} />
                      <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey={comp1Report.company.ticker} fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey={comp2Report.company.ticker} fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="glass-panel rounded-2xl p-6 overflow-hidden">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
                Comparison Details
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="py-3 font-semibold uppercase w-[30%]">Metrics</th>
                      <th className="py-3 font-bold text-white uppercase text-center bg-indigo-500/5 w-[35%]">
                        {comp1Report.company.name} ({comp1Report.company.ticker})
                      </th>
                      <th className="py-3 font-bold text-white uppercase text-center bg-emerald-500/5 w-[35%]">
                        {comp2Report.company.name} ({comp2Report.company.ticker})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Verdict */}
                    <tr className="font-semibold text-white">
                      <td className="py-4">Executive Verdict</td>
                      <td className="py-4 text-center">
                        <span className={`rounded-full px-3 py-1 font-bold ${
                          comp1Report.recommendation.decision === 'INVEST' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {comp1Report.recommendation.decision}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`rounded-full px-3 py-1 font-bold ${
                          comp2Report.recommendation.decision === 'INVEST' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {comp2Report.recommendation.decision}
                        </span>
                      </td>
                    </tr>
                    {/* Confidence */}
                    <tr>
                      <td className="py-3.5">Advisory Confidence</td>
                      <td className="py-3.5 text-center font-bold text-white">{comp1Report.recommendation.confidence}%</td>
                      <td className="py-3.5 text-center font-bold text-white">{comp2Report.recommendation.confidence}%</td>
                    </tr>
                    {/* Overall Score */}
                    <tr className="font-semibold text-white">
                      <td className="py-3.5">Overall Rating</td>
                      <td className="py-3.5 text-center bg-indigo-500/5 text-indigo-400 font-bold">{comp1Report.recommendation.scores.overall}/100</td>
                      <td className="py-3.5 text-center bg-emerald-500/5 text-emerald-400 font-bold">{comp2Report.recommendation.scores.overall}/100</td>
                    </tr>
                    {/* Industry */}
                    <tr>
                      <td className="py-3.5">Industry Sector</td>
                      <td className="py-3.5 text-center text-gray-400">{comp1Report.company.industry}</td>
                      <td className="py-3.5 text-center text-gray-400">{comp2Report.company.industry}</td>
                    </tr>
                    {/* CEO */}
                    <tr>
                      <td className="py-3.5">CEO</td>
                      <td className="py-3.5 text-center text-gray-400">{comp1Report.company.ceo}</td>
                      <td className="py-3.5 text-center text-gray-400">{comp2Report.company.ceo}</td>
                    </tr>
                    {/* Revenue Growth */}
                    <tr>
                      <td className="py-3.5">YoY Revenue Growth</td>
                      <td className="py-3.5 text-center font-semibold text-white">{comp1Report.financials.revenueGrowth}%</td>
                      <td className="py-3.5 text-center font-semibold text-white">{comp2Report.financials.revenueGrowth}%</td>
                    </tr>
                    {/* Operating Margin */}
                    <tr>
                      <td className="py-3.5">Operating Margin</td>
                      <td className="py-3.5 text-center font-semibold text-white">{comp1Report.financials.operatingMargin}%</td>
                      <td className="py-3.5 text-center font-semibold text-white">{comp2Report.financials.operatingMargin}%</td>
                    </tr>
                    {/* PE Ratio */}
                    <tr>
                      <td className="py-3.5">P/E Ratio</td>
                      <td className="py-3.5 text-center font-semibold text-white">{comp1Report.financials.peRatio}</td>
                      <td className="py-3.5 text-center font-semibold text-white">{comp2Report.financials.peRatio}</td>
                    </tr>
                    {/* Debt to Equity */}
                    <tr>
                      <td className="py-3.5">Debt-to-Equity Ratio</td>
                      <td className="py-3.5 text-center text-gray-300">{comp1Report.financials.debtToEquity}</td>
                      <td className="py-3.5 text-center text-gray-300">{comp2Report.financials.debtToEquity}</td>
                    </tr>
                    {/* Free Cash Flow */}
                    <tr>
                      <td className="py-3.5">Free Cash Flow</td>
                      <td className="py-3.5 text-center text-gray-300">{comp1Report.financials.freeCashFlow}</td>
                      <td className="py-3.5 text-center text-gray-300">{comp2Report.financials.freeCashFlow}</td>
                    </tr>
                    {/* SWOT summary */}
                    <tr className="align-top">
                      <td className="py-4">Core Strengths</td>
                      <td className="py-4 px-4 bg-indigo-500/5">
                        <ul className="list-disc pl-4 space-y-1 text-gray-400">
                          {comp1Report.swot.strengths.slice(0, 2).map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4 bg-emerald-500/5">
                        <ul className="list-disc pl-4 space-y-1 text-gray-400">
                          {comp2Report.swot.strengths.slice(0, 2).map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
