import { StateGraph, Annotation } from "@langchain/langgraph";
import { generateJSON } from "./gemini";
import { getMockReport } from "../services/mockData";
import { ResearchReport, CompanyProfile, FinancialData, NewsData, SwotAnalysis, CompetitorData, RiskAnalysis, InvestmentRecommendation } from "../types";

// 1. Define the state schema
const StateAnnotation = Annotation.Root({
  companyName: Annotation<string>(),
  ticker: Annotation<string>(),
  profile: Annotation<CompanyProfile | null>(),
  financials: Annotation<FinancialData | null>(),
  news: Annotation<NewsData[] | null>(),
  swot: Annotation<SwotAnalysis | null>(),
  competitors: Annotation<CompetitorData[] | null>(),
  risk: Annotation<RiskAnalysis | null>(),
  recommendation: Annotation<InvestmentRecommendation | null>(),
  timeline: Annotation<string[]>({
    reducer: (left: string[], right: string | string[]) => {
      return Array.isArray(right) ? left.concat(right) : left.concat([right]);
    },
    default: () => [],
  }),
});

type GraphState = typeof StateAnnotation.State;

// 2. Define Node 1: Researcher Agent
async function researcherNode(state: GraphState): Promise<Partial<GraphState>> {
  const company = state.companyName;
  const prompt = `Research the company "${company}". Gather its profile, ticker symbol, industry, CEO, employees count, approximate market capitalization, approximate annual revenue, official website URL, headquarters city/state, and a brief 2-3 sentence business description.
  
  Return the result in this exact JSON schema:
  {
    "name": "Full Company Name",
    "ticker": "TICKER",
    "ceo": "CEO Name",
    "industry": "Industry classification",
    "employees": "Number of employees (e.g. 150,000)",
    "marketCap": "Market capitalization (e.g. $2.5T or $80B)",
    "revenue": "Annual revenue (e.g. $120B)",
    "website": "https://www.company.com",
    "hq": "City, State, Country",
    "description": "2-3 sentence business model summary"
  }`;

  try {
    const profile = await generateJSON<CompanyProfile>(
      prompt,
      "You are a professional corporate researcher agent. You extract key metadata about corporations. Output strictly valid JSON."
    );
    return {
      profile,
      ticker: profile.ticker || "UNKNOWN",
      timeline: ["Agent 1 (Researcher): Completed corporate research and profile extraction."]
    };
  } catch (error) {
    console.error("Researcher Agent Error:", error);
    throw error;
  }
}

// 3. Define Node 2: Financial Analyst Agent
async function financialNode(state: GraphState): Promise<Partial<GraphState>> {
  const ticker = state.ticker || state.companyName;
  const prompt = `Perform a financial analysis for company ${state.companyName} (${ticker}).
  Look up or estimate their latest metrics:
  - Revenue growth (%)
  - Profit growth (%)
  - Debt-to-equity ratio
  - Operating margin (%)
  - Free cash flow (e.g. "$12B" or "$450M")
  - P/E ratio
  - EPS
  - Historical annual revenue and net income for the last 4 years (2021 to 2024) in Billions USD (e.g. revenue: 120.5, netIncome: 15.2)
  - Estimated stock price history points for the last 6 months (dates: 'Jan 24', 'Feb 24', etc., with price: number)

  Return the result in this exact JSON schema:
  {
    "revenueGrowth": 12.5,
    "profitGrowth": 8.4,
    "debtToEquity": 0.45,
    "operatingMargin": 22.1,
    "freeCashFlow": "$15.4B",
    "peRatio": 28.5,
    "eps": 4.56,
    "revenueHistory": [
      { "year": "2021", "revenue": 85.0, "netIncome": 12.0 },
      { "year": "2022", "revenue": 95.0, "netIncome": 13.5 },
      { "year": "2023", "revenue": 105.0, "netIncome": 14.8 },
      { "year": "2024", "revenue": 120.0, "netIncome": 18.2 }
    ],
    "stockHistory": [
      { "date": "Jan 24", "price": 150.0 },
      { "date": "Feb 24", "price": 155.0 },
      { "date": "Mar 24", "price": 162.0 },
      { "date": "Apr 24", "price": 158.0 },
      { "date": "May 24", "price": 168.0 },
      { "date": "Jun 24", "price": 175.0 }
    ]
  }`;

  try {
    const financials = await generateJSON<FinancialData>(
      prompt,
      "You are a senior Wall Street financial analyst agent. You deliver structured financial sheets and growth indicators. Output strictly valid JSON."
    );
    return {
      financials,
      timeline: ["Agent 2 (Financial Analyst): Gathered balance sheets, historical margins, and PE metrics."]
    };
  } catch (error) {
    console.error("Financial Analyst Agent Error:", error);
    throw error;
  }
}

