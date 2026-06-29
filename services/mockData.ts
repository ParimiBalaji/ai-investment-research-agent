import { ResearchReport, CompanyProfile, FinancialData, NewsData, SwotAnalysis, CompetitorData, RiskAnalysis, InvestmentRecommendation } from '../types';

// Helper to format market caps
const formatNumber = (num: number, suffix = 'B') => `$${num.toFixed(1)}${suffix}`;

export const COMPANY_MAPPING: Record<string, { ticker: string; name: string }> = {
  apple: { ticker: 'AAPL', name: 'Apple Inc.' },
  tesla: { ticker: 'TSLA', name: 'Tesla, Inc.' },
  microsoft: { ticker: 'MSFT', name: 'Microsoft Corporation' },
  nvidia: { ticker: 'NVDA', name: 'NVIDIA Corporation' },
  google: { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  alphabet: { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  amazon: { ticker: 'AMZN', name: 'Amazon.com, Inc.' },
  meta: { ticker: 'META', name: 'Meta Platforms, Inc.' },
  facebook: { ticker: 'META', name: 'Meta Platforms, Inc.' },
  netflix: { ticker: 'NFLX', name: 'Netflix, Inc.' }
};

export function getMockReport(query: string): ResearchReport {
  const cleanQuery = query.toLowerCase().trim();
  let matchedTicker = 'GENERIC';
  let matchedName = query;

  // Check mapping
  for (const [key, val] of Object.entries(COMPANY_MAPPING)) {
    if (cleanQuery.includes(key) || cleanQuery.includes(val.ticker.toLowerCase())) {
      matchedTicker = val.ticker;
      matchedName = val.name;
      break;
    }
  }

  if (matchedTicker === 'GENERIC') {
    // Generate clean initials for ticker
    const words = query.split(/\s+/);
    matchedTicker = words.map(w => w[0]?.toUpperCase()).join('').substring(0, 4);
    if (matchedTicker.length < 2) matchedTicker = (query.substring(0, 3).toUpperCase());
  }

  const reports: Record<string, Omit<ResearchReport, 'timestamp'>> = {
    AAPL: {
      company: {
        name: 'Apple Inc.',
        ticker: 'AAPL',
        ceo: 'Tim Cook',
        industry: 'Consumer Electronics & Software',
        employees: '164,000',
        marketCap: '$3.45T',
        revenue: '$391.0B',
        website: 'https://www.apple.com',
        hq: 'Cupertino, California',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company is transitioning heavily into services and embedding AI (Apple Intelligence) across its hardware ecosystem.',
        stockPrice: 215.34,
        stockChange: 1.45
      },
      financials: {
        revenueGrowth: 5.6,
        profitGrowth: 8.2,
        debtToEquity: 1.4,
        operatingMargin: 30.7,
        freeCashFlow: '$104B',
        peRatio: 31.2,
        eps: 6.45,
        revenueHistory: [
          { year: '2021', revenue: 365.8, netIncome: 94.68 },
          { year: '2022', revenue: 394.3, netIncome: 99.80 },
          { year: '2023', revenue: 383.3, netIncome: 96.99 },
          { year: '2024', revenue: 391.0, netIncome: 100.30 }
        ],
        stockHistory: [
          { date: 'Jan 24', price: 185 },
          { date: 'Feb 24', price: 180 },
          { date: 'Mar 24', price: 172 },
          { date: 'Apr 24', price: 169 },
          { date: 'May 24', price: 190 },
          { date: 'Jun 24', price: 210 },
          { date: 'Jul 24', price: 218 }
        ]
      },
      news: [
        {
          title: 'Apple rolls out first set of Apple Intelligence features',
          url: 'https://finance.yahoo.com',
          source: 'TechCrunch',
          summary: 'Apple officially released iOS 18.1, marking the public debut of Apple Intelligence features. Analysts are optimistic that AI integration will drive a supercycle for iPhone upgrades.',
          sentiment: 'positive',
          date: 'Yesterday'
        },
        {
          title: 'Antitrust regulators target Apple App Store policies in EU',
          url: 'https://finance.yahoo.com',
          source: 'Bloomberg',
          summary: 'The European Commission is pressing Apple over anti-steering policies in its App Store. Regulators claim Apple is restricting developers from pointing customers to cheaper offers outside the App Store.',
          sentiment: 'negative',
          date: '3 days ago'
        },
        {
          title: 'Apple reports solid Q3 earnings, beating expectations on Services growth',
          url: 'https://finance.yahoo.com',
          source: 'CNBC',
          summary: 'Apple Q3 revenue rose 5% year-over-year, driven by record services revenue and stabilizing iPhone sales, beating analyst estimates.',
          sentiment: 'positive',
          date: '1 week ago'
        }
      ],
      swot: {
        strengths: [
          'High brand loyalty and sticky ecosystem lock-in (iOS, macOS, Services).',
          'Premium pricing power driving industry-leading profit margins.',
          'Formidable cash balance ($160B+ cash & marketable securities) enabling massive buybacks.',
          'Vertically integrated hardware and Apple Silicon chips.'
        ],
        weaknesses: [
          'Heavy reliance on iPhone sales for over 50% of total revenue.',
          'Perceived slow response compared to tech peers in the Generative AI race.',
          'Increasing regulatory threats over App Store fees and ecosystem monopoly status.'
        ],
        opportunities: [
          'Ecosystem integration of Apple Intelligence driving device upgrades.',
          'Expansion of higher-margin Services division (Music, iCloud, Pay, Arcade).',
          'Market penetration in emerging markets (India, Southeast Asia).'
        ],
        threats: [
          'Geopolitical tensions affecting manufacturing supply chains in China.',
          'Intensifying competition in premium smartphone markets from local Chinese brands.',
          'Regulatory crackdowns (EU DMA, US DOJ antitrust lawsuit).'
        ]
      },
      competitors: [
        { name: 'Microsoft Corporation', ticker: 'MSFT', marketCap: '$3.28T', peRatio: 35.6, revenue: '$245.1B', margin: 44.6 },
        { name: 'Alphabet Inc.', ticker: 'GOOGL', marketCap: '$2.22T', peRatio: 24.3, revenue: '$328.2B', margin: 29.8 },
        { name: 'Samsung Electronics', ticker: 'SSNLF', marketCap: '$380B', peRatio: 14.5, revenue: '$200.4B', margin: 11.2 }
      ],
      risk: {
        businessRisk: 'Supply chain disruptions: Dependence on Foxconn and Chinese assembly plants leaves operations vulnerable to lockdowns and geopolitical friction.',
        marketRisk: 'Slowing hardware upgrade cycles: Consumers are keeping devices longer, reducing year-on-year sales acceleration.',
        regulatoryRisk: 'Monopoly and antitrust charges: DOJ and EU legal actions threaten App Store commissions and exclusivity covenants.',
        technologyRisk: 'AI execution risks: Apple Intelligence must match or exceed current competitor offerings (OpenAI, Google) to maintain hardware premiums.',
        financialRisk: 'Foreign currency translation risk due to large share of overseas sales.'
      },
      recommendation: {
        decision: 'INVEST',
        confidence: 88,
        reasoning: 'Apple Inc. remains an absolute fortress asset. Despite regulatory friction and a slower start in generative AI, Apple\'s ecosystem lock-in represents one of the strongest "economic moats" in business history. The introduction of **Apple Intelligence** will trigger a massive multi-year iPhone upgrade cycle. Financially, Apple generates peerless free cash flows, allowing Tim Cook to reward shareholders with massive stock repurchases ($110B authorized in 2024). \n\n*Valuation is slightly elevated at 31x PE*, but the premium is justified by structural stability and services expansion. Recommend a **BUY/INVEST** rating with a focus on long-term capital preservation and compound growth.',
        scores: {
          growth: 72,
          risk: 85,
          valuation: 60,
          financial: 95,
          innovation: 85,
          overall: 88
        }
      }
    },
    TSLA: {
      company: {
        name: 'Tesla, Inc.',
        ticker: 'TSLA',
        ceo: 'Elon Musk',
        industry: 'Automotive & Clean Energy',
        employees: '140,000',
        marketCap: '$680.5B',
        revenue: '$96.8B',
        website: 'https://www.tesla.com',
        hq: 'Austin, Texas',
        description: 'Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation, and storage systems. It has evolved its thesis from a pure EV manufacturer into an AI and robotics play focusing on Full Self-Driving (FSD), Optimus, and Robotaxi.',
        stockPrice: 197.80,
        stockChange: -2.31
      },
      financials: {
        revenueGrowth: 3.2,
        profitGrowth: -15.4,
        debtToEquity: 0.12,
        operatingMargin: 5.5,
        freeCashFlow: '$4.4B',
        peRatio: 52.4,
        eps: 3.78,
        revenueHistory: [
          { year: '2021', revenue: 53.8, netIncome: 5.52 },
          { year: '2022', revenue: 81.5, netIncome: 12.59 },
          { year: '2023', revenue: 96.8, netIncome: 15.00 },
          { year: '2024', revenue: 98.2, netIncome: 11.20 }
        ],
        stockHistory: [
          { date: 'Jan 24', price: 220 },
          { date: 'Feb 24', price: 190 },
          { date: 'Mar 24', price: 175 },
          { date: 'Apr 24', price: 162 },
          { date: 'May 24', price: 178 },
          { date: 'Jun 24', price: 187 },
          { date: 'Jul 24', price: 197 }
        ]
      },
      news: [
        {
          title: 'Tesla schedules Robotaxi launch event in California',
          url: 'https://finance.yahoo.com',
          source: 'Reuters',
          summary: 'CEO Elon Musk announced Tesla will showcase its Cybercab Robotaxi, claiming it will represent the shift toward autonomous networks.',
          sentiment: 'positive',
          date: 'Yesterday'
        },
        {
          title: 'EV sales slowing globally as cheap competition rises in China',
          url: 'https://finance.yahoo.com',
          source: 'Wall Street Journal',
          summary: 'BYD and other Chinese EV companies continue to capture global share, exerting pricing pressures and forcing Tesla to offer discounts.',
          sentiment: 'negative',
          date: '4 days ago'
        },
        {
          title: 'Tesla Megapack energy storage installations rise 70% YoY',
          url: 'https://finance.yahoo.com',
          source: 'Electrek',
          summary: 'Tesla Energy division emerges as a high-growth driver, with commercial utility storage contracts scaling rapidly across North America.',
          sentiment: 'positive',
          date: '2 weeks ago'
        }
      ],
      swot: {
        strengths: [
          'Industry-leading EV battery manufacturing scale and supercharger network.',
          'Pioneering autonomy software (FSD) with billions of miles of real-world driving data.',
          'Virtually zero net debt and high liquidity ($30B+ cash).',
          'Strong brand value and visionary leadership under Elon Musk.'
        ],
        weaknesses: [
          'Severe operating margin contraction due to price cuts (from 16% down to 5.5%).',
          'Aging passenger car lineup (Model 3 and Y represent the vast majority of volumes).',
          'Key-man risk: Dependency on CEO Elon Musk, whose attention is split across multiple ventures.'
        ],
        opportunities: [
          'Unlocking Autonomous Robotaxi network licensing revenues.',
          'Rapid scaling of Energy Generation and Storage (Megapack/Powerwall) division.',
          'Commercial deployment of Optimus Humanoid robots.'
        ],
        threats: [
          'Intense price wars from lower-cost Chinese manufacturers (BYD, Geely, Xiaomi).',
          'Delays in regulatory approval for Level 4/5 full autonomous driving.',
          'Economic downturn limiting consumer spending on premium electric vehicles.'
        ]
      },
      competitors: [
        { name: 'BYD Company Limited', ticker: 'BYDDF', marketCap: '$88.2B', peRatio: 18.2, revenue: '$85.3B', margin: 6.4 },
        { name: 'Toyota Motor Corp', ticker: 'TM', marketCap: '$290B', peRatio: 8.5, revenue: '$275B', margin: 10.1 },
        { name: 'NIO Inc.', ticker: 'NIO', marketCap: '$9.2B', peRatio: -3.5, revenue: '$7.8B', margin: -14.2 }
      ],
      risk: {
        businessRisk: 'Automotive margin degradation: Continued discount schemes threaten Tesla\'s tech-like margin premiums, aligning them closer to legacy auto.',
        marketRisk: 'Intensifying competition: EV market saturation and localized pricing wars limit volume growth.',
        regulatoryRisk: 'Safety investigation of Autopilot/FSD by NHTSA and global traffic authorities.',
        technologyRisk: 'Delay in true Level 5 autonomy, which would invalidate the high valuation premium.',
        financialRisk: 'High capital expenditure requirements for Gigafactory expansions and supercomputing cluster builds.'
      },
      recommendation: {
        decision: 'PASS',
        confidence: 65,
        reasoning: 'Tesla is currently in a transitional phase between two growth waves: the EV wave and the Autonomy/AI wave. While the long-term thesis on Robotaxis and Optimus is highly compelling, the short-term reality is characterized by *margin contraction (operating margins down to 5.5%)* and sluggish vehicle delivery growth. \n\nTrading at a **52x forward P/E ratio**, Tesla is priced as a high-growth tech stock while currently demonstrating legacy auto growth metrics. Until there is a clear bottoming of EV margins or regulatory verification of unsupervised FSD, the risk-reward ratio is unfavorable. We recommend a **PASS/HOLD** for now and monitoring the autonomous driving milestones.',
        scores: {
          growth: 58,
          risk: 42, // high risk = low safety score
          valuation: 35,
          financial: 78,
          innovation: 92,
          overall: 61
        }
      }
    },
    MSFT: {
      company: {
        name: 'Microsoft Corporation',
        ticker: 'MSFT',
        ceo: 'Satya Nadella',
        industry: 'Software & Cloud Services',
        employees: '228,000',
        marketCap: '$3.28T',
        revenue: '$245.1B',
        website: 'https://www.microsoft.com',
        hq: 'Redmond, Washington',
        description: 'Microsoft Corporation is a global technology leader providing software, cloud computing (Azure), enterprise services, hardware, and gaming (Xbox). Through its partnership with OpenAI, Microsoft has positioned itself at the absolute forefront of enterprise generative AI integrations.',
        stockPrice: 421.90,
        stockChange: 0.85
      },
      financials: {
        revenueGrowth: 15.6,
        profitGrowth: 22.1,
        debtToEquity: 0.42,
        operatingMargin: 44.6,
        freeCashFlow: '$70.6B',
        peRatio: 35.6,
        eps: 11.80,
        revenueHistory: [
          { year: '2021', revenue: 168.1, netIncome: 61.27 },
          { year: '2022', revenue: 198.3, netIncome: 72.74 },
          { year: '2023', revenue: 211.9, netIncome: 72.36 },
          { year: '2024', revenue: 245.1, netIncome: 88.10 }
        ],
        stockHistory: [
          { date: 'Jan 24', price: 390 },
          { date: 'Feb 24', price: 415 },
          { date: 'Mar 24', price: 420 },
          { date: 'Apr 24', price: 405 },
          { date: 'May 24', price: 415 },
          { date: 'Jun 24', price: 435 },
          { date: 'Jul 24', price: 421 }
        ]
      },
      news: [
        {
          title: 'Azure Cloud revenue surges 29% on AI workload demands',
          url: 'https://finance.yahoo.com',
          source: 'Bloomberg',
          summary: 'Microsoft reported strong growth in its intelligent cloud segment. Executives reported that AI services added 8 percentage points of growth to Azure.',
          sentiment: 'positive',
          date: 'Yesterday'
        },
        {
          title: 'FTC opens antitrust investigation into Microsoft-OpenAI deal',
          url: 'https://finance.yahoo.com',
          source: 'WSJ',
          summary: 'Regulators are looking into the structure of Microsoft\'s multi-billion dollar investment in OpenAI to determine if it bypasses merger control rules.',
          sentiment: 'negative',
          date: '1 week ago'
        }
      ],
      swot: {
        strengths: [
          'Dominant market position in enterprise software (Windows, Office, Teams).',
          'Hyper-scale cloud platform (Azure) capturing major AI infrastructure spending.',
          'Early-mover advantage in commercializing Generative AI through OpenAI (Copilots).',
          'Incredible cash flow generation supporting R&D, acquisitions, and dividends.'
        ],
        weaknesses: [
          'High valuation multiple leaves little room for execution missteps.',
          'Vulnerability to regulatory scrutiny over licensing bundles and AI partnerships.',
          'Laggard position in consumer mobile operating systems.'
        ],
        opportunities: [
          'Monetizing Copilot AI add-ons across millions of Office 365 enterprise users.',
          'Azure capturing the bulk of new start-up and enterprise AI application hosting.',
          'Gaming division expansion following the acquisition of Activision Blizzard.'
        ],
        threats: [
          'Aggressive competition in Cloud from Amazon Web Services (AWS) and Google Cloud.',
          'Open-source AI models reducing the premium pricing power of commercial models.',
          'Global economic slowdowns leading to corporate IT budget contractions.'
        ]
      },
      competitors: [
        { name: 'Amazon.com, Inc.', ticker: 'AMZN', marketCap: '$1.92T', peRatio: 40.5, revenue: '$574.8B', margin: 7.8 },
        { name: 'Alphabet Inc.', ticker: 'GOOGL', marketCap: '$2.22T', peRatio: 24.3, revenue: '$307.4B', margin: 29.8 },
        { name: 'Oracle Corporation', ticker: 'ORCL', marketCap: '$380B', peRatio: 32.1, revenue: '$52.5B', margin: 27.5 }
      ],
      risk: {
        businessRisk: 'AI cost inflation: The heavy capital expenditures required to build AI data centers could weigh on operating margins in the short term.',
        marketRisk: 'Corporate IT spend shifts: Enterprise cost optimization could slow down the adoption of newer software suites.',
        regulatoryRisk: 'Heightened scrutiny of AI partnerships and monopoly bundling practices.',
        technologyRisk: 'Rapid displacement: The fast-evolving LLM landscape could render early AI tools obsolete if competitor models outperform.',
        financialRisk: 'High sensitivity to interest rate fluctuations due to premium valuation.'
      },
      recommendation: {
        decision: 'INVEST',
        confidence: 93,
        reasoning: 'Microsoft Corporation represents the premier enterprise AI growth play. Under Satya Nadella, the company has executed a flawless transition, wrapping OpenAI\'s capabilities into its entire product stack. **Azure Cloud is expanding at 29%**, beating peers on AI workloads. \n\nFinancially, Microsoft enjoys a **44.6% operating margin** and produces massive free cash flow ($70.6B). While its **P/E of 35.6x** is not cheap, its high earnings visibility, fortress balance sheet, and leadership in SaaS and Infrastructure justify the premium. We recommend **INVEST/BUY** for a core technology position.',
        scores: {
          growth: 88,
          risk: 90, // safe
          valuation: 55,
          financial: 96,
          innovation: 95,
          overall: 93
        }
      }
    }
  };

  if (reports[matchedTicker]) {
    return {
      ...reports[matchedTicker],
      timestamp: new Date().toISOString()
    } as ResearchReport;
  }

  // Generate high-fidelity dynamic fallback report for any search queries
  const stockVal = Math.floor(50 + Math.random() * 500);
  const stockChg = +(Math.random() * 4 - 2).toFixed(2);
  const revBase = Math.floor(10 + Math.random() * 150);
  const mcapBase = +(revBase * (1.5 + Math.random() * 10)).toFixed(1);
  const peGen = +(15 + Math.random() * 35).toFixed(1);
  const epsGen = +(stockVal / peGen).toFixed(2);
  
  const isInvest = peGen < 32 && stockChg >= -1.0;
  const decision = isInvest ? 'INVEST' : 'PASS';
  const confidence = Math.floor(65 + Math.random() * 25);

  // Align scores with the investment decision
  const overall = isInvest 
    ? Math.floor(75 + Math.random() * 18) 
    : Math.floor(35 + Math.random() * 25);
  const growth = isInvest ? Math.floor(70 + Math.random() * 22) : Math.floor(30 + Math.random() * 35);
  const risk = isInvest ? Math.floor(70 + Math.random() * 20) : Math.floor(30 + Math.random() * 30);
  const valuation = isInvest ? Math.floor(55 + Math.random() * 35) : Math.floor(25 + Math.random() * 30);
  const financial = isInvest ? Math.floor(70 + Math.random() * 20) : Math.floor(35 + Math.random() * 30);
  const innovation = isInvest ? Math.floor(65 + Math.random() * 25) : Math.floor(35 + Math.random() * 30);
  
  return {
    company: {
      name: matchedName,
      ticker: matchedTicker,
      ceo: 'Jane Doe',
      industry: 'Advanced Technology & Services',
      employees: '45,000',
      marketCap: `$${mcapBase}B`,
      revenue: `$${revBase}.0B`,
      website: `https://www.${matchedName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      hq: 'New York, USA',
      description: `${matchedName} is a leading enterprise in the technology and industrial systems space, focused on delivering sustainable business solutions, developing next-generation applications, and optimizing infrastructure processes.`,
      stockPrice: stockVal,
      stockChange: stockChg
    },
    financials: {
      revenueGrowth: +(5 + Math.random() * 25).toFixed(1),
      profitGrowth: +(3 + Math.random() * 30).toFixed(1),
      debtToEquity: +(0.2 + Math.random() * 1.5).toFixed(2),
      operatingMargin: +(10 + Math.random() * 25).toFixed(1),
      freeCashFlow: `$${(revBase * 0.15).toFixed(1)}B`,
      peRatio: peGen,
      eps: epsGen,
      revenueHistory: [
        { year: '2021', revenue: +(revBase * 0.75).toFixed(1), netIncome: +(revBase * 0.75 * 0.1).toFixed(1) },
        { year: '2022', revenue: +(revBase * 0.85).toFixed(1), netIncome: +(revBase * 0.85 * 0.12).toFixed(1) },
        { year: '2023', revenue: +(revBase * 0.95).toFixed(1), netIncome: +(revBase * 0.95 * 0.11).toFixed(1) },
        { year: '2024', revenue: revBase, netIncome: +(revBase * 0.13).toFixed(1) }
      ],
      stockHistory: [
        { date: 'Jan 24', price: +(stockVal * 0.85).toFixed(1) },
        { date: 'Feb 24', price: +(stockVal * 0.9).toFixed(1) },
        { date: 'Mar 24', price: +(stockVal * 0.88).toFixed(1) },
        { date: 'Apr 24', price: +(stockVal * 0.92).toFixed(1) },
        { date: 'May 24', price: +(stockVal * 0.96).toFixed(1) },
        { date: 'Jun 24', price: stockVal }
      ]
    },
    news: [
      {
        title: `${matchedName} Announces Breakthrough Collaboration in Artificial Intelligence`,
        url: 'https://finance.yahoo.com',
        source: 'Press Release',
        summary: `The company announced a significant strategic alliance to integrate cutting-edge machine learning capabilities into its core operating systems, promising operational efficiencies.`,
        sentiment: 'positive',
        date: '2 days ago'
      },
      {
        title: `Analysts Debate Valuation Premiums on ${matchedName} Stock`,
        url: 'https://finance.yahoo.com',
        source: 'Market Watch',
        summary: `Wall Street experts remain divided over whether the current price reflects structural improvements or cyclical industry headwinds.`,
        sentiment: 'neutral',
        date: '5 days ago'
      }
    ],
    swot: {
      strengths: [
        'Robust brand equity and long-standing reputation in the commercial space.',
        'Diversified revenue base across multiple services and products.',
        'Strong capital allocation strategy with consistent R&D reinvestment.'
      ],
      weaknesses: [
        'Relatively high cost of capital compared to tier-1 technology peers.',
        'Slightly longer deployment cycles for software and updates.',
        'Dependency on key manufacturing partners for parts and equipment.'
      ],
      opportunities: [
        'Leveraging machine learning to automate customer operations and service lines.',
        'Expansion into European and Asia-Pacific markets.',
        'Strategic mergers & acquisitions to capture early-stage startups.'
      ],
      threats: [
        'Fluctuating macroeconomic indicators affecting capital expenditure budgets.',
        'Tightening regional compliance regulations around data privacy and storage.',
        'Rising competition from agile, cloud-native specialized solutions.'
      ]
    },
    competitors: [
      { name: 'Global Tech Corp', ticker: 'GTC', marketCap: `$${(mcapBase * 1.2).toFixed(1)}B`, peRatio: +(peGen * 1.1).toFixed(1), revenue: `$${(revBase * 1.2).toFixed(1)}B`, margin: 18.2 },
      { name: 'Standard Solutions Ltd', ticker: 'SSL', marketCap: `$${(mcapBase * 0.8).toFixed(1)}B`, peRatio: +(peGen * 0.9).toFixed(1), revenue: `$${(revBase * 0.9).toFixed(1)}B`, margin: 12.5 }
    ],
    risk: {
      businessRisk: `Operational scale bottlenecks: Transitioning legacy clients to new platforms may disrupt billing cycles.`,
      marketRisk: `Intense customer acquisition competition forcing price concessions.`,
      regulatoryRisk: `Vulnerability to international tariffs and compliance sanctions.`,
      technologyRisk: `High velocity of software modernization requires continuous research spending.`,
      financialRisk: `Slightly rising leverage index if expansion is funded through debt.`
    },
    recommendation: {
      decision,
      confidence,
      reasoning: `### Investment Thesis for **${matchedName} (${matchedTicker})**\n\nOur multi-agent analysis suggests a **${decision}** position on ${matchedName} with a confidence level of **${confidence}%**.\n\n#### Financial & Structural Analysis\n- **Valuation**: The company trades at a P/E ratio of **${peGen}x**, which is relatively ${peGen > 30 ? 'high' : 'fair'} compared to its historical and industry peers. \n- **Balance Sheet**: Debt-to-equity stands at **${(peGen * 0.02).toFixed(2)}**, showing a ${peGen > 25 ? 'moderate' : 'conservative'} leverage structure.\n- **Moat**: Its brand equity in the ${matchedTicker} sector serves as a stable buffer, though competitive entry-points are increasing.\n\n#### Recommendation Summary\n${decision === 'INVEST' ? `We recommend acquiring shares as growth indicators (Revenue Growth at **${(peGen * 0.5).toFixed(1)}%**) point to a solid upward trajectory.` : `We suggest a **HOLD/PASS** stance for now. The valuation multiple is slightly stretched relative to near-term earnings growth, indicating a lack of margin of safety. Investors should wait for a better entry point.`}`,
      scores: {
        growth,
        risk,
        valuation,
        financial,
        innovation,
        overall
      }
    },
    timestamp: new Date().toISOString()
  };
}
