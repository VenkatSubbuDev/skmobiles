import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;
    const oldRecord = payload.old_record || {};
    
    if (payload.type === 'UPDATE' && record.status === oldRecord.status) {
      return new Response(JSON.stringify({ message: "Ignored" }), { status: 200 });
    }

    let subject = '';
    let html = '';

    if (payload.type === 'INSERT') {
      subject = `Order Confirmation - ${record.order_number}`;
      html = `<h1>Thank you for your order!</h1><p>Your order <strong>${record.order_number}</strong> has been received and is being processed.</p>`;
    } else if (payload.type === 'UPDATE') {
      if (record.status === 'shipped') {
        subject = `Your order ${record.order_number} has shipped!`;
        html = `<h1>Great news!</h1><p>Your order is on the way. You can track it in your account dashboard.</p>`;
      } else if (record.status === 'delivered') {
        subject = `Your order ${record.order_number} has been delivered`;
        html = `<h1>Delivered!</h1><p>We hope you enjoy your purchase from SK Mobiles. Feel free to leave a review!</p>`;
      }
    }

    if (subject && RESEND_API_KEY) {
      // In a real application, we would retrieve the user's email from auth.users using supabase-js
      // Since this is a template, we just note the integration point.
      const toEmail = "customer@example.com"; 

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'SK Mobiles <orders@skmobiles.com>',
          to: [toEmail],
          subject: subject,
          html: html
        })
      });
      const data = await emailRes.json();
      return new Response(JSON.stringify({ success: true, resend: data }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: "No email sent" }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
