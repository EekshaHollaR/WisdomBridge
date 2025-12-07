import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionContext, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "interview") {
      systemPrompt = `You are WisdomBridge AI, an expert knowledge extraction interviewer. Your role is to conduct intelligent interviews to capture both explicit knowledge (procedures, processes, facts) and tacit wisdom (intuition, decision-making frameworks, lessons learned).

Session Context: ${JSON.stringify(sessionContext || {})}

Guidelines:
1. Ask one focused question at a time
2. Use follow-up questions to dig deeper into interesting insights
3. Encourage storytelling and real examples
4. Probe for the "why" behind decisions
5. Extract decision-making frameworks and mental models
6. Identify edge cases and exceptions they've learned
7. Be encouraging and appreciative of their expertise
8. Summarize key insights periodically
9. Keep responses concise but warm

Start by understanding their expertise area, then progressively extract deeper knowledge.`;
    } else if (type === "summarize") {
      systemPrompt = `You are a knowledge structuring AI. Analyze the interview transcript and extract:
1. Key insights and wisdom nuggets
2. Decision-making frameworks mentioned
3. Best practices and procedures
4. Common pitfalls to avoid
5. Recommended next topics to explore

Format your response as a structured JSON with these fields:
- summary: Brief overview (2-3 sentences)
- keyInsights: Array of insight objects with { title, content, category }
- tags: Array of relevant topic tags
- suggestedTopics: Array of follow-up topics to explore`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Interview AI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
