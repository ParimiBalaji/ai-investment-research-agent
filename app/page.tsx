'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, TrendingUp, ShieldAlert, Sparkles, MessageSquare, Layers, Award } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getMockReport } from '@/services/mockData';

export default function Home() {
  const [activePreview, setActivePreview] = useState<'AAPL' | 'MSFT' | 'TSLA'>('AAPL');

  // Load selected preview data from mock database
  const report = getMockReport(activePreview);
  const isInvest = report.recommendation.decision === 'INVEST';

  // Get the first paragraph of the investment thesis (removes markdown formatting for simple preview)
  const thesisParagraph = report.recommendation.reasoning
    .split('\n\n')[0]
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#/g, '');

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#030712]">
      {/* Decorative ambient glowing background blur elements */}
      <div className="glow-bg absolute top-[-10%] left-[5%] h-[400px] w-[400px] bg-indigo-500/10 blur-[100px]" />
      <div className="glow-bg absolute bottom-[20%] right-[-10%] h-[500px] w-[500px] bg-violet-600/10 blur-[120px]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-8">
          <div className="text-center">
            {/* Tagline */}
            <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-1 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Multi-Agent AI</span>
            </div>

            {/* Main Header */}
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
              Automated Investment Research Agent
            </h1>

            {/* Subtext */}
            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
              Perform institutional-grade corporate audits in seconds. Our autonomous multi-agent LangGraph network processes financials, crawls news sentiment, maps SWOT quadrants, and provides transparent investment theses.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all duration-200"
              >
                <span>Launch Research Suite</span>
                <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/compare"
                className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <span>Compare Assets</span>
              </Link>
            </div>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative mt-16 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-gray-900/40 p-2 shadow-2xl backdrop-blur-md">
            <div className="rounded-xl border border-white/5 bg-gray-950 p-6">
              
              {/* Tab Selectors for dynamic preview */}
              <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-2">Interactive Preview:</span>
                {(['AAPL', 'MSFT', 'TSLA'] as const).map((ticker) => {
                  const isSelected = activePreview === ticker;
                  const names = { AAPL: 'Apple', MSFT: 'Microsoft', TSLA: 'Tesla' };
                  return (
                    <button
                      key={ticker}
                      type="button"
                      onClick={() => setActivePreview(ticker)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                          : 'border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {names[ticker]} ({ticker})
                    </button>
                  );
                })}
              </div>

              {/* Mockup Output Display */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-6 gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-indigo-400 border border-indigo-500/20 font-bold text-sm">
                    {report.company.ticker}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{report.company.name}</h2>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold border ${
                        isInvest 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {report.recommendation.decision}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{report.company.industry} | {report.company.hq}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Stock Price</span>
                    <p className="text-lg font-bold text-white mt-0.5">
                      ${report.company.stockPrice}{' '}
                      <span className={`text-xs font-semibold ml-1 ${
                        (report.company.stockChange || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {(report.company.stockChange || 0) >= 0 ? '+' : ''}{report.company.stockChange}%
                      </span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Overall Score</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Award className="h-5 w-5 text-indigo-400" />
                      <p className="text-lg font-bold text-white">{report.recommendation.scores.overall}/100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fake Dashboard Body Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Left Card: Thesis */}
                <div className="md:col-span-2 rounded-xl border border-white/5 bg-white/5 p-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent 5: Executive Investment Thesis</h3>
                  <div className="mt-3 text-xs text-gray-300 space-y-3 leading-relaxed">
                    <p>{thesisParagraph}</p>
                  </div>
                </div>

                {/* Right Card: Ratings */}
                <div className="rounded-xl border border-white/5 bg-white/5 p-5 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Investment Metrics</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Growth Score', score: report.recommendation.scores.growth },
                      { label: 'Risk Safety', score: report.recommendation.scores.risk },
                      { label: 'Valuation Entry', score: report.recommendation.scores.valuation },
                      { label: 'Financial Health', score: report.recommendation.scores.financial }
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{metric.label}</span>
                          <span className="font-semibold text-white">{metric.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for Deep Financial Audits
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400">
              InsideIIM Altuni Labs leverages a sequential state-graph architecture to perform exhaustive corporate evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
            {[
              {
                icon: Cpu,
                title: 'LangGraph Orchestration',
                desc: 'Uses LangGraph state annotations to carry corporate parameters across five specialized agents sequentially.'
              },
              {
                icon: TrendingUp,
                title: 'Financial Margin Charts',
                desc: 'Analyzes 4-year revenue grids, net incomes, and operating margins using beautiful interactive Recharts.'
              },
              {
                icon: ShieldAlert,
                title: 'Risk & SWOT Quadrants',
                desc: 'Identifies technical, business, and regulatory risks, plotting them alongside SWOT matrix items.'
              },
              {
                icon: MessageSquare,
                title: 'Consultative AI Chat',
                desc: 'Ask follow-up questions about the generated report, powered by conversational memory.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-6 flex flex-col items-start text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works timeline */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How the Multi-Agent Core Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative">
            {[
              {
                step: '01',
                title: 'Ingestion & Identification',
                desc: 'Input any company name. The researcher agent identifies its ticker symbol, HQ, CEO, and core product divisions.'
              },
              {
                step: '02',
                title: 'Cross-Agent Fact Synthesis',
                desc: 'Financials, news sentiment crawlers, and risk models parse historical sheets and news stories in tandem.'
              },
              {
                step: '03',
                title: 'Executive Advisory Decides',
                desc: 'The Portfolio Manager agent synthesizes reports, outputs scores, and compiles a definitive buy or pass decision.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative rounded-xl border border-white/5 bg-white/5 p-6 text-left">
                <span className="text-4xl font-extrabold text-indigo-500/20 absolute right-6 top-6">{step.step}</span>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Block */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="glow-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 bg-indigo-500/10 blur-[80px]" />
            <h2 className="text-2xl font-bold text-white sm:text-3xl relative z-10">Ready to audit your next asset?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400 relative z-10">
              Get detailed recommendations and structural corporate research now.
            </p>
            <div className="mt-8 relative z-10">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-8 font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors"
              >
                Launch Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