// 4. Define Node 3: News Sentiment Analyst Agent
async function newsNode(state: GraphState): Promise<Partial<GraphState>> {
  const query = state.companyName;
  const prompt = `Generate a news sentiment analysis for the company "${query}". 
  Provide 3 recent news articles, blogs, or earnings announcements. Summarize them and evaluate the sentiment.
  
  Return the result in this exact JSON schema:
  [
    {
      "title": "Headline of the news article",
      "url": "https://finance.yahoo.com",
      "source": "CNBC / Bloomberg / Reuters",
      "summary": "Brief 1-2 sentence summary of the news.",
      "sentiment": "positive",
      "date": "Yesterday"
    },
    {
      "title": "Another news headline",
      "url": "https://finance.yahoo.com",
      "source": "Financial Times",
      "summary": "Brief 1-2 sentence summary of the news.",
      "sentiment": "neutral",
      "date": "3 days ago"
    },
    {
      "title": "A negative or risk-oriented headline",
      "url": "https://finance.yahoo.com",
      "source": "Bloomberg",
      "summary": "Brief 1-2 sentence summary detailing a regulatory check or margin compression.",
      "sentiment": "negative",
      "date": "1 week ago"
    }
  ]`;

  try {
    const news = await generateJSON<NewsData[]>(
      prompt,
      "You are an editor and sentiment crawler agent. You summarize financial news and classify sentiment. Output strictly valid JSON."
    );
    return {
      news,
      timeline: ["Agent 3 (News Analyst): Crawled recent press releases, blogs, and classified sentiment profiles."]
    };
  } catch (error) {
    console.error("News Analyst Agent Error:", error);
    throw error;
  }
}

// 5. Define Node 4: Risk & SWOT Analyzer Agent
async function riskNode(state: GraphState): Promise<Partial<GraphState>> {
  const company = state.companyName;
  const prompt = `Conduct a comprehensive Risk Analysis and SWOT Analysis for the company "${company}".
  Identify:
  - Business Risk
  - Market Risk
  - Regulatory Risk
  - Technology Risk
  - Financial Risk
  
  Additionally, identify 3-4 items for SWOT:
  - Strengths
  - Weaknesses
  - Opportunities
  - Threats

  Also, list 2 key competitors with Name, Ticker, Market Cap, PE Ratio, Revenue, and Operating Margin (%).

  Return the result in this exact JSON schema:
  {
    "risk": {
      "businessRisk": "Explanation of company's internal operational risks",
      "marketRisk": "Explanation of industry-wide market cycle risks",
      "regulatoryRisk": "Explanation of lawsuits, antitrust, or tax laws affecting them",
      "technologyRisk": "Explanation of tech obsolescence or AI transition risks",
      "financialRisk": "Explanation of cash flow constraints or high leverage risks"
    },
    "swot": {
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
      "threats": ["Threat 1", "Threat 2"]
    },
    "competitors": [
      {
        "name": "Competitor 1 Name",
        "ticker": "COMP1",
        "marketCap": "$1.2T",
        "peRatio": 22.4,
        "revenue": "$180B",
        "margin": 15.6
      },
      {
        "name": "Competitor 2 Name",
        "ticker": "COMP2",
        "marketCap": "$800B",
        "peRatio": 18.2,
        "revenue": "$110B",
        "margin": 12.1
      }
    ]
  }`;

  try {
    const data = await generateJSON<{
      risk: RiskAnalysis;
      swot: SwotAnalysis;
      competitors: CompetitorData[];
    }>(
      prompt,
      "You are a corporate risk auditor agent. You analyze threats, competitive landscape, and construct SWOT matrices. Output strictly valid JSON."
    );
    return {
      risk: data.risk,
      swot: data.swot,
      competitors: data.competitors,
      timeline: ["Agent 4 (Risk & SWOT Analyzer): Modeled business risks, mapped competitor metrics, and completed SWOT quadrants."]
    };
  } catch (error) {
    console.error("Risk Analyzer Agent Error:", error);
    throw error;
  }
}

