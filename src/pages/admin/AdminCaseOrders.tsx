import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, ExternalLink, Download, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface CaseOrder {
  id: string; order_number: string; customer_name: string; customer_phone: string;
  customer_email: string | null; shipping_address: string;
  city?: string;
  state?: string;
  pincode?: string;
  payment_status?: string;
  quantity: number; price: number; status: string; image_url: string; notes: string | null;
  created_at: string; brand_name?: string; model_name?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  processing: 'bg-primary/10 text-primary border-primary/30',
  printing: 'bg-accent/10 text-accent border-accent/30',
  shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

export default function AdminCaseOrders() {
  const [orders, setOrders] = useState<CaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CaseOrder | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('custom_case_orders')
      .select('*, brands(name), models(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error loading case orders', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (data) {
      setOrders(data.map((o: any) => ({
        ...o,
        brand_name: o.brands?.name,
        model_name: o.models?.name,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('custom_case_orders').update({ status }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Status updated' }); fetchOrders(); }
  };

  const handleDownload = async (imageUrl: string, orderNumber: string, model: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${orderNumber}-${model?.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: 'Download failed', description: 'Could not download the high-res image', variant: 'destructive' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Custom Case Orders</h2>
        <Badge variant="outline">{orders.length} orders</Badge>
      </div>

      <div className="space-y-3">
        {orders.map(order => (
          <Card key={order.id} className="glass">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img src={order.image_url} alt="Case design" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-mono font-semibold text-primary">{order.order_number}</p>
                  <Badge className={statusColors[order.status] || ''}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customer_name} · {order.customer_phone}</p>
                <p className="text-xs text-muted-foreground">{order.brand_name} {order.model_name} · Qty: {order.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{order.price}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p className="text-center text-muted-foreground py-12">No custom case orders yet</p>}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Order Details — {selectedOrder?.order_number}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-muted">
                <img src={selectedOrder.image_url} alt="Case design" className="w-full max-h-64 object-contain" />
              </div>
              <a href={selectedOrder.image_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-sm hover:underline">
                <ExternalLink className="w-3 h-3" /> View full image
              </a>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedOrder.customer_name}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedOrder.customer_phone}</p></div>
                <div><p className="text-muted-foreground">Brand</p><p className="font-medium">{selectedOrder.brand_name}</p></div>
                <div><p className="text-muted-foreground">Model</p><p className="font-medium">{selectedOrder.model_name}</p></div>
                <div><p className="text-muted-foreground">Quantity</p><p className="font-medium">{selectedOrder.quantity}</p></div>
                <div><p className="text-muted-foreground">Total</p><p className="font-medium text-primary">₹{selectedOrder.price}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">City</p><p className="text-sm">{selectedOrder.city || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">State</p><p className="text-sm">{selectedOrder.state || 'N/A'}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">PIN Code</p><p className="text-sm">{selectedOrder.pincode || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Payment Status</p><Badge variant={selectedOrder.payment_status === 'paid' ? 'outline' : 'secondary'}>{selectedOrder.payment_status || 'pending'}</Badge></div>
              </div>
              <div><p className="text-sm text-muted-foreground">Full Address</p><p className="text-sm truncate hover:whitespace-normal">{selectedOrder.shipping_address}</p></div>
              {selectedOrder.customer_email && <div><p className="text-sm text-muted-foreground">Email</p><p className="text-sm">{selectedOrder.customer_email}</p></div>}
              
              <div className="flex gap-3 pt-4 no-print">
                <Button className="flex-1 gap-2" onClick={() => handleDownload(selectedOrder.image_url, selectedOrder.order_number, selectedOrder.model_name || 'case')}>
                  <Download className="w-4 h-4" /> Download High-Res
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
                  <Printer className="w-4 h-4" /> Print Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
