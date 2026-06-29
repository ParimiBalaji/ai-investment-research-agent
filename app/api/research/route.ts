import { NextRequest, NextResponse } from "next/server";
import { runResearchWorkflow } from "@/lib/langgraph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName } = body;

    if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
      return NextResponse.json(
        { error: "Company name is required and must be a valid string" },
        { status: 400 }
      );
    }

    console.log(`[API /api/research] Launching research workflow for "${companyName}"`);
    const report = await runResearchWorkflow(companyName.trim());

    return NextResponse.json(report, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/research] Failed to process research request:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during research workflow" },
      { status: 500 }
    );
  }
}
