import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    console.log('Received message:', message);

    if (!message) {
      console.error('No message provided');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    console.log('n8nWebhookUrl:', n8nWebhookUrl);
    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL not set');
      return NextResponse.json({ error: 'n8n webhook URL not configured' }, { status: 500 });
    }

    // Prepare the payload for n8n (adjust based on your n8n workflow)
    const payload = {
      message,
      // Add any additional data your n8n agent needs
    };
    console.log('Sending payload to n8n:', payload);

    // Call n8n webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add API key if required
        ...(process.env.N8N_API_KEY && {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        }),
      },
      body: JSON.stringify(payload),
    });

    console.log('n8n response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n error response:', errorText);
      // Return a safe error response without throwing
      return NextResponse.json({ error: `n8n error: ${response.status}`, details: errorText }, { status: response.status });
    }

    let data;
    try {
      data = await response.json();
      console.log('Parsed n8n response:', data); // Log parsed data
    } catch (parseError) {
      console.error('Failed to parse n8n response as JSON:', parseError);
      return NextResponse.json({ error: 'Invalid response from n8n', details: 'Response not JSON' }, { status: 502 });
    }

    // Ensure we have a response field for the frontend
    if (!data.response && !data.output && !data.message && !data.text && !data.result) {
      console.warn('n8n response missing expected fields, using raw data');
      data = { response: JSON.stringify(data) }; // Fallback to stringify if no known field
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
