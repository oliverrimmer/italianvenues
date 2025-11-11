import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Extract email
    const email = formData.get('email')?.toString() || '';

    console.log('Newsletter subscription received:', { email });

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare Airtable record - using same structure as enquiries
    const airtableData = {
      fields: {
        'Name': 'Newsletter Subscriber',
        'Email': email,
        'Message': 'Newsletter subscription',
        'Source Page': 'Newsletter',
        'Status': 'New'
      }
    };
    
    console.log('Sending to Airtable:', JSON.stringify(airtableData, null, 2));

    // Send to Airtable (same table as enquiries)
    const authHeader = `Bearer ${import.meta.env.AIRTABLE_API_KEY}`;
    console.log('DEBUG - Auth header length:', authHeader.length);
    console.log('DEBUG - Auth header starts with:', authHeader.substring(0, 20));
    
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${import.meta.env.AIRTABLE_BASE_ID}/${import.meta.env.AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
      }
    );

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      console.error('Airtable API Error:', errorText);
      throw new Error(`Airtable API error: ${airtableResponse.status}`);
    }

    const airtableResult = await airtableResponse.json();
    console.log('Successfully created newsletter subscription:', airtableResult.id);

    // No WhatsApp notification for newsletter subscriptions

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        recordId: airtableResult.id 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to subscribe. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

