import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SHIPROCKET_EMAIL = Deno.env.get('SHIPROCKET_EMAIL') || '';
const SHIPROCKET_PASSWORD = Deno.env.get('SHIPROCKET_PASSWORD') || '';

async function getShiprocketToken() {
  const req = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD })
  });
  if (!req.ok) throw new Error('Shiprocket auth failed');
  const res = await req.json();
  return res.token;
}

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;
    
    if (payload.type !== 'INSERT' || record.status !== 'pending' || record.delivery_method !== 'standard_shipping') {
      return new Response(JSON.stringify({ message: "Ignored" }), { status: 200 });
    }

    const token = await getShiprocketToken();
    
    const orderData = {
      "order_id": record.id,
      "order_date": record.created_at,
      "pickup_location": "Primary",
      "billing_customer_name": record.shipping_address?.full_name || "Customer",
      "billing_last_name": "",
      "billing_address": record.shipping_address?.address_line1 || "",
      "billing_address_2": record.shipping_address?.address_line2 || "",
      "billing_city": record.shipping_address?.city || "",
      "billing_pincode": record.shipping_address?.postal_code || "",
      "billing_state": record.shipping_address?.state || "",
      "billing_country": "India",
      "billing_email": "",
      "billing_phone": record.shipping_address?.phone || "",
      "shipping_is_billing": true,
      "order_items": [
        {
          "name": "Mobile Products",
          "sku": "SKU",
          "units": 1,
          "selling_price": record.total,
        }
      ],
      "payment_method": "Prepaid",
      "sub_total": record.total,
      "length": 10,
      "breadth": 15,
      "height": 20,
      "weight": 0.5
    };

    const srReq = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    if (!srReq.ok) {
      throw new Error(`Shiprocket API error: ${await srReq.text()}`);
    }
    
    const srRes = await srReq.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('orders').update({
      notes: (record.notes || '') + ` | Shiprocket Order ID: ${srRes.order_id}`
    }).eq('id', record.id);

    return new Response(JSON.stringify({ success: true, shiprocket_response: srRes }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
