import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase function secrets' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: 'Payment gateway configuration missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const { data: authData, error: authError } = await userClient.auth.getUser()
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Invalid user session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const user = authData.user

    const {
      brand_id,
      model_id,
      image_url,
      customer_name,
      customer_phone,
      customer_email = null,
      shipping_address,
      city,
      state,
      pincode,
      quantity = 1,
    } = await req.json()

    if (!brand_id || !model_id || !image_url || !customer_name || !customer_phone || !shipping_address || !city || !state || !pincode) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const safeQty = Math.max(1, Number(quantity) || 1)

    const { data: settings, error: settingsError } = await adminClient
      .from('site_settings')
      .select('key, value')
      .in('key', ['custom_case_sale_price'])

    if (settingsError || !settings) {
      return new Response(JSON.stringify({ error: 'Failed to fetch pricing settings' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const salePriceRow = settings.find((s: any) => s.key === 'custom_case_sale_price')
    const unitPrice = Number(salePriceRow?.value || 299)
    const total = unitPrice * safeQty

    const { data: order, error: orderError } = await adminClient
      .from('custom_case_orders')
      .insert({
        user_id: user.id,
        brand_id,
        model_id,
        image_url,
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        city,
        state,
        pincode,
        quantity: safeQty,
        price: total,
        payment_status: 'pending',
        status: 'pending',
        order_number: 'TEMP',
      } as any)
      .select('id, order_number, price')
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Failed to create custom case order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    const receipt = `cc-${order.id}`
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        currency: 'INR',
        // Razorpay receipts must stay within 40 characters.
        receipt,
      }),
    })

    const razorpayData = await razorpayRes.json()
    if (!razorpayRes.ok || !razorpayData?.id) {
      await adminClient.from('custom_case_orders').delete().eq('id', order.id)
      return new Response(JSON.stringify({ error: razorpayData?.error?.description || 'Failed to create payment order' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({
        order_id: order.id,
        order_number: order.order_number,
        total,
        razorpay_order: {
          id: razorpayData.id,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})