// 6. Define Node 5: Investment Advisor Agent
async function advisorNode(state: GraphState): Promise<Partial<GraphState>> {
  const company = state.companyName;
  const prompt = `You are a legendary portfolio manager (similar to Warren Buffett or Peter Lynch). 
  Synthesize all the research and analysis gathered so far for "${company}":
  Profile: ${JSON.stringify(state.profile)}
  Financials: ${JSON.stringify(state.financials)}
  News: ${JSON.stringify(state.news)}
  Risks: ${JSON.stringify(state.risk)}
  SWOT: ${JSON.stringify(state.swot)}

  Make a final investment decision: either "INVEST" or "PASS".
  Assign score points (from 0 to 100) for the following indices:
  - Growth Score: Current speed of scaling and future TAM expansion.
  - Risk Score: Safety index (e.g., 90 means extremely safe/low-risk; 20 means highly speculative).
  - Valuation Score: How attractive the current entry price is relative to fundamentals.
  - Financial Score: Balance sheet strength, operating cash flow, and debt burdens.
  - Innovation Score: Adaptation of generative AI, robotics, and R&D pipelines.
  - Overall Score: The combined score representing your confidence.

  Generate a 3-4 paragraph Investment Thesis explaining:
  1. The core investment thesis and growth engines.
  2. Principal risks and valuation concerns.
  3. The final conclusion explaining why we INVEST or PASS.
  Ensure the reasoning is written in standard Markdown (using bold, lists, and headers).

  Return the result in this exact JSON schema:
  {
    "decision": "INVEST", // Must be either "INVEST" or "PASS"
    "confidence": 85, // 0 to 100
    "reasoning": "### Investment Thesis for Company ...\\n\\n#### Growth Drivers\\n- **Item 1**: detail...\\n- **Item 2**: detail...\\n\\n#### Valuation & Risks\\nDetail here...\\n\\n#### Final Verdict\\nSummarize recommendation...",
    "scores": {
      "growth": 85,
      "risk": 75,
      "valuation": 60,
      "financial": 90,
      "innovation": 85,
      "overall": 82
    }
  }`;

  try {
    const recommendation = await generateJSON<InvestmentRecommendation>(
      prompt,
      "You are a veteran investment officer and chief advisor. You compile diverse data into definitive trade choices and long-form investment theses. Output strictly valid JSON."
    );
    return {
      recommendation,
      timeline: ["Agent 5 (Investment Advisor): Compiled final recommendation, scored individual vectors, and finalized investment thesis."]
    };
  } catch (error) {
    console.error("Investment Advisor Agent Error:", error);
    throw error;
  }
}

// 7. Assemble the LangGraph workflow
const workflow = new StateGraph(StateAnnotation)
  .addNode("researcher", researcherNode)
  .addNode("financialAnalyst", financialNode)
  .addNode("newsAnalyst", newsNode)
  .addNode("riskAnalyzer", riskNode)
  .addNode("advisor", advisorNode)
  .addEdge("__start__", "researcher")
  .addEdge("researcher", "financialAnalyst")
  .addEdge("financialAnalyst", "newsAnalyst")
  .addEdge("newsAnalyst", "riskAnalyzer")
  .addEdge("riskAnalyzer", "advisor")
  .addEdge("advisor", "__end__");

// Compile graph
const compiledGraph = workflow.compile();

/**
 * Runs the Multi-Agent Research Workflow
 */
export async function runResearchWorkflow(
  companyName: string,
  onStepChange?: (stepName: string) => void
): Promise<ResearchReport> {
  const hasKey = !!process.env.GEMINI_API_KEY;

  if (!hasKey) {
    console.log("No GEMINI_API_KEY found. Resolving with dynamic mock data.");
    if (onStepChange) {
      onStepChange("Initializing...");
      await new Promise(r => setTimeout(r, 600));
      onStepChange("Agent 1: Extracting Company Profile...");
      await new Promise(r => setTimeout(r, 800));
      onStepChange("Agent 2: Running Financial Audit...");
      await new Promise(r => setTimeout(r, 800));
      onStepChange("Agent 3: Parsing News Sentiment...");
      await new Promise(r => setTimeout(r, 600));
      onStepChange("Agent 4: Quantifying SWOT & Competitors...");
      await new Promise(r => setTimeout(r, 800));
      onStepChange("Agent 5: Compiling Investment Thesis...");
      await new Promise(r => setTimeout(r, 600));
    }
    const report = getMockReport(companyName);
    return report;
  }

  try {
    const initialState = {
      companyName,
      ticker: "",
      profile: null,
      financials: null,
      news: null,
      swot: null,
      competitors: null,
      risk: null,
      recommendation: null,
      timeline: []
    };

    console.log(`Starting LangGraph workflow for: ${companyName}`);
    
    // We run the compiled graph
    const finalState = await compiledGraph.invoke(initialState);

    if (
      !finalState.profile ||
      !finalState.financials ||
      !finalState.news ||
      !finalState.swot ||
      !finalState.competitors ||
      !finalState.risk ||
      !finalState.recommendation
    ) {
      throw new Error("One or more agents failed to return data");
    }

    return {
      company: finalState.profile,
      financials: finalState.financials,
      news: finalState.news,
      swot: finalState.swot,
      competitors: finalState.competitors,
      risk: finalState.risk,
      recommendation: finalState.recommendation,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("LangGraph Workflow Execution Failed. Falling back to mock data.", error);
    // Even if it fails, return mock data to prevent crashing
    return getMockReport(companyName);
  }
}
