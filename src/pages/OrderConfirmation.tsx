import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Loader2, ArrowRight } from 'lucide-react';
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

  const shippingAddr = order.shipping_address as Record<string, string> | null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8 animate-fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--success))]/20 mb-4">
          <CheckCircle2 className="h-8 w-8 text-[hsl(var(--success))]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">Thank you for your order. We'll keep you updated.</p>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-semibold text-foreground text-lg">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-foreground">{format(new Date(order.created_at), 'MMM d, yyyy')}</p>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                {item.product_image && (
                  <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-md object-cover bg-secondary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-foreground">₹{(item.quantity * Number(item.price)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <Separator className="bg-border" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{Number(order.subtotal).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{Number(order.shipping_cost) === 0 ? 'Free' : `₹${Number(order.shipping_cost)}`}</span></div>
            <div className="flex justify-between font-semibold text-lg pt-2"><span>Total</span><span className="text-primary">₹{Number(order.total).toLocaleString()}</span></div>
          </div>

          <Separator className="bg-border" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Method</p>
              <p className="text-foreground">{order.delivery_method === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</p>
            </div>
            {shippingAddr && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ship To</p>
                <p className="text-sm text-foreground">{shippingAddr.full_name}</p>
                <p className="text-xs text-muted-foreground">{shippingAddr.address_line1}, {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postal_code}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/account">View Orders <ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
