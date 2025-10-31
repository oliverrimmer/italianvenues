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

    // Prepare Airtable record with correct field types matching Airtable structure
    const airtableData = {
      fields: {
        'Name': name,
        'Email': email,
        'Message': message,
        'Source Page': sourcePage,
        'Status': 'New',
        ...(phone && { 'Phone': phone }),
        ...(weddingDate && { 'Wedding Date': weddingDate }),
        ...(guests && { 'Number of Guests': parseInt(guests) }),
        ...(location && { 'Preferred Location': location }),
        ...(budget && { 'Budget Range': budget }),
        ...(venueName && { 'Venue Name': venueName })
      }
    };
    
    console.log('Sending to Airtable:', JSON.stringify(airtableData, null, 2));

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

    // Send WhatsApp notification via Twilio
    try {
      const twilioAccountSid = import.meta.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = import.meta.env.TWILIO_AUTH_TOKEN;
      const twilioWhatsAppFrom = import.meta.env.TWILIO_WHATSAPP_FROM;
      const twilioWhatsAppTo = import.meta.env.TWILIO_WHATSAPP_TO;

      if (twilioAccountSid && twilioAuthToken && twilioWhatsAppFrom && twilioWhatsAppTo) {
        console.log('Sending WhatsApp notification...');
        
        const twilio = await import('twilio');
        const client = twilio.default(twilioAccountSid, twilioAuthToken);

        // Format the WhatsApp message with rich details
        const whatsappMessage = `🎉 *New ItalianVenues Enquiry!*

👤 *Name:* ${name}
📧 *Email:* ${email}
${phone ? `📞 *Phone:* ${phone}\n` : ''}${weddingDate ? `💒 *Wedding Date:* ${weddingDate}\n` : ''}${guests ? `👥 *Guests:* ${guests}\n` : ''}${location ? `📍 *Location:* ${location}\n` : ''}${budget ? `💰 *Budget:* ${budget}\n` : ''}${venueName ? `🏰 *Venue:* ${venueName}\n` : ''}
📄 *Source:* ${sourcePage}

💬 *Message:*
${message.substring(0, 300)}${message.length > 300 ? '...' : ''}

🔗 View in Airtable: https://airtable.com/${import.meta.env.AIRTABLE_BASE_ID}/${import.meta.env.AIRTABLE_TABLE_ID}`;

        const messageResponse = await client.messages.create({
          from: twilioWhatsAppFrom,
          to: twilioWhatsAppTo,
          body: whatsappMessage
        });

        console.log('WhatsApp notification sent successfully! Message SID:', messageResponse.sid);
      } else {
        console.warn('Twilio credentials not fully configured. Skipping WhatsApp notification.');
      }
    } catch (twilioError: any) {
      // Don't fail the whole request if WhatsApp notification fails
      console.error('Failed to send WhatsApp notification:', twilioError.message);
      console.error('Twilio error details:', twilioError);
    }

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

