'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Star, Share2, Download, Printer, MessageSquare, 
  TrendingUp, TrendingDown, Cpu, Sparkles, Award, ShieldAlert, 
  Globe, User, MapPin, Building, Calendar, Users, RefreshCw, ArrowLeftRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Legend
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatPanel } from '@/features/chat/chat-panel';
import { WatchlistSidebar } from '@/features/watchlist/watchlist-sidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ResearchReport } from '@/types';
import { downloadReportAsMarkdown, copyReportToClipboard, exportReportToPDF } from '@/utils/pdf-generator';

const LOADING_STEPS = [
  { id: 1, name: 'Agent 1: Company Researcher', desc: 'Ingesting business profile, industry categorization, and executive leadership data...' },
  { id: 2, name: 'Agent 2: Financial Analyst', desc: 'Auditing 4-year income statements, operating margins, leverage ratios, and pricing history...' },
  { id: 3, name: 'Agent 3: News sentiment Crawler', desc: 'Analyzing recent publications, crawler releases, and detecting positive/negative sentiment weights...' },
  { id: 4, name: 'Agent 4: Risk & SWOT Modeler', desc: 'Quantifying technology, business, regulatory risk vectors, and compiling SWOT quadrants...' },
  { id: 5, name: 'Agent 5: Investment Decision Advisor', desc: 'Synthesizing all agent findings, scoring individual vectors, and drafting final thesis...' }
];

