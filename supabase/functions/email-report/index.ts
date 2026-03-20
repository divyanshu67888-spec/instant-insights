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
    const { email, report, idea } = await req.json();
    if (!email || !report) {
      return new Response(JSON.stringify({ error: 'Email and report data are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    // Use AI to format the report as a clean HTML email
    const systemPrompt = `You are an email formatter. Convert the given validation report JSON into a clean, professional HTML email body. Use inline CSS styles. Keep it structured with clear sections, colors for scores (green for high, orange for medium, red for low), and a professional look. Include all key data points. Do NOT include <html>, <head>, or <body> tags — just the inner content div. Use a clean white background with dark text. Add the VentureVitals branding at the top.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Format this validation report for "${idea || 'Business Idea'}" as an HTML email:\n\n${JSON.stringify(report, null, 2)}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit. Try again shortly.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Failed to format email');
    }

    const aiData = await response.json();
    const htmlContent = aiData.choices?.[0]?.message?.content || '';

    // Extract HTML from potential markdown code blocks
    let cleanHtml = htmlContent;
    const htmlMatch = htmlContent.match(/```html\n?([\s\S]*?)```/);
    if (htmlMatch) cleanHtml = htmlMatch[1];

    // For now, return the formatted HTML — the frontend will use mailto or copy
    return new Response(JSON.stringify({ 
      success: true, 
      htmlContent: cleanHtml,
      subject: `VentureVitals Report: ${idea || 'Your Idea'} — Score ${report.score}/100`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('email-report error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
