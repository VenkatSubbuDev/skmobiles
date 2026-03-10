import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderItem, OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30',
  processing: 'bg-primary/20 text-primary border-primary/30',
  shipped: 'bg-[hsl(var(--neon-purple))]/20 text-[hsl(var(--neon-purple))] border-[hsl(var(--neon-purple))]/30',
  delivered: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  const toggleExpand = async (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (!orderItems[orderId]) {
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      setOrderItems(prev => ({ ...prev, [orderId]: (data as OrderItem[]) || [] }));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Your order history will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id} className="bg-card border-border overflow-hidden">
          <button onClick={() => toggleExpand(order.id)} className="w-full text-left">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-foreground">#{order.order_number}</CardTitle>
                <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={statusColors[order.status]}>
                  {order.status}
                </Badge>
                <span className="font-semibold text-foreground">₹{Number(order.total).toLocaleString()}</span>
                {expandedId === order.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </CardHeader>
          </button>
          {expandedId === order.id && (
            <CardContent className="border-t border-border pt-4 space-y-3">
              {(orderItems[order.id] || []).map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.product_image && (
                    <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-md object-cover bg-secondary" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">₹{(item.quantity * Number(item.price)).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery: {order.delivery_method === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</span>
                <span className="text-muted-foreground">Payment: {order.payment_status}</span>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
