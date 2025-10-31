import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('API endpoint hit!');
    console.log('Environment check:', {
      hasApiKey: !!import.meta.env.AIRTABLE_API_KEY,
      hasBaseId: !!import.meta.env.AIRTABLE_BASE_ID,
      hasTableId: !!import.meta.env.AIRTABLE_TABLE_ID
    });
    
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const weddingDate = formData.get('wedding-date')?.toString() || '';
    const guests = formData.get('guests')?.toString() || '';
    const location = formData.get('location')?.toString() || '';
    const budget = formData.get('budget')?.toString() || '';
    const message = formData.get('message')?.toString() || '';
    const sourcePage = formData.get('source')?.toString() || 'Contact';
    const venueName = formData.get('venue')?.toString() || '';

    console.log('Form data received:', { name, email, location, guests });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed - missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare Airtable record
    const airtableData = {
      fields: {
        'Name': name,
        'Email': email,
        ...(phone && { 'Phone': phone }),
        ...(weddingDate && { 'Wedding Date': weddingDate }),
        ...(guests && { 'Number of Guests': parseInt(guests) || 0 }),
        ...(location && { 'Preferred Location': location }),
        ...(budget && { 'Budget Range': budget }),
        ...(message && { 'Message': message }),
        ...(sourcePage && { 'Source Page': sourcePage }),
        ...(venueName && { 'Venue Name': venueName }),
        'Status': 'New'
      }
    };

    // Send to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${import.meta.env.AIRTABLE_BASE_ID}/${import.meta.env.AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.AIRTABLE_API_KEY}`,
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
    console.log('Successfully created Airtable record:', airtableResult.id);

    // TODO: Send WhatsApp notification via Twilio
    // Uncomment when Twilio credentials are added
    /*
    if (import.meta.env.TWILIO_ACCOUNT_SID && import.meta.env.TWILIO_AUTH_TOKEN) {
      const twilioMessage = `🎉 New Enquiry!\n\nName: ${name}\nEmail: ${email}\nGuests: ${guests || 'N/A'}\nLocation: ${location || 'N/A'}\nBudget: ${budget || 'N/A'}\n\nMessage: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;
      
      const twilioAuth = Buffer.from(
        `${import.meta.env.TWILIO_ACCOUNT_SID}:${import.meta.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${twilioAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: import.meta.env.TWILIO_WHATSAPP_FROM,
            To: import.meta.env.TWILIO_WHATSAPP_TO,
            Body: twilioMessage
          })
        }
      );
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Enquiry submitted successfully',
        recordId: airtableResult.id 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit enquiry. Please try again or contact us directly.' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

