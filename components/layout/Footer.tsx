import React from 'react';
import { Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Info */}
          <div className="flex items-center gap-2">
            <Cpu className="h-4.5 w-4.5 text-indigo-500" />
            <span className="text-sm font-semibold text-gray-400">
              InsideIIM Altuni Labs &copy; {new Date().getFullYear()}
            </span>
          </div>

          {/* Center text / stack */}
          <div className="text-xs text-gray-500">
            Powered by Next.js 15, LangGraph.js, and Google Gemini 2.5 Flash
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a
              href="https://altunilabs.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Altuni AI Labs
            </a>
            <span className="text-gray-700">|</span>
            <span className="text-gray-400 select-none">
              Production-Grade Investment Agent
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
