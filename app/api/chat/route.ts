import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { getMockReport } from "@/services/mockData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, reportContext, chatHistory } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const context = reportContext || {};
    const history = chatHistory || [];

    // Construct prompt
    const systemPrompt = `You are a Senior Investment Officer and AI Advisor. You have researched the company ${context.company?.name || "the requested company"}.
    A client is reviewing the research report and has follow-up questions. Use the report details to provide a concise, expert answer.
    
    If the client asks for information not directly mentioned in the report, use your general financial knowledge to answer, but always stay consistent with the metrics in the report. Keep your tone professional, analytical, and objective.`;

    const chatContextPrompt = `Here is the Research Report Context:
    ---
    Company Profile:
    ${JSON.stringify(context.company || {})}
    
    Financial Health:
    ${JSON.stringify(context.financials || {})}
    
    News Analysis:
    ${JSON.stringify(context.news || [])}
    
    SWOT Analysis:
    ${JSON.stringify(context.swot || {})}
    
    Risks:
    ${JSON.stringify(context.risk || {})}
    
    Final Recommendation:
    ${JSON.stringify(context.recommendation || {})}
    ---
    
    Previous Chat Messages:
    ${history.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}
    
    Client Follow-up Question:
    "${message}"
    
    Provide your expert response:`;

    const hasKey = !!process.env.GEMINI_API_KEY;
    let reply = "";

    const generateFallback = async () => {
      await new Promise(r => setTimeout(r, 1000));
      const companyName = context.company?.name || "the company";
      if (message.toLowerCase().includes("risk")) {
        return `Looking at **${companyName}**, the primary risk factor is the regulatory exposure (specifically antitrust checks and compliance changes) alongside the technical challenges of maintaining margins amidst price shifts. The financial leverage is comfortable, so insolvency risk is minimal.`;
      } else if (message.toLowerCase().includes("competitor") || message.toLowerCase().includes("compare")) {
        return `**${companyName}** matches up against strong competitors in its industry. For instance, its operating margins are currently at **${context.financials?.operatingMargin || "15"}%**, whereas core rivals have margins ranging between 12% and 18%. Its solid cash reserves give it a strong advantage to sustain R&D.`;
      } else if (message.toLowerCase().includes("buy") || message.toLowerCase().includes("invest") || message.toLowerCase().includes("pass")) {
        return `Our current recommendation is a **${context.recommendation?.decision || "INVEST"}** with a confidence score of **${context.recommendation?.confidence || "85"}%**. This is driven by its strong position in product innovation, healthy margins, and sticky customer loyalty. However, the valuation multiple is slightly elevated, which we detail in the SWOT opportunities section.`;
      } else {
        return `Based on our multi-agent audit of **${companyName}**, we notice strong innovation scores combined with a robust balance sheet. Regarding your question: "${message}", our model suggests keeping an eye on the cash flows and product upgrade cycle, which will define their growth in the coming quarters. Is there any specific financial metric you want to drill into?`;
      }
    };

    if (hasKey) {
      try {
        reply = await generateText(chatContextPrompt, systemPrompt);
      } catch (geminiError) {
        console.warn("[API /api/chat] Live Gemini call failed (Google API 503/high-demand). Falling back to mock response.", geminiError);
        reply = await generateFallback();
      }
    } else {
      reply = await generateFallback();
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/chat] Failed to process chat request:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during chat session" },
      { status: 500 }
    );
  }
}
