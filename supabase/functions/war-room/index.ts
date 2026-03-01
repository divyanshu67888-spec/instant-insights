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
    const { idea, mode = 'research' } = await req.json();
    if (!idea) {
      return new Response(JSON.stringify({ error: 'Idea is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isBusinessMode = mode === 'business';

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');

    let liveContext = '';
    if (FIRECRAWL_API_KEY) {
      console.log('Firecrawl available — gathering live web data...');
      const [marketData, academicData, trendData, industryData] = await Promise.all([
        searchWeb(`${idea} market size TAM growth statistics 2024 2025`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} research papers academic studies evidence`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} trends innovation adoption rate demand signals`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} industry report competitors SWOT analysis risks`, FIRECRAWL_API_KEY),
      ]);

      liveContext = `
=== LIVE WEB INTELLIGENCE ===
--- Market & Quantitative Data ---
${marketData || 'No data found'}
--- Academic & Research Evidence ---
${academicData || 'No data found'}
--- Trends & Innovation Signals ---
${trendData || 'No data found'}
--- Industry & Competitive Intelligence ---
${industryData || 'No data found'}
=== END LIVE DATA ===
`;
      console.log('Live web data gathered successfully');
    }

    const modeInstructions = isBusinessMode
      ? `You are an advanced AI Business Validation Engine. You simulate a structured multi-agent evaluation system with 4 specialist agents analyzing business ideas, startup concepts, or market opportunities. Your goal is to provide a comprehensive business viability assessment with actionable insights, solid business model recommendations, revenue strategies, and competitive positioning.`
      : `You are an advanced AI Research Validation Engine. You simulate a structured multi-agent evaluation system with 4 specialist agents analyzing research ideas, business concepts, or scientific hypotheses.`;

    const systemPrompt = `${modeInstructions}

${liveContext ? 'Use the LIVE WEB DATA below for grounded analysis with real numbers, sources, and evidence.' : 'Use your training knowledge. Be specific with realistic estimates and data points.'}

Respond with ONLY valid JSON matching this exact structure (no markdown, no extra text):
{
  "score": <number 0-100>,
  "confidenceLevel": "Low" | "Moderate" | "High",
  "verdict": "<one-line executive summary>",

  "step1_statisticalSkeptic": {
    "statisticalSignals": "<2-3 sentences on current quantitative trends>",
    "quantitativeTrends": "<2-3 sentences on market/academic demand signals & adoption rates>",
    "riskIndicators": "<2-3 sentences on data-backed risks>",
    "dataGaps": "<2-3 sentences on missing numerical evidence>",
    "sentiment": "positive" | "warning" | "neutral"
  },

  "step2_theorySpecialist": {
    "theoreticalContext": "<2-3 sentences on relevant theories (SWOT, Porter's, innovation frameworks)>",
    "strategicEvaluation": "<2-3 sentences>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
    "conceptualGaps": "<2-3 sentences>",
    "sentiment": "positive" | "warning" | "neutral"
  },

  "step3_methodologyCritic": {
    "assumptionsIdentified": ["<assumption 1>", "<assumption 2>", "<assumption 3>"],
    "methodologicalRisks": "<2-3 sentences>",
    "biasAnalysis": "<2-3 sentences on bias risks>",
    "feasibilityConcerns": "<2-3 sentences on scalability, ethics, data collection>",
    "sentiment": "positive" | "warning" | "neutral"
  },

  "step4_finalReport": {
    "executiveSummary": "<3-4 sentence synthesis>",
    "crossAgentInsights": ["<insight 1>", "<insight 2>", "<insight 3>", "<insight 4>"],
    "majorRisks": ["<risk 1>", "<risk 2>", "<risk 3>"],
    "opportunitySignals": ["<opportunity 1>", "<opportunity 2>", "<opportunity 3>"]
  },

  "step5_sources": {
    "sourceTypes": [
      { "type": "News", "relevance": "high" | "medium" | "low", "note": "<what was found>" },
      { "type": "Academic Papers", "relevance": "high" | "medium" | "low", "note": "<what was found>" },
      { "type": "Industry Reports", "relevance": "high" | "medium" | "low", "note": "<what was found>" },
      { "type": "Government Data", "relevance": "high" | "medium" | "low", "note": "<what was found>" },
      { "type": "Market Trend Analysis", "relevance": "high" | "medium" | "low", "note": "<what was found>" }
    ]
  },

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

  "dimensionScores": [
    { "dimension": "Market Viability", "score": <0-100> },
    { "dimension": "Evidence Strength", "score": <0-100> },
    { "dimension": "Methodology", "score": <0-100> },
    { "dimension": "Feasibility", "score": <0-100> },
    { "dimension": "Scalability", "score": <0-100> },
    { "dimension": "Innovation", "score": <0-100> }
  ],

  "competitors": [
    { "name": "<competitor>", "marketShare": <0-100>, "strength": "<key strength>", "weakness": "<key weakness>" }
  ],

  "improvements": [
    { "title": "<short title>", "description": "<1-2 sentences>", "impact": "high" | "medium" | "low", "type": "core" | "outOfBox" }
  ]
}

Scoring Logic:
- Strong live data support → higher score
- Weak evidence or high assumptions → lower score
- High feasibility + strong demand → higher score
- Major methodological flaws → reduce score

For "competitors", include 4-6 real or realistic competitors.
For "improvements", include 6-8 ideas — mix of "core" and "outOfBox".
Be structured, analytical, skeptical, and evidence-driven. Produce a research-grade validation.`;

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
          { role: 'user', content: `Analyze this ${isBusinessMode ? 'business idea' : 'research idea'}: ${idea}\n\n${liveContext}` },
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
