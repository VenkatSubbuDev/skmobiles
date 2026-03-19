import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type CheckoutItem = {
  product_id: string
  quantity: number
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

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase function secrets' }), {
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
      items,
      delivery_method = 'standard_shipping',
      shipping_address = null,
      notes = null,
      coupon_code = null,
    } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart items are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const normalizedItems: CheckoutItem[] = items
      .map((i: any) => ({
        product_id: String(i.product_id || ''),
        quantity: Number(i.quantity || 0),
      }))
      .filter((i) => i.product_id && i.quantity > 0)

    if (normalizedItems.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid cart items provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const productIds = [...new Set(normalizedItems.map((i) => i.product_id))]
    const { data: products, error: productsError } = await adminClient
      .from('products')
      .select('id, name, price, images, is_active, stock_quantity')
      .in('id', productIds)

    if (productsError || !products) {
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]))
    let subtotal = 0
    for (const item of normalizedItems) {
      const product: any = productMap.get(item.product_id)
      if (!product || !product.is_active) {
        return new Response(JSON.stringify({ error: 'One or more items are unavailable' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (typeof product.stock_quantity === 'number' && product.stock_quantity < item.quantity) {
        return new Response(JSON.stringify({ error: `Insufficient stock for ${product.name}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      subtotal += Number(product.price) * item.quantity
    }

    const shippingCost = delivery_method === 'store_pickup' ? 0 : 0

    let discountAmount = 0
    let couponId: string | null = null

    if (coupon_code) {
      const code = String(coupon_code).trim().toUpperCase()
      if (code) {
        const { data: coupon, error: couponError } = await adminClient
          .from('coupons')
          .select('*')
          .eq('code', code)
          .eq('is_active', true)
          .single()

        if (couponError || !coupon) {
          return new Response(JSON.stringify({ error: 'Invalid coupon code' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
          return new Response(JSON.stringify({ error: 'Coupon has expired' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (subtotal < Number(coupon.min_order_value || 0)) {
          return new Response(JSON.stringify({ error: 'Minimum order value not met for coupon' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        const { count: usageCount } = await adminClient
          .from('coupon_usage')
          .select('id', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('user_id', user.id)

        if (coupon.usage_limit_per_user && (usageCount || 0) >= Number(coupon.usage_limit_per_user)) {
          return new Response(JSON.stringify({ error: 'Coupon usage limit reached for this user' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (coupon.total_usage_limit && Number(coupon.used_count || 0) >= Number(coupon.total_usage_limit)) {
          return new Response(JSON.stringify({ error: 'Coupon usage limit reached' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        couponId = coupon.id
        if (coupon.type === 'percentage') {
          discountAmount = (subtotal * Number(coupon.value)) / 100
        } else {
          discountAmount = Number(coupon.value)
        }
      }
    }

    discountAmount = Math.min(discountAmount, subtotal)
    const total = Math.max(0, subtotal + shippingCost - discountAmount)

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: 'TEMP',
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        total,
        delivery_method,
        shipping_address,
        notes,
        coupon_id: couponId,
        discount_amount: discountAmount,
      } as any)
      .select('id, order_number, total')
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const orderItems = normalizedItems.map((item) => {
      const product: any = productMap.get(item.product_id)
      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product.name,
        product_image: product.images?.[0] || null,
        quantity: item.quantity,
        price: Number(product.price),
      }
    })

    const { error: orderItemsError } = await adminClient.from('order_items').insert(orderItems)
    if (orderItemsError) {
      await adminClient.from('orders').delete().eq('id', order.id)
      return new Response(JSON.stringify({ error: 'Failed to create order items' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (couponId) {
      await adminClient.from('coupon_usage').insert({
        coupon_id: couponId,
        user_id: user.id,
        order_id: order.id,
      } as any)
      const { data: couponRow } = await adminClient
        .from('coupons')
        .select('used_count')
        .eq('id', couponId)
        .single()
      await adminClient
        .from('coupons')
        .update({ used_count: Number(couponRow?.used_count || 0) + 1 } as any)
        .eq('id', couponId)
    }

    let razorpayOrder: { id: string; amount: number; currency: string } | null = null
    if (Number(total) > 0) {
      const keyId = Deno.env.get('RAZORPAY_KEY_ID')
      const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
      if (!keyId || !keySecret) {
        await adminClient.from('orders').delete().eq('id', order.id)
        return new Response(JSON.stringify({ error: 'Payment gateway configuration missing' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const basicAuth = btoa(`${keyId}:${keySecret}`)
      const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(Number(total) * 100),
          currency: 'INR',
          receipt: order.id,
        }),
      })
      const razorpayData = await razorpayRes.json()
      if (!razorpayRes.ok || !razorpayData?.id) {
        await adminClient.from('orders').delete().eq('id', order.id)
        return new Response(JSON.stringify({ error: razorpayData?.error?.description || 'Failed to create payment order' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      razorpayOrder = {
        id: razorpayData.id,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
      }
    }

    return new Response(
      JSON.stringify({
        order_id: order.id,
        order_number: order.order_number,
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: discountAmount,
        total,
        razorpay_order: razorpayOrder,
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
