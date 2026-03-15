import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Smartphone, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Category { id: string; name: string; }

interface Brand {
  id: string; name: string; slug: string; logo_url: string | null;
  category_id?: string | null;
  is_active: boolean; display_order: number;
}

interface Model {
  id: string; brand_id: string; name: string; is_active: boolean; display_order: number;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [models, setModels] = useState<Record<string, Model[]>>({});
  const [loading, setLoading] = useState(true);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [brandForm, setBrandForm] = useState({ name: '', slug: '', logo_url: '', category_id: 'none', is_active: true, display_order: 0 });
  const [modelForm, setModelForm] = useState({ name: '', is_active: true, display_order: 0 });
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchAll = async () => {
    const [bRes, mRes, cRes] = await Promise.all([
      supabase.from('brands' as any).select('*').order('display_order'),
      supabase.from('models' as any).select('*').order('display_order'),
      supabase.from('categories').select('id, name').eq('is_active', true)
    ]);
    const fetchedBrands = (bRes.data as any) as Brand[];
    const fetchedModels = (mRes.data as any) as Model[];
    
    setBrands(fetchedBrands || []);
    setCategories((cRes.data as any) as Category[] || []);
    
    const grouped: Record<string, Model[]> = {};
    (fetchedModels || []).forEach((m: Model) => {
      if (!grouped[m.brand_id]) grouped[m.brand_id] = [];
      grouped[m.brand_id].push(m);
    });
    setModels(grouped);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleExpand = (id: string) => {
    setExpandedBrands(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Brand CRUD
  const openNewBrand = () => { setEditingBrand(null); setBrandForm({ name: '', slug: '', logo_url: '', category_id: 'none', is_active: true, display_order: 0 }); setBrandDialogOpen(true); };
  const openEditBrand = (b: Brand) => { setEditingBrand(b); setBrandForm({ name: b.name, slug: b.slug, logo_url: b.logo_url || '', category_id: b.category_id || 'none', is_active: b.is_active, display_order: b.display_order }); setBrandDialogOpen(true); };

  const saveBrand = async () => {
    const payload = { 
      name: brandForm.name, 
      slug: brandForm.slug || brandForm.name.toLowerCase().replace(/\s+/g, '-'), 
      logo_url: brandForm.logo_url || null,
      category_id: brandForm.category_id === 'none' ? null : brandForm.category_id,
      is_active: brandForm.is_active,
      display_order: brandForm.display_order
    };
    const { error } = editingBrand
      ? await supabase.from('brands' as any).update(payload).eq('id', editingBrand.id)
      : await supabase.from('brands' as any).insert(payload);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingBrand ? 'Brand updated' : 'Brand created' }); setBrandDialogOpen(false); fetchAll(); }
  };

  const deleteBrand = async (id: string) => {
    const { error } = await supabase.from('brands' as any).delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Brand deleted' }); fetchAll(); }
  };

  // Model CRUD
  const openNewModel = (brandId: string) => { setActiveBrandId(brandId); setEditingModel(null); setModelForm({ name: '', is_active: true, display_order: 0 }); setModelDialogOpen(true); };
  const openEditModel = (m: Model) => { setActiveBrandId(m.brand_id); setEditingModel(m); setModelForm({ name: m.name, is_active: m.is_active, display_order: m.display_order }); setModelDialogOpen(true); };

  const saveModel = async () => {
    const payload = { ...modelForm, brand_id: activeBrandId };
    const { error } = editingModel
      ? await supabase.from('models' as any).update(payload).eq('id', editingModel.id)
      : await supabase.from('models' as any).insert(payload);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingModel ? 'Model updated' : 'Model created' }); setModelDialogOpen(false); fetchAll(); }
  };

  const deleteModel = async (id: string) => {
    const { error } = await supabase.from('models' as any).delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Model deleted' }); fetchAll(); }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 shimmer rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mobile Brands & Models</h2>
        <Button onClick={openNewBrand}><Plus className="w-4 h-4 mr-2" />Add Brand</Button>
      </div>

      <div className="space-y-3">
        {brands.map(brand => (
          <Collapsible key={brand.id} open={expandedBrands.has(brand.id)} onOpenChange={() => toggleExpand(brand.id)}>
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      {expandedBrands.has(brand.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <Smartphone className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{brand.name}</p>
                      {!brand.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                      <Badge variant="outline" className="text-xs">{(models[brand.id] || []).length} models</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openNewModel(brand.id)}><Plus className="w-3 h-3 mr-1" />Model</Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditBrand(brand)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteBrand(brand.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="mt-3 ml-12 space-y-2">
                    {(models[brand.id] || []).length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No models added yet</p>
                    )}
                    {(models[brand.id] || []).map(model => (
                      <div key={model.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <p className="flex-1 text-sm">{model.name}</p>
                        {!model.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModel(model)}><Pencil className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteModel(model.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        ))}
        {brands.length === 0 && <p className="text-center text-muted-foreground py-12">No brands added yet. Click "Add Brand" to get started.</p>}
      </div>

      {/* Brand Dialog */}
      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBrand ? 'Edit Brand' : 'New Brand'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} placeholder="e.g. Samsung" /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={brandForm.slug} onChange={e => setBrandForm({...brandForm, slug: e.target.value})} placeholder="auto-generated" /></div>
            <div className="space-y-2"><Label>Logo URL (optional)</Label><Input value={brandForm.logo_url} onChange={e => setBrandForm({...brandForm, logo_url: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={brandForm.category_id} onValueChange={v => setBrandForm({...brandForm, category_id: v})}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / Global</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Display Order</Label><Input type="number" value={brandForm.display_order} onChange={e => setBrandForm({...brandForm, display_order: parseInt(e.target.value) || 0})} /></div>
            <div className="flex items-center gap-2"><Switch checked={brandForm.is_active} onCheckedChange={v => setBrandForm({...brandForm, is_active: v})} /><Label>Active</Label></div>
            <Button onClick={saveBrand} className="w-full">{editingBrand ? 'Update' : 'Create'} Brand</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Model Dialog */}
      <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingModel ? 'Edit Model' : 'New Model'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Model Name</Label><Input value={modelForm.name} onChange={e => setModelForm({...modelForm, name: e.target.value})} placeholder="e.g. Galaxy S24 Ultra" /></div>
            <div className="space-y-2"><Label>Display Order</Label><Input type="number" value={modelForm.display_order} onChange={e => setModelForm({...modelForm, display_order: parseInt(e.target.value) || 0})} /></div>
            <div className="flex items-center gap-2"><Switch checked={modelForm.is_active} onCheckedChange={v => setModelForm({...modelForm, is_active: v})} /><Label>Active</Label></div>
            <Button onClick={saveModel} className="w-full">{editingModel ? 'Update' : 'Create'} Model</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
