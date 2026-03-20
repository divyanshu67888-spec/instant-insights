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
    const { idea, score, verdict } = await req.json();
    if (!idea) {
      return new Response(JSON.stringify({ error: 'Business idea is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const systemPrompt = `You are an expert startup product strategist and MVP coach. Generate a detailed, actionable 90-day MVP roadmap for the given business idea.

Context: This idea scored ${score || 'N/A'}/100 in validation. Verdict: ${verdict || 'N/A'}

Respond with ONLY valid JSON matching this exact structure (no markdown):
{
  "title": "<MVP name — short and catchy>",
  "tagline": "<one sentence describing the MVP>",
  "techStack": ["<tech 1>", "<tech 2>", "<tech 3>"],
  "phases": [
    {
      "phase": 1,
      "name": "Foundation & Discovery",
      "weeks": "Week 1-3",
      "goal": "<main goal of this phase>",
      "tasks": [
        { "task": "<specific task>", "duration": "<e.g. 2 days>", "priority": "critical" | "high" | "medium" },
        { "task": "<specific task>", "duration": "<e.g. 3 days>", "priority": "critical" | "high" | "medium" }
      ],
      "deliverables": ["<deliverable 1>", "<deliverable 2>"],
      "milestone": "<key milestone to hit>"
    },
    {
      "phase": 2,
      "name": "Core Build",
      "weeks": "Week 4-8",
      "goal": "<main goal>",
      "tasks": [
        { "task": "<task>", "duration": "<duration>", "priority": "critical" | "high" | "medium" }
      ],
      "deliverables": ["<deliverable>"],
      "milestone": "<milestone>"
    },
    {
      "phase": 3,
      "name": "Launch & Iterate",
      "weeks": "Week 9-12",
      "goal": "<main goal>",
      "tasks": [
        { "task": "<task>", "duration": "<duration>", "priority": "critical" | "high" | "medium" }
      ],
      "deliverables": ["<deliverable>"],
      "milestone": "<milestone>"
    }
  ],
  "keyMetrics": [
    { "metric": "<KPI name>", "target": "<target value>", "timeframe": "Day 30 | Day 60 | Day 90" }
  ],
  "estimatedCost": {
    "low": "<₹ amount>",
    "medium": "<₹ amount>",
    "high": "<₹ amount>"
  },
  "risks": [
    { "risk": "<risk description>", "mitigation": "<how to handle it>" }
  ],
  "launchChecklist": ["<item 1>", "<item 2>", "<item 3>", "<item 4>", "<item 5>"]
}

Make it practical, specific to the business idea, and realistic for a solo founder or small team. Use ₹ INR for costs. Include 4-6 tasks per phase, 4-5 key metrics, 3-4 risks, and 5-7 launch checklist items.`;

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
          { role: 'user', content: `Create a 90-day MVP roadmap for: ${idea}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in Settings.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    let roadmap;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        roadmap = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      console.error('Failed to parse:', content);
      throw new Error('Failed to parse roadmap');
    }

    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('mvp-roadmap error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
