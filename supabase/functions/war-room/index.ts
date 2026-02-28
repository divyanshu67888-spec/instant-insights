import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea } = await req.json();
    if (!idea) {
      return new Response(JSON.stringify({ error: 'Business idea is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const systemPrompt = `You are WAR ROOM, an elite market intelligence system with 6 specialized AI agents. Given a business idea, analyze it from all 6 perspectives and return a structured JSON validation report.

You MUST respond with ONLY valid JSON matching this exact structure (no markdown, no extra text):
{
  "score": <number 0-100>,
  "verdict": "<one-line verdict>",
  "agents": [
    {
      "name": "SCOUT",
      "role": "Market Size Analyst",
      "finding": "<2-3 sentences with specific numbers/data about TAM, growth rate, market trends>",
      "sentiment": "positive" | "warning" | "neutral"
    },
    {
      "name": "VIPER",
      "role": "Competitor Intel",
      "finding": "<2-3 sentences about competitors, market share, gaps>",
      "sentiment": "positive" | "warning" | "neutral"
    },
    {
      "name": "ORACLE",
      "role": "Pricing Strategist",
      "finding": "<2-3 sentences about pricing strategy, margins, revenue model>",
      "sentiment": "positive" | "warning" | "neutral"
    },
    {
      "name": "SENTINEL",
      "role": "Risk Assessor",
      "finding": "<2-3 sentences about key risks, regulatory, operational challenges>",
      "sentiment": "positive" | "warning" | "neutral"
    },
    {
      "name": "ECHO",
      "role": "Customer Voice",
      "finding": "<2-3 sentences about target customer insights, demand signals, willingness to pay>",
      "sentiment": "positive" | "warning" | "neutral"
    },
    {
      "name": "PHANTOM",
      "role": "Trend Tracker",
      "finding": "<2-3 sentences about relevant trends, social signals, tailwinds/headwinds>",
      "sentiment": "positive" | "warning" | "neutral"
    }
  ]
}

Be specific with numbers, percentages, and data points. Make findings actionable and grounded in real market knowledge.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this business idea: ${idea}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in Settings.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error('No response from AI');

    // Parse the JSON from the AI response
    let report;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        report = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseErr) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse validation report');
    }

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('war-room error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
