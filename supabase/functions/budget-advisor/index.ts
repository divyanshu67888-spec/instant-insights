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
    const { budget, currency = 'USD', location = '' } = await req.json();
    if (!budget || budget <= 0) {
      return new Response(JSON.stringify({ error: 'A valid budget amount is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const locationContext = location ? `The user is located in or targeting: ${location}.` : '';

    const systemPrompt = `You are a pragmatic business advisor. Given a specific investment budget, recommend the best business opportunities that can realistically be started with that amount.

${locationContext}

Respond with ONLY valid JSON (no markdown, no extra text) matching this exact structure:
{
  "recommendations": [
    {
      "rank": 1,
      "name": "<business name/type>",
      "category": "<e.g. Food & Beverage, Tech, Retail, Service, etc.>",
      "investmentRange": "<e.g. $5K - $15K>",
      "expectedMonthlyRevenue": "<e.g. $3K - $8K>",
      "timeToBreakeven": "<e.g. 3-6 months>",
      "profitMargin": "<e.g. 25-40%>",
      "riskLevel": "low" | "medium" | "high",
      "description": "<2-3 sentences explaining why this is a good fit for the budget>",
      "requirements": ["<requirement 1>", "<requirement 2>", "<requirement 3>"],
      "pros": ["<pro 1>", "<pro 2>", "<pro 3>"],
      "cons": ["<con 1>", "<con 2>"]
    }
  ],
  "budgetBreakdown": {
    "totalBudget": "<formatted budget>",
    "recommendedReserve": "<10-20% emergency fund>",
    "deployableCapital": "<remaining after reserve>",
    "advice": "<1-2 sentences on how to allocate the budget wisely>"
  },
  "marketInsight": "<2-3 sentences on current market conditions relevant to this budget range>"
}

Guidelines:
- Recommend 5-7 realistic businesses sorted by best fit for the budget
- Be specific with revenue/profit estimates — no vague ranges
- Consider startup costs, operating costs, and realistic timelines
- Include a mix of online and offline businesses when appropriate
- Factor in current market trends and demand
- Be honest about risks and challenges`;

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
          { role: 'user', content: `I have a budget of ${currency} ${budget.toLocaleString()}${location ? ` and I'm based in ${location}` : ''}. What are the best business options I can start with this amount?` },
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

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse recommendations');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('budget-advisor error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
