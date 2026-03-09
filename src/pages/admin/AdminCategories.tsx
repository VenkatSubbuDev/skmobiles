import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface CategoryForm {
  name: string; slug: string; description: string; icon: string; image_url: string; is_active: boolean;
}

const emptyForm: CategoryForm = { name: '', slug: '', description: '', icon: '', image_url: '', is_active: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data as Category[] || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', icon: c.icon || '', image_url: c.image_url || '', is_active: c.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description || null,
      icon: form.icon || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('categories').insert(payload));
    }

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: editingId ? 'Category updated' : 'Category created' }); setDialogOpen(false); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Category deleted' }); fetchData(); }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={() => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.id} className="glass card-hover">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{c.icon && <span className="mr-2">{c.icon}</span>}{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.description || 'No description'}</p>
                  <p className="text-xs text-muted-foreground mt-2">/{c.slug}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No categories yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit Category' : 'New Category'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="auto-generated" /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Icon (emoji)</Label><Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="📱" /></div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>Active</Label></div>
            <Button onClick={handleSave} className="w-full">{editingId ? 'Update' : 'Create'} Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
