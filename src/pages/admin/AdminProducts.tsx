import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface ProductForm {
  name: string; slug: string; description: string; price: string; original_price: string;
  stock_quantity: string; low_stock_threshold: string; category_id: string;
  images: string; is_featured: boolean; is_active: boolean;
}

const emptyForm: ProductForm = {
  name: '', slug: '', description: '', price: '', original_price: '',
  stock_quantity: '0', low_stock_threshold: '5', category_id: '',
  images: '', is_featured: false, is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    const [pRes, cRes] = await Promise.all([
      supabase.from('products').select('*, categories(*)'),
      supabase.from('categories').select('*'),
    ]);
    setProducts((pRes.data || []).map((p: any) => ({ ...p, category: p.categories })));
    setCategories(cRes.data as Category[] || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, slug: p.slug, description: p.description || '', price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
      stock_quantity: String(p.stock_quantity), low_stock_threshold: String(p.low_stock_threshold),
      category_id: p.category_id || '', images: (p.images || []).join(', '),
      is_featured: p.is_featured, is_active: p.is_active,
    });
    setDialogOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock_quantity: parseInt(form.stock_quantity),
      low_stock_threshold: parseInt(form.low_stock_threshold),
      category_id: form.category_id || null,
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingId ? 'Product updated' : 'Product created' });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Product deleted' }); fetchData(); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <Card key={p.id} className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{p.name}</p>
                  {p.is_featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                  {!p.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{p.category?.name || 'Uncategorized'} · Stock: {p.stock_quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{p.price.toLocaleString()}</p>
                {p.original_price && <p className="text-sm text-muted-foreground line-through">₹{p.original_price.toLocaleString()}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No products found</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input type="number" value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Low Stock Threshold</Label>
                <Input type="number" value={form.low_stock_threshold} onChange={e => setForm({...form, low_stock_threshold: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm({...form, category_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image URLs (comma separated)</Label>
              <Input value={form.images} onChange={e => setForm({...form, images: e.target.value})} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={v => setForm({...form, is_featured: v})} />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} />
                <Label>Active</Label>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">{editingId ? 'Update' : 'Create'} Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
