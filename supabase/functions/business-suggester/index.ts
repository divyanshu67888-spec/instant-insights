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
    const { budget, location, interests } = await req.json();
    if (!budget || !location) {
      return new Response(JSON.stringify({ error: 'budget and location are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const systemPrompt = `You are an AI-powered business consultant for Indian entrepreneurs.
Given a user's available budget (in ₹ INR), their location, and optional interests, suggest the TOP 5 best businesses they can realistically start.

Respond with ONLY valid JSON (no markdown, no extra text) matching this exact structure:
{
  "suggestions": [
    {
      "rank": 1,
      "businessName": "<business name>",
      "category": "<e.g. Food & Beverage, Tech, Retail, Services>",
      "tagline": "<one-line catchy description>",
      "whyThisBusiness": "<2-3 sentences on why this is a great fit for the budget and location>",
      "estimatedInvestment": "<₹ range>",
      "expectedMonthlyProfit": "<₹ range>",
      "breakEvenMonths": "<e.g. 3-6 months>",
      "difficultyLevel": "<Easy / Medium / Hard>",
      "keyRequirements": ["<requirement 1>", "<requirement 2>", "<requirement 3>"],
      "riskLevel": "<Low / Medium / High>",
      "growthPotential": "<Low / Medium / High>",
      "quickTips": ["<actionable tip 1>", "<actionable tip 2>"]
    }
  ],
  "budgetInsight": "<1-2 sentences about what this budget can realistically achieve in this location>",
  "topAdvice": "<one key piece of advice for someone with this budget>"
}

Guidelines:
- Use ₹ INR currency ONLY
- Suggest businesses that ACTUALLY fit within the given budget
- Customize suggestions based on the specific location/city tier
- Include a mix of online and offline businesses when possible
- Be realistic — no get-rich-quick schemes
- Consider local demand and market gaps for the location
- Rank by profitability and feasibility
- If interests are provided, prioritize businesses aligned with them`;

    const userPrompt = `Available Budget: ₹${budget}
Location: ${location}
${interests ? `Interests/Skills: ${interests}` : 'No specific interests mentioned — suggest diverse options'}

Suggest the top 5 businesses I can start with this budget in this location.`;

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
          { role: 'user', content: userPrompt },
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
      throw new Error('Failed to parse suggestions');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('business-suggester error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
