export interface CompanyProfile {
  name: string;
  ticker: string;
  ceo: string;
  industry: string;
  employees: string | number;
  marketCap: string;
  revenue: string;
  website: string;
  hq: string;
  description: string;
  logoUrl?: string;
  stockPrice?: number;
  stockChange?: number;
}

export interface FinancialDataPoint {
  year: string;
  revenue: number; // in Billions USD
  netIncome: number; // in Billions USD
}

export interface StockPricePoint {
  date: string;
  price: number;
}

export interface FinancialData {
  revenueGrowth: number; // percentage
  profitGrowth: number; // percentage
  debtToEquity: number;
  operatingMargin: number; // percentage
  freeCashFlow: string; // e.g. "$15B"
  peRatio: number;
  eps: number;
  revenueHistory: FinancialDataPoint[];
  stockHistory: StockPricePoint[];
}

export interface NewsData {
  title: string;
  url: string;
  source: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorData {
  name: string;
  ticker: string;
  marketCap: string;
  peRatio: number | string;
  revenue: string;
  margin: number; // percentage
}

export interface RiskAnalysis {
  businessRisk: string;
  marketRisk: string;
  regulatoryRisk: string;
  technologyRisk: string;
  financialRisk: string;
}

export interface InvestmentScores {
  growth: number; // 0-100
  risk: number; // 0-100
  valuation: number; // 0-100
  financial: number; // 0-100
  innovation: number; // 0-100
  overall: number; // 0-100
}

export interface InvestmentRecommendation {
  decision: 'INVEST' | 'PASS';
  confidence: number; // 0-100
  reasoning: string; // markdown content
  scores: InvestmentScores;
}

export interface ResearchReport {
  company: CompanyProfile;
  financials: FinancialData;
  news: NewsData[];
  swot: SwotAnalysis;
  competitors: CompetitorData[];
  risk: RiskAnalysis;
  recommendation: InvestmentRecommendation;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
