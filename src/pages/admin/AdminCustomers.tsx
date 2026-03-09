import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';

interface CustomerData {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string | null;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: orders } = await supabase.from('orders').select('user_id, total');

      const orderMap = new Map<string, { count: number; total: number }>();
      (orders || []).forEach(o => {
        const existing = orderMap.get(o.user_id || '') || { count: 0, total: 0 };
        orderMap.set(o.user_id || '', { count: existing.count + 1, total: existing.total + Number(o.total) });
      });

      setCustomers((profiles || []).map(p => ({
        ...p,
        orderCount: orderMap.get(p.user_id)?.count || 0,
        totalSpent: orderMap.get(p.user_id)?.total || 0,
      })));
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = customers.filter(c => (c.full_name || '').toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Customers</h2>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{c.full_name || 'Unnamed'}</p>
                <p className="text-sm text-muted-foreground">{c.phone || 'No phone'} · Joined {new Date(c.created_at!).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{c.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{c.orderCount} orders</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No customers found</p>}
      </div>
    </div>
  );
}
