import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';
import type { Order, OrderItem } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
  processing: 'bg-primary/20 text-primary',
  shipped: 'bg-[hsl(var(--neon-purple))]/20 text-[hsl(var(--neon-purple))]',
  delivered: 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]',
  cancelled: 'bg-destructive/20 text-destructive',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data || []) as Order[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Order status updated' }); fetchOrders(); }
  };

  const viewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    setOrderItems((data || []) as OrderItem[]);
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <Card key={order.id} className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{order.order_number}</p>
                  <Badge className={statusColors[order.status] || ''}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString()} · {order.delivery_method?.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{Number(order.total).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Payment: {order.payment_status}</p>
              </div>
              <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => viewOrder(order)}><Eye className="w-4 h-4" /></Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No orders found</p>}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Order {selectedOrder?.order_number}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Status</p><Badge className={statusColors[selectedOrder.status] || ''}>{selectedOrder.status}</Badge></div>
                <div><p className="text-muted-foreground">Payment</p><p>{selectedOrder.payment_status}</p></div>
                <div><p className="text-muted-foreground">Delivery</p><p>{selectedOrder.delivery_method?.replace('_', ' ')}</p></div>
                <div><p className="text-muted-foreground">Date</p><p>{new Date(selectedOrder.created_at).toLocaleString()}</p></div>
              </div>
              <div>
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex justify-between p-2 rounded bg-muted/30">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>₹{Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{Number(selectedOrder.shipping_cost).toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span>₹{Number(selectedOrder.total).toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
