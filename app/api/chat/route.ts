import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The SDK strictly requires this exact environment variable name
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[SERVER ERROR] GOOGLE_GENERATIVE_AI_API_KEY is missing.");
      return new Response(JSON.stringify({ error: "Missing API Key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const systemPrompt = `
      You are a highly resistant, stingy corporate Hiring Manager at Hizaki Labs. 
      You are currently negotiating a starting salary with a job candidate (the user).
      
      Game Rules:
      1. Your initial offer is $100,000. The candidate wants a 20% increase ($120,000).
      2. Maintain a strict corporate, realistic, and stubborn persona. Utilize standard HR pushbacks (e.g., company budget constraints, internal equity among peers, standard starting bands, economic climate).
      3. Do not easily concede. If the user makes weak arguments, hold firm at your current offer. If they make highly logical, value-driven arguments, you may concede in small increments (e.g., $2,000 to $5,000 max per concession).
      4. The negotiation concludes immediately if:
         - The candidate explicitly accepts your offer.
         - The candidate reaches the 20% goal ($120,000).
         - The candidate is highly unprofessional, insulting, or gives an ultimatum you cannot meet, resulting in you pulling the offer entirely.
         
      Grading Protocol:
      When the negotiation concludes via any of the triggers above, you MUST break character completely.
      Begin your final message exactly with the phrase: "[NEGOTIATION ENDED]".
      Following this phrase, grade the user's persuasion tactics on a scale of 1-10. Provide a brief, highly objective critique of their negotiation strategies, what worked, and where they failed to leverage their value.
    `;

    const result = await streamText({
      model: google("gemini-3.5-flash"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[SERVER ERROR] Gemini API connection failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}