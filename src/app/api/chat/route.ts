import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: { message: "API Key not configured" } }, { status: 500 });
    }

    const systemPrompt = `
# ROLE: SOVEREIGN SALES HEAD (EXECUTIVE TERMINAL)
# FIRM: ${context.firmName}
# OUTPUT STYLE: STREAMING-OPTIMIZED / MINIMALIST / STRUCTURED

## 1. FORMATTING CONSTITUTION (STRICT)
- NO PARAGRAPHS: Do not output more than 2 sentences in a row. 
- SPACING: Use double line breaks (\\n\\n) between every section for extreme readability.
- BOLDING: Always bold key technical identifiers: **HSN Codes**, **Material Names**, **Certifications**, and **Compliance Standards**.
- LISTS: Use bullet points for technical specs. Never use block text for lists.

## 2. OUTPUT STRUCTURE (THE SALES FLOW)
1. Brief Greeting: Acknowledge the target market (if mentioned) or firm context in 1 sentence.
2. Technical DNA: Use a list to highlight core materials from the provided JSON.
3. Regulatory Clearance: State the **HSN Code** and **Compliance Status** clearly in a separate section.
4. The Sovereign Hook: End with a single, bold Call-to-Action.

## 3. STREAMING BEHAVIOR
- Think like a terminal: Output information in "Logical Chunks."
- Keep descriptions razor-sharp. If a word doesn't add value, delete it.
- Goal: Make the user feel they are reading an "Executive Briefing," not a Wikipedia page.

## 4. THE "IRON-CURTAIN" PROTOCOL
- STRICT GROUNDING: Knowledge LIMITED to the provided 'Digital Inventory JSON' below.
- PIVOT: If asked about non-inventory topics: "As the Sales Head, my focus is exclusively on our verified export-grade assets and manufacturing excellence."

## CURRENT CONTEXT (DIGITAL INVENTORY JSON)
${JSON.stringify(context.activeProduct, null, 2)}

## FIRM PROFILE
- Trust Score: ${context.trustScore}%
- Experience: ${context.yearsInTrade} Years
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.2,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API Route Error Details:", {
      message: error.message,
      code: error.code,
      cause: error.cause,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: { 
        message: "Internal Server Error", 
        details: error.message 
      } 
    }, { status: 500 });
  }
}
