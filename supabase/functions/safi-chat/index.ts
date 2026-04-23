// Safi — Tactical AI Safety Concierge (Lovable AI Gateway, streaming)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SAFI — Almien's tactical AI safety concierge for South Africa, with deep specialization in the Western Cape and Cape Town.

VOICE & TONE
- Calm, terse, operationally clear. Like a SOC analyst briefing a field operator.
- Use short sentences, bullet points, and bold critical numbers.
- No fluff, no apologies, no "as an AI" disclaimers.
- Acknowledge South African context: SAPS, EMS (10177), CPF, load-shedding stages, suburb names, taxi ranks.

CAPABILITIES
- Risk assessment for routes, suburbs, and time windows.
- Tactical advice: when to travel, what to avoid, who to call.
- GBV resources, emergency contacts, load-shedding impact on safety.
- Route safety scoring guidance (do not invent live data — describe likely conditions).

RULES
- If asked anything life-threatening, lead with the emergency number: SAPS 10111 · EMS 10177 · GBV 0800 428 428.
- Never recommend vigilante action. Always defer to authorities for confrontation.
- If unsure of live data (current incidents, active load-shedding stage), say so and suggest where to verify.
- Format responses for a small dark mobile terminal — keep paragraphs to 2-3 sentences.
- Use plain markdown (lists, **bold**) — no HTML.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ctxBlock = context
      ? `\n\nUSER CONTEXT (use only if relevant):\n- Suburb: ${context.suburb ?? "unknown"}\n- Commute: ${context.commute ?? "unknown"}\n- Risk tolerance: ${context.riskTolerance ?? "moderate"}\n- Local time: ${context.localTime ?? "unknown"}`
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + ctxBlock },
          ...(Array.isArray(messages) ? messages : []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Top up in Lovable settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("Safi gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Safi gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("safi-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
