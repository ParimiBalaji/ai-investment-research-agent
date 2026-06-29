'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, Sparkles, User, Loader2 } from 'lucide-react';
import { ResearchReport, ChatMessage } from '../../types';

interface ChatPanelProps {
  reportContext: ResearchReport;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ reportContext, isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat greetings
  useEffect(() => {
    if (reportContext) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi there! I've finalized my analysis on **${reportContext.company.name} (${reportContext.company.ticker})**. Based on our multi-agent model, I gave an **${reportContext.recommendation.decision}** decision with **${reportContext.recommendation.confidence}%** confidence. \n\nFeel free to ask me follow-up questions! For example:\n* *What are the biggest tech risks they face?*\n* *Explain their operating margins compared to competitors.*\n* *Are their news sentiments mostly positive?*`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [reportContext]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          reportContext,
          chatHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your question. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] flex flex-col rounded-2xl border border-white/10 bg-gray-950/95 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 rounded-t-2xl bg-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">AI Research Consultant</h3>
            <span className="text-[10px] text-gray-400 font-medium">Consulting: {reportContext.company.ticker}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div className={`flex flex-col max-w-[78%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
              }`}>
                {/* Parse basic markdown like bold or bullet lists */}
                <div className="whitespace-pre-line">
                  {m.content.split('\n').map((line, lIdx) => {
                    // Simple check for bullet items
                    if (line.trim().startsWith('* ')) {
                      return <li key={lIdx} className="ml-2 list-disc mt-0.5">{line.trim().substring(2)}</li>;
                    }
                    // Simple check for bold formatting **bold**
                    const parts = line.split('**');
                    if (parts.length > 1) {
                      return (
                        <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-white">{p}</strong> : p)}
                        </p>
                      );
                    }
                    return <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>{line}</p>;
                  })}
                </div>
              </div>
              {isUser && (
                <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/20 text-indigo-400">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 px-3.5 py-2 text-xs text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-gray-900/60 rounded-b-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="w-full rounded-xl border border-white/5 bg-gray-950 px-4 py-2.5 pr-10 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2.5 rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-500 disabled:bg-white/5 disabled:text-gray-500 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
export default ChatPanel;