export default function ResearchPage() {
  const router = useRouter();
  const params = useParams();
  const rawQuery = params.ticker ? decodeURIComponent(params.ticker as string) : '';

  // Local state
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timelineLogs, setTimelineLogs] = useState<string[]>(['Deploying Altuni Agent Workflow...']);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Local storage cache hooks
  const [watchlist, setWatchlist] = useLocalStorage<ResearchReport[]>('watchlist_reports', []);

  // Hydration safeguard for Recharts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Confetti celebration trigger for high-conviction BUY recommendations
  useEffect(() => {
    if (report && report.recommendation.decision === 'INVEST') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#10b981', '#6366f1', '#3b82f6']
      });
    }
  }, [report]);

  // Trigger Research API Call on mount
  useEffect(() => {
    if (!rawQuery) return;
    runResearch();
  }, [rawQuery]);

  // Loading Step Simulation Timer (complements real API call)
  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) {
          const nextStep = prev + 1;
          setTimelineLogs(logs => [
            ...logs,
            `Starting ${LOADING_STEPS[nextStep].name}...`,
            `Processing ${LOADING_STEPS[nextStep].name} parameters...`
          ]);
          return nextStep;
        }
        return prev;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [loading]);

  const runResearch = async () => {
    setLoading(true);
    setCurrentStep(0);
    setError(null);
    setTimelineLogs(['Deploying Altuni Agent Workflow...', 'Initializing State Graph Annotation schema...']);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: rawQuery })
      });

      if (!response.ok) {
        throw new Error('Agent failed to complete audit. API returned an error.');
      }

      const data = await response.json();
      
      // Delay completion slightly so user sees the loading state transitions
      await new Promise(r => setTimeout(r, 800));
      
      setReport(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to connect to agent backend');
      setLoading(false);
    }
  };

  // Watchlist functions
  const isBookmarked = report ? watchlist.some(r => r.company.ticker === report.company.ticker) : false;
  
  const handleToggleBookmark = () => {
    if (!report) return;
    setWatchlist(prev => {
      if (isBookmarked) {
        return prev.filter(r => r.company.ticker !== report.company.ticker);
      } else {
        return [...prev, report];
      }
    });
  };

  const handleCopy = async () => {
    if (!report) return;
    const success = await copyReportToClipboard(report);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveWatchlistItem = (ticker: string) => {
    setWatchlist(prev => prev.filter(r => r.company.ticker !== ticker));
  };

  // Render Loader
  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-[#030712] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full relative z-10">
          <div className="relative flex h-20 w-20 items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
            <Cpu className="h-8 w-8 text-indigo-400 animate-pulse" />
          </div>

          <h2 className="text-xl font-bold mb-1">Auditing Asset: {rawQuery}</h2>
          <p className="text-xs text-gray-500 text-center mb-8">
            Deploying five autonomous agents via LangGraph.js node orchestration.
          </p>

          {/* Steps Checklist */}
          <div className="w-full space-y-4 mb-8">
            {LOADING_STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <div 
                  key={step.id} 
                  className={`rounded-xl border p-4 transition-all duration-300 ${
                    isActive 
                      ? 'border-indigo-500/30 bg-indigo-500/5 shadow-md shadow-indigo-500/5' 
                      : isCompleted
                      ? 'border-emerald-500/10 bg-emerald-500/5 opacity-80'
                      : 'border-white/5 bg-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : isActive 
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{step.name}</h4>
                      {isActive && <p className="text-[11px] text-indigo-300 mt-1 leading-relaxed animate-fade-in">{step.desc}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Logs view */}
          <div className="w-full rounded-lg border border-white/5 bg-gray-950/80 p-4 h-24 overflow-y-auto no-scrollbar font-mono text-[10px] text-gray-500 space-y-1">
            {timelineLogs.map((log, lIdx) => (
              <p key={lIdx} className="truncate">&gt; {log}</p>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render Error
  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col bg-[#030712] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold">Research Run Failed</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            {error || 'The model was unable to synthesize corporate indicators for this company.'}
          </p>
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex h-9 items-center justify-center rounded-lg border border-white/10 px-4 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={runResearch}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-medium hover:bg-indigo-500 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Audit</span>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isInvestDecision = report.recommendation.decision === 'INVEST';

  return (
    <div className="relative flex min-h-screen flex-col bg-[#030712] text-gray-200">
      {/* Glow backgrounds */}
      <div className={`glow-bg absolute top-0 left-0 h-[500px] w-[500px] blur-[150px] pointer-events-none -z-10 ${
        isInvestDecision ? 'bg-emerald-500/5' : 'bg-rose-500/5'
      }`} />
      
      <Navbar onOpenWatchlist={() => setIsWatchlistOpen(true)} watchlistCount={watchlist.length} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Link and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-4 text-xs font-medium transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Star className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span>{isBookmarked ? 'Pinned' : 'Pin to Watchlist'}</span>
            </button>
            <button
              onClick={() => router.push(`/compare?c1=${report.company.ticker}`)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-4 text-xs font-medium text-indigo-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Compare Asset</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-4 text-xs font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Copy Thesis'}</span>
            </button>
            <button
              onClick={() => downloadReportAsMarkdown(report)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-4 text-xs font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
            <button
              onClick={exportReportToPDF}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-4 text-xs font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Corporate Profile Header */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-white border border-white/10 font-bold text-lg">
                {report.company.ticker}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">{report.company.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{report.company.industry}</span>
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{report.company.hq}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Financial Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">CEO</span>
                <p className="text-sm font-semibold text-white mt-0.5">{report.company.ceo}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Employees</span>
                <p className="text-sm font-semibold text-white mt-0.5">{report.company.employees}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Market Cap</span>
                <p className="text-sm font-semibold text-white mt-0.5">{report.company.marketCap}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Revenue</span>
                <p className="text-sm font-semibold text-white mt-0.5">{report.company.revenue}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6 pt-6 border-t border-white/5 leading-relaxed">
            {report.company.description}
          </p>
        </div>

        {/* Investment Decision and Score Gauges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Executive Recommendation */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Executive Verdict</span>
                <span className="text-[10px] font-bold text-gray-500">Timestamp: {new Date(report.timestamp).toLocaleDateString()}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                {/* Decision Badge */}
                <div className={`relative flex h-24 w-48 items-center justify-center rounded-2xl border font-black text-3xl tracking-wider shadow-2xl ${
                  isInvestDecision 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/5'
                }`}>
                  {report.recommendation.decision}
                </div>

                {/* Confidence index */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">Advisory Confidence</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-white">{report.recommendation.confidence}%</span>
                    <span className="text-xs text-gray-500">reliability index</span>
                  </div>
                  <div className="h-1.5 w-40 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isInvestDecision ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                      style={{ width: `${report.recommendation.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Long-form thesis */}
              <div className="prose prose-invert max-w-none text-xs text-gray-300 leading-relaxed font-sans mt-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report.recommendation.reasoning}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Investment Metric Scores */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent Evaluation Scores</span>
                <Award className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Growth Rating', score: report.recommendation.scores.growth, desc: 'Current scale velocity & TAM' },
                  { label: 'Risk Safety', score: report.recommendation.scores.risk, desc: 'Higher implies safety & low-risk' },
                  { label: 'Valuation Entry', score: report.recommendation.scores.valuation, desc: 'Multiple multiples analysis' },
                  { label: 'Financial Health', score: report.recommendation.scores.financial, desc: 'FCF index & leverage load' },
                  { label: 'Innovation Quotient', score: report.recommendation.scores.innovation, desc: 'AI adaptation & R&D speed' }
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div>
                        <span className="text-xs font-semibold text-white">{metric.label}</span>
                        <span className="text-[9px] text-gray-500 ml-2">{metric.desc}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-400">{metric.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Summary Score */}
            <div className="border-t border-white/5 pt-6 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Overall Rating</span>
                <p className="text-xs text-gray-400 mt-0.5">Composite Weighted Average</p>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-2xl font-black text-white">{report.recommendation.scores.overall}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Financial Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Chart: Stock Price (Area Chart) */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-5 flex flex-col">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <span>6-Month Estimated Stock Chart</span>
            </h3>

            <div className="h-64 w-full stock-chart-container">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.financials.stockHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} />
                    <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Right Chart: Revenue vs Income (Bar Chart) */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building className="h-4 w-4 text-indigo-400" />
              <span>Revenue & Profit (USD Billions)</span>
            </h3>

            <div className="h-64 w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.financials.revenueHistory} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="year" stroke="rgba(255, 255, 255, 0.4)" fontSize={10} />
                    <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Bar dataKey="revenue" fill="#6366f1" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netIncome" fill="#10b981" name="Net Income" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Financial Indicators Grid */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
            Key Financial Indicators
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { label: 'Revenue Growth', val: `${report.financials.revenueGrowth}%`, trend: report.financials.revenueGrowth >= 0 },
              { label: 'Profit Growth', val: `${report.financials.profitGrowth}%`, trend: report.financials.profitGrowth >= 0 },
              { label: 'Debt/Equity Ratio', val: report.financials.debtToEquity, trend: report.financials.debtToEquity <= 1.0 },
              { label: 'Operating Margin', val: `${report.financials.operatingMargin}%`, trend: true },
              { label: 'Free Cash Flow', val: report.financials.freeCashFlow, trend: true },
              { label: 'PE Ratio', val: report.financials.peRatio, trend: report.financials.peRatio < 35 },
              { label: 'Earnings Per Share', val: `$${report.financials.eps}`, trend: true }
            ].map((ind, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  {ind.label}
                </span>
                <span className="text-lg font-extrabold text-white block">
                  {ind.val}
                </span>
                <span className={`text-[10px] font-semibold mt-1 inline-block ${
                  ind.trend ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {ind.trend ? 'Satisfactory' : 'Stretched'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT Analysis Quadrants */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
            SWOT Analysis Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block mb-3">
                Strengths
              </span>
              <ul className="space-y-2">
                {Array.isArray(report.swot?.strengths) ? (
                  report.swot.strengths.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-400 select-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 italic">No strengths logged.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-5">
              <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider block mb-3">
                Weaknesses
              </span>
              <ul className="space-y-2">
                {Array.isArray(report.swot?.weaknesses) ? (
                  report.swot.weaknesses.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                      <span className="text-rose-400 select-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 italic">No weaknesses logged.</li>
                )}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-5">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block mb-3">
                Opportunities
              </span>
              <ul className="space-y-2">
                {Array.isArray(report.swot?.opportunities) ? (
                  report.swot.opportunities.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 select-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 italic">No opportunities logged.</li>
                )}
              </ul>
            </div>

            {/* Threats */}
            <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-5">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-3">
                Threats
              </span>
              <ul className="space-y-2">
                {Array.isArray(report.swot?.threats) ? (
                  report.swot.threats.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-400 select-none mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 italic">No threats logged.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Competitor Comparison Grid */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
            Competitor Comparison Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-3 font-semibold uppercase">Company</th>
                  <th className="py-3 font-semibold uppercase">Ticker</th>
                  <th className="py-3 font-semibold uppercase">Market Cap</th>
                  <th className="py-3 font-semibold uppercase">PE Ratio</th>
                  <th className="py-3 font-semibold uppercase">Revenue</th>
                  <th className="py-3 font-semibold uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Active company */}
                <tr className="bg-indigo-500/5 font-bold text-white">
                  <td className="py-3.5 pr-4 flex items-center gap-2">
                    <span>{report.company.name}</span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">Active</span>
                  </td>
                  <td className="py-3.5 font-mono text-indigo-400">{report.company.ticker}</td>
                  <td className="py-3.5">{report.company.marketCap}</td>
                  <td className="py-3.5">{report.financials.peRatio}</td>
                  <td className="py-3.5">{report.company.revenue}</td>
                  <td className="py-3.5">{report.financials.operatingMargin}%</td>
                </tr>
                {/* Competitors */}
                {Array.isArray(report.competitors) && report.competitors.map((comp) => (
                  <tr key={comp.ticker} className="text-gray-300">
                    <td className="py-3.5 pr-4 font-medium">{comp.name}</td>
                    <td className="py-3.5 font-mono text-gray-500">{comp.ticker}</td>
                    <td className="py-3.5">{comp.marketCap}</td>
                    <td className="py-3.5">{comp.peRatio}</td>
                    <td className="py-3.5">{comp.revenue}</td>
                    <td className="py-3.5">{comp.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Risk Analysis Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Detailed Risks */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
                Agent 4: Detailed Risk Evaluation
              </h3>
              
              <div className="space-y-4 text-xs">
                {[
                  { label: 'Business Risk', desc: report.risk?.businessRisk || 'No critical factors identified.' },
                  { label: 'Market Risk', desc: report.risk?.marketRisk || 'No critical factors identified.' },
                  { label: 'Regulatory Risk', desc: report.risk?.regulatoryRisk || 'No critical factors identified.' },
                  { label: 'Technology Risk', desc: report.risk?.technologyRisk || 'No critical factors identified.' },
                  { label: 'Financial Risk', desc: report.risk?.financialRisk || 'No critical factors identified.' }
                ].map((item) => (
                  <div key={item.label} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-bold text-white block">{item.label}</span>
                    <p className="text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* News Sentiment analysis */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
              Agent 3: Financial News Sentiment Feed
            </h3>

            <div className="space-y-4">
              {Array.isArray(report.news) ? (
                report.news.map((item, idx) => {
                  const isPos = item.sentiment === 'positive';
                  const isNeg = item.sentiment === 'negative';
                  return (
                    <div key={idx} className="rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold text-gray-500">
                          {item.source} • {item.date}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase border ${
                          isPos 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isNeg
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}>
                          {item.sentiment}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 italic">No news feeds available for this asset.</p>
              )}
            </div>
          </div>
        </div>

        {/* Floating action buttons */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Ask Follow-up floating button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex h-12 items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 px-5 shadow-2xl text-sm font-semibold text-white shadow-indigo-500/30 transition-all duration-300"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span>Consult AI Advisor</span>
          </button>
        </div>

        {/* Floating Chat Drawer */}
        <ChatPanel 
          reportContext={report} 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />

        {/* Watchlist Sidebar */}
        <WatchlistSidebar
          isOpen={isWatchlistOpen}
          onClose={() => setIsWatchlistOpen(false)}
          watchlist={watchlist}
          onRemove={handleRemoveWatchlistItem}
        />
      </main>

      <Footer />
    </div>
  );
}
