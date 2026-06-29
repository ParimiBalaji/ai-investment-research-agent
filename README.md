# AI Investment Research Agent

A production-ready Multi-Agent Investment Research platform designed by InsideIIM Altuni Labs. This system automates exhaustive company evaluations, analyzes balance sheets, crawls recent news sentiments, maps SWOT matrices, and outputs transparent, structured investment recommendations with an executive thesis.

---

## 1. Overview
The **AI Investment Research Agent** is a professional financial intelligence terminal. Users enter any company name or stock ticker (e.g. AAPL, NVIDIA, TSLA), triggering a group of 5 cooperative AI agents implemented as a state graph using **LangGraph.js** and **Gemini 2.5 Flash**. 

Instead of simple answers, the platform provides institutional-grade reasoning, complete with interactive Recharts timelines, SWOT matrices, competitor comparison grids, risk assessments, and interactive conversational follow-ups.

---

## 2. Key Features
- **LangGraph Multi-Agent Workflow**: Processes research sequentially through 5 specialized agents.
- **Glassmorphic default dark UI**: Sleek, Vercel-like aesthetics with micro-animations and glowing highlights.
- **High-Fidelity Recharts Data**: Displays 6-month historical stock prices and 4-year revenue vs net income comparisons.
- **Automated SWOT & Competitor Overlays**: Cross-compares assets with key rivals.
- **Star Watchlist & Search History**: Save assets locally to view recommendation summaries directly on the dashboard.
- **Asset Compare Suite**: Side-by-side comparative table overlays for two tickers.
- **Interactive AI Chat Consultant**: Conversational drawer referencing the compiled report context.
- **Multi-Format Report Export**: Print directly to print-optimized PDF, download as Markdown, or copy to clipboard.
- **Zero-Key Hydration Safeguard**: Automatically falls back to premium mock databases if API credentials are not set, ensuring a perfect demo experience.

---

## 3. Architecture & How the AI Agent Works
We utilize a sequential **StateGraph** architecture from **LangGraph.js** to manage state updates across agents:

```
[User Input] 
     │
     ▼
[Researcher Agent] ──► Extracts company profile details, industry, CEO, and headquarters
     │
     ▼
[Financial Analyst] ──► Compiles 4-year financial records, PE multiples, margins, and EPS
     │
     ▼
[News Sentiment] ──► Crawls recent stories, summaries, and tags positive/negative weightings
     │
     ▼
[Risk & SWOT Modeler] ──► Evaluates operational, tech, and regulatory risks; outlines SWOT matrix
     │
     ▼
[Investment Advisor] ──► Synthesizes findings, scores individual indices, writes final thesis
```

Each agent acts as a node in the graph, appending its generated JSON structure to the global state. The final node produces the consolidated `ResearchReport` JSON schema.

---

## 4. Tech Stack
- **Frontend**: Next.js 15 (App Router, React 19 compatibility), TypeScript, Tailwind CSS, Framer Motion, Lucide React Icons.
- **Backend API**: Next.js App Router API Routes.
- **AI Agent Core**: LangGraph.js, LangChain.js.
- **LLM Engine**: Google Gemini 2.5 Flash (via `@google/generative-ai` SDK).
- **Visualization**: Recharts (with hydration safety guards).

---

## 5. Folder Structure
The codebase uses a modular, feature-based architecture to separate backend intelligence from UI layout components:

```
├── app/                        # Next.js Pages & Routing
│   ├── api/                    # Backend API Gateways (research & chat)
│   ├── dashboard/              # Primary Search and History Panel
│   ├── research/[ticker]/      # Dynamic Reports & Progress checklist
│   ├── compare/                # Side-by-Side Comparison Tool
│   ├── layout.tsx              # Global Theme Context & Providers
│   └── globals.css             # Design Tokens and Glassmorphic themes
├── components/                 # Global UI Layout Components
│   └── layout/                 # Navbar, Footer
├── features/                   # Core Feature-Specific Modules
│   ├── landing/                # Hero layout and feature widgets
│   ├── watchlist/              # Local storage watchlist panels
│   └── chat/                   # Floating Chat consultant drawers
├── hooks/                      # Custom hooks (useLocalStorage)
├── lib/                        # Global SDK configurations (gemini, langgraph)
├── services/                   # Data retrieval & fallback mock databases
├── types/                      # TypeScript Interface declarations
└── utils/                      # Helper Exporters (pdf-generator, class name mergers)
```

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm package manager

