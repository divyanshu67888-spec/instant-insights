import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function searchWeb(query: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: 5,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });
    const data = await response.json();
    const results = data?.data || [];
    return results.map((r: any) => `[${r.title}](${r.url})\n${(r.markdown || r.description || '').slice(0, 500)}`).join('\n\n---\n\n');
  } catch (e) {
    console.error('Search error:', e);
    return '';
  }
}

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

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');

    let liveContext = '';
    if (FIRECRAWL_API_KEY) {
      console.log('Firecrawl available — gathering live web data...');
      const [marketData, competitorData, trendData] = await Promise.all([
        searchWeb(`${idea} market size TAM growth 2024 2025`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} competitors startups companies market share`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} trends consumer demand innovation ideas`, FIRECRAWL_API_KEY),
      ]);

      liveContext = `
=== LIVE WEB INTELLIGENCE ===
--- Market Research ---
${marketData || 'No data found'}
--- Competitor Intelligence ---
${competitorData || 'No data found'}
--- Trends & Innovation ---
${trendData || 'No data found'}
=== END LIVE DATA ===
`;
      console.log('Live web data gathered successfully');
    }

    const systemPrompt = `You are WAR ROOM, an elite market intelligence system. Given a business idea, produce a comprehensive JSON report.

${liveContext ? 'Use the LIVE WEB DATA below for grounded analysis with real numbers and sources.' : 'Use your training knowledge. Be specific with realistic estimates.'}

Respond with ONLY valid JSON matching this structure (no markdown, no extra text):
{
  "score": <number 0-100>,
  "verdict": "<one-line verdict>",
  "agents": [
    { "name": "SCOUT", "role": "Market Size Analyst", "finding": "<2-3 sentences>", "sentiment": "positive" | "warning" | "neutral" },
    { "name": "VIPER", "role": "Competitor Intel", "finding": "<2-3 sentences>", "sentiment": "positive" | "warning" | "neutral" },
    { "name": "ORACLE", "role": "Pricing Strategist", "finding": "<2-3 sentences>", "sentiment": "positive" | "warning" | "neutral" },
    { "name": "SENTINEL", "role": "Risk Assessor", "finding": "<2-3 sentences>", "sentiment": "positive" | "warning" | "neutral" },
    { "name": "ECHO", "role": "Customer Voice", "finding": "<2-3 sentences>", "sentiment": "positive" | "warning" | "neutral" },
    { "name": "PHANTOM", "role": "Trend Tracker", "finding": "<2-3 sentences>", "sentiment": "positive" | "warning" | "neutral" }
  ],
  "marketMetrics": {
    "tam": "<total addressable market e.g. $50B>",
    "sam": "<serviceable addressable market e.g. $12B>",
    "som": "<serviceable obtainable market e.g. $500M>",
    "cagr": "<compound annual growth rate e.g. 18%>",
    "yearOverYear": [
      { "year": "2022", "value": <number in billions> },
      { "year": "2023", "value": <number in billions> },
      { "year": "2024", "value": <number in billions> },
      { "year": "2025", "value": <number in billions> },
      { "year": "2026", "value": <number in billions> }
    ]
  },
  "competitors": [
    { "name": "<competitor name>", "marketShare": <number 0-100>, "strength": "<one key strength>", "weakness": "<one key weakness>" }
  ],
  "dimensionScores": [
    { "dimension": "Market Size", "score": <0-100> },
    { "dimension": "Competition", "score": <0-100> },
    { "dimension": "Timing", "score": <0-100> },
    { "dimension": "Profitability", "score": <0-100> },
    { "dimension": "Scalability", "score": <0-100> },
    { "dimension": "Defensibility", "score": <0-100> }
  ],
  "improvements": [
    { "title": "<short title>", "description": "<1-2 sentences>", "impact": "high" | "medium" | "low", "type": "core" | "outOfBox" }
  ]
}

For "competitors", include 4-6 real or realistic competitors with market share percentages that sum to roughly 70-95% (leaving room for others).
For "improvements", include 6-8 ideas — mix of "core" (practical improvements) and "outOfBox" (creative/disruptive ideas).
For "dimensionScores", rate each dimension 0-100 based on your analysis.
For "marketMetrics.yearOverYear", provide realistic market size projections.
Be specific with numbers, percentages, and data points.`;

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
          { role: 'user', content: `Analyze this business idea: ${idea}\n\n${liveContext}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits in Settings.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    let report;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        report = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse validation report');
    }

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('war-room error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
