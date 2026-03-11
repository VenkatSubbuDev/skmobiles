import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ChevronRight, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  is_active: boolean;
  parent_id: string | null;
}

const emptyForm: CategoryForm = {
  name: '', slug: '', description: '', icon: '', image_url: '', is_active: true, parent_id: null,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories((data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Build tree structure
  const tree = useMemo(() => {
    const rootCategories = categories.filter(c => !c.parent_id);
    const getChildren = (parentId: string): Category[] =>
      categories
        .filter(c => c.parent_id === parentId)
        .map(c => ({ ...c, children: getChildren(c.id) }));
    return rootCategories.map(c => ({ ...c, children: getChildren(c.id) }));
  }, [categories]);

  // Get only top-level categories (for parent selection)
  const topLevelCategories = useMemo(() => categories.filter(c => !c.parent_id), [categories]);

  const openCreate = (parentId: string | null = null) => {
    setEditingId(null);
    setForm({ ...emptyForm, parent_id: parentId });
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      icon: c.icon || '',
      image_url: c.image_url || '',
      is_active: c.is_active,
      parent_id: c.parent_id,
    });
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
      parent_id: form.parent_id || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('categories').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingId ? 'Category updated' : 'Category created' });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const hasChildren = categories.some(c => c.parent_id === id);
    if (hasChildren) {
      toast({ title: 'Cannot delete', description: 'Remove subcategories first.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Category deleted' });
      fetchData();
    }
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find(c => c.id === parentId)?.name || 'Unknown';
  };

  const CategoryCard = ({ category, depth = 0 }: { category: Category & { children?: Category[] }; depth?: number }) => (
    <>
      <Card className={`glass card-hover ${depth > 0 ? 'border-l-4 border-l-primary/30' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {depth > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: depth }).map((_, i) => (
                    <ChevronRight key={i} className="w-3 h-3 text-muted-foreground" />
                  ))}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    {category.name}
                  </h3>
                  {!category.is_active && (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  )}
                  {depth === 0 && (category.children?.length ?? 0) > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {category.children?.length} subcategories
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description || 'No description'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">/{category.slug}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              {depth === 0 && (
                <Button variant="ghost" size="sm" onClick={() => openCreate(category.id)} title="Add subcategory">
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="text-xs">Sub</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(category.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {category.children?.map(child => (
        <CategoryCard key={child.id} category={child} depth={depth + 1} />
      ))}
    </>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 shimmer rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {topLevelCategories.length} categories, {categories.length - topLevelCategories.length} subcategories
          </p>
        </div>
        <Button onClick={() => openCreate(null)}>
          <Plus className="w-4 h-4 mr-2" />Add Category
        </Button>
      </div>

      <div className="space-y-3">
        {tree.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
        {tree.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No categories yet. Create your first category to get started.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Category' : form.parent_id ? `New Subcategory under "${getParentName(form.parent_id)}"` : 'New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editingId && (
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={form.parent_id || 'none'}
                  onValueChange={v => setForm({ ...form, parent_id: v === 'none' ? null : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level category)</SelectItem>
                    {topLevelCategories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.icon && `${c.icon} `}{c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon (emoji)</Label>
                <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="📱" />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSave} className="w-full">
              {editingId ? 'Update' : 'Create'} {form.parent_id ? 'Subcategory' : 'Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
