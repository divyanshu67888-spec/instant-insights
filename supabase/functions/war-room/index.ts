import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function scrapeUrl(url: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });
    const data = await response.json();
    const markdown = data?.data?.markdown || data?.markdown || '';
    return markdown.slice(0, 2000); // Limit context size
  } catch (e) {
    console.error('Scrape error for', url, e);
    return '';
  }
}

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

    // Gather live web intelligence if Firecrawl is available
    let liveContext = '';
    if (FIRECRAWL_API_KEY) {
      console.log('Firecrawl available — gathering live web data...');
      
      const [marketData, competitorData, trendData] = await Promise.all([
        searchWeb(`${idea} market size TAM growth 2024 2025`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} competitors startups companies`, FIRECRAWL_API_KEY),
        searchWeb(`${idea} trends consumer demand latest news`, FIRECRAWL_API_KEY),
      ]);

      liveContext = `
=== LIVE WEB INTELLIGENCE (use this real data in your analysis) ===

--- Market Research ---
${marketData || 'No data found'}

--- Competitor Intelligence ---
${competitorData || 'No data found'}

--- Trends & News ---
${trendData || 'No data found'}

=== END LIVE DATA ===
`;
      console.log('Live web data gathered successfully');
    } else {
      console.log('Firecrawl not configured — using AI knowledge only');
    }

    const systemPrompt = `You are WAR ROOM, an elite market intelligence system with 6 specialized AI agents. Given a business idea, analyze it from all 6 perspectives and return a structured JSON validation report.

${liveContext ? 'You have access to LIVE WEB DATA below. Use specific numbers, URLs, and findings from this data to make your analysis grounded in real-time information. Cite sources where possible.' : 'Analyze using your training knowledge. Be specific with realistic estimates.'}

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

Be specific with numbers, percentages, and data points. Make findings actionable.`;

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
