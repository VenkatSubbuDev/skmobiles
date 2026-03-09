import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PackageX } from 'lucide-react';

export default function AdminStockAlerts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('products').select('*, categories(*)').lt('stock_quantity', 10).order('stock_quantity');
      setProducts((data || []).map((p: any) => ({ ...p, category: p.categories })));
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>;

  const outOfStock = products.filter(p => p.stock_quantity === 0);
  const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Stock Alerts</h2>

      {outOfStock.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive"><PackageX className="w-5 h-5" /> Out of Stock ({outOfStock.length})</h3>
          {outOfStock.map(p => (
            <Card key={p.id} className="glass border-destructive/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.category?.name}</p>
                </div>
                <Badge variant="destructive">Out of Stock</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-[hsl(var(--warning))]"><AlertTriangle className="w-5 h-5" /> Low Stock ({lowStock.length})</h3>
          {lowStock.map(p => (
            <Card key={p.id} className="glass border-[hsl(var(--warning))]/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.category?.name}</p>
                </div>
                <Badge className="bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]">{p.stock_quantity} left</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {outOfStock.length === 0 && lowStock.length === 0 && (
        <Card className="glass"><CardContent className="p-12 text-center text-muted-foreground">All products are well stocked! 🎉</CardContent></Card>
      )}
    </div>
  );
}