### Steps
1. **Clone or unzip** the directory into your local workspace.
2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: The `--legacy-peer-deps` flag is recommended to resolve React 19 peer dependencies in packages like Recharts).*
3. **Configure Environment variables**:
   Create a `.env.local` file at the root of the workspace and input your Gemini credentials:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open local terminal**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 7. Key Decisions & Trade-Offs

- **Print-to-PDF vs. PDF Libraries**: Instead of using heavy server-side PDF generators like Puppeteer or canvas rasterizers that pixelate text, we implemented native browser printing triggers (`window.print()`) combined with customized CSS `@media print` stylesheets. When a user exports, all interactive components (headers, chat, search trays) are hidden, and the grids restructure into clean corporate documents optimized for standard A4 sheets.
- **Hydration Mounting for Charts**: Recharts relies heavily on browser DOM properties. When rendered in Next.js Server Components, this causes hydration warnings. We solved this by adding mount-hydration checkpoints (`isMounted` states) before drawing charts, ensuring clean builds.
- **Automatic Model Routing (NVIDIA & Google)**: In `lib/gemini.ts`, we added smart routing. If the provided API key begins with `nvapi-`, the platform automatically reroutes execution to NVIDIA's high-capacity cloud endpoints running Meta's Llama 3.1 70B. If it is a Google key, it runs Gemini. This protects the developer against Google's Free Tier 15 requests/minute rate limit.
- **Zero-Key Resiliency**: If the API key is missing or rate-limited (returning 429 or 503 errors), the backend catches the error and serves dynamic, high-fidelity mock reports for key corporations (Apple, Microsoft, Tesla, etc.) or synthesizes mathematically valid numbers for custom names. This ensures the application remains testable out-of-the-box.

---

## 8. Example Runs & Agent Outputs

Our agents compile a consistent structured data model on search:
*   **Apple Inc. (AAPL)**:
    *   **Verdict**: `INVEST` (Confidence: 88%)
    *   **Thesis**: Strong ecosystem lock-in, high-margin Services division (representing 25%+ of top-line revenue), and a massive upgrade cycle driven by Apple Intelligence offset short-term antitrust friction.
    *   **Scores**: Growth (72%), Risk Safety (85%), Valuation (60%), Financial Health (95%).
*   **Tesla Inc. (TSLA)**:
    *   **Verdict**: `PASS` (Confidence: 61%)
    *   **Thesis**: High multiple valuation (P/E at 52.4x) combined with compressed EV margins due to global price wars warrants a cautious, hold-off approach.
    *   **Scores**: Growth (68%), Risk Safety (55%), Valuation (38%), Financial Health (70%).
*   **Microsoft Corp (MSFT)**:
    *   **Verdict**: `INVEST` (Confidence: 93%)
    *   **Thesis**: Absolute dominance in enterprise SaaS, sticky Azure Cloud workloads, and immediate monetization paths of Office 365 Copilot tools justify its premium multiple.

---

## 9. What We Would Improve With More Time

1.  **Search Grounding API Tools**: Add Tavily Search or Google Search grounding directly inside the LangGraph node definitions so the Llama/Gemini models can pull the absolute latest live stock quotes and real-time news stories.
2.  **Interactive Technical Indicators**: Add overlays for technical indicators (SMA, EMA, RSI) on the Recharts Area charts to help users perform charts-based analysis.
3.  **Database Persistence**: Store watchlists and recent audits inside a persistent database (e.g. Supabase, MongoDB) rather than local storage to support multi-device user syncing.
4.  **Audio Reports**: Add Text-to-Speech (TTS) triggers so users can listen to the AI Advisor read the compiled investment thesis.

---

## 10. Bonus: LLM Chat Transcript & logs

To view the full chronological pair programming history between the Developer and the AI Engineer while building this project, open:
📄 **[LLM_CHAT_TRANSCRIPT.md](file:///C:/Users/gandh/OneDrive/Desktop/InsideIIM/LLM_CHAT_TRANSCRIPT.md)**

This document provides insight into the developer's thought process, architectural choices, and iterative debugging steps.
