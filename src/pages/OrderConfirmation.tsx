import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Loader2, ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderItem } from '@/types';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && orderId) fetchOrder();
  }, [user, orderId]);

  const fetchOrder = async () => {
    const [{ data: orderData }, { data: itemsData }] = await Promise.all([
      supabase.from('orders').select('*').eq('id', orderId!).single(),
      supabase.from('order_items').select('*').eq('order_id', orderId!),
    ]);
    setOrder(orderData as unknown as Order);
    setItems((itemsData as OrderItem[]) || []);
    setLoading(false);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Order not found</h2>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const shippingAddr = order.shipping_address as unknown as Record<string, string> | null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <section className="relative mb-6 overflow-hidden rounded-[2rem] border border-primary/20 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_26%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(15,23,42,0.98))] px-6 py-10 text-center shadow-2xl shadow-primary/10 md:px-10">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 ring-8 ring-primary/5">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Payment confirmed
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">Order Confirmed!</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          We have locked your order, verified the payment, and started the next step in fulfillment.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4 text-left">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Order Number</p>
            <p className="mt-3 text-xl font-semibold text-primary break-all">{order.order_number}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4 text-left">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Order Date</p>
            <p className="mt-3 text-xl font-semibold text-foreground">{format(new Date(order.created_at), 'MMM d, yyyy')}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4 text-left">
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Grand Total</p>
            <p className="mt-3 text-xl font-semibold text-foreground">?{Number(order.total).toLocaleString()}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.35fr,0.85fr]">
        <Card className="border-border/70 bg-card/90 shadow-xl">
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Items in this order</h2>
                <p className="text-sm text-muted-foreground">Everything confirmed exactly as paid.</p>
              </div>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/15 p-4">
                  {item.product_image && (
                    <img src={item.product_image} alt={item.product_name} className="h-16 w-16 rounded-xl object-cover bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.product_name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">?{(item.quantity * Number(item.price)).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>?{Number(order.subtotal).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{Number(order.shipping_cost) === 0 ? 'Free' : `?${Number(order.shipping_cost)}`}</span></div>
              <div className="flex justify-between pt-2 text-lg font-semibold"><span>Total</span><span className="text-primary">?{Number(order.total).toLocaleString()}</span></div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card/90 shadow-xl">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Delivery snapshot</h2>
                  <p className="text-sm text-muted-foreground">Quick view of where this order is headed.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Delivery Method</p>
                <p className="mt-2 font-medium text-foreground">{order.delivery_method === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</p>
              </div>

              {shippingAddr && (
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Shipping Address</p>
                  <p className="mt-2 font-medium text-foreground">{shippingAddr.full_name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{shippingAddr.address_line1}, {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postal_code}</p>
                </div>
              )}

              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center gap-2 text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Payment verified</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Your order has been recorded successfully and is ready for the next processing step.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/account">View Orders <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild className="flex-1 neon-glow">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
