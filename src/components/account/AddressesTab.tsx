import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Address } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, MapPin, Loader2, Star } from 'lucide-react';

const emptyAddress = { full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'India' };

export default function AddressesTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyAddress);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user!.id)
      .order('is_default', { ascending: false });
    setAddresses((data as Address[]) || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.full_name || !form.phone || !form.address_line1 || !form.city || !form.state || !form.postal_code) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('addresses')
      .insert({ ...form, user_id: user!.id, is_default: addresses.length === 0 });

    if (error) {
      toast({ title: 'Error', description: 'Failed to save address', variant: 'destructive' });
    } else {
      toast({ title: 'Address added' });
      setForm(emptyAddress);
      setDialogOpen(false);
      fetchAddresses();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Address removed' });
  };

  const setDefault = async (id: string) => {
    // unset all defaults then set new one
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user!.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    fetchAddresses();
    toast({ title: 'Default address updated' });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-foreground">Saved Addresses</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Address</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Address</DialogTitle></DialogHeader>
            <div className="grid gap-3 mt-2">
              {[
                { id: 'full_name', label: 'Full Name', key: 'full_name' as const },
                { id: 'phone', label: 'Phone', key: 'phone' as const },
                { id: 'address_line1', label: 'Address Line 1', key: 'address_line1' as const },
                { id: 'address_line2', label: 'Address Line 2 (optional)', key: 'address_line2' as const },
                { id: 'city', label: 'City', key: 'city' as const },
                { id: 'state', label: 'State', key: 'state' as const },
                { id: 'postal_code', label: 'PIN Code', key: 'postal_code' as const },
              ].map(f => (
                <div key={f.id} className="space-y-1">
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input id={f.id} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <Button onClick={handleSave} disabled={saving} className="mt-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No addresses saved</h3>
            <p className="text-sm text-muted-foreground mt-1">Add a delivery address to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map(addr => (
            <Card key={addr.id} className={`bg-card border-border relative ${addr.is_default ? 'ring-1 ring-primary' : ''}`}>
              {addr.is_default && (
                <Badge className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30 text-xs">Default</Badge>
              )}
              <CardContent className="pt-5 space-y-1">
                <p className="font-medium text-foreground">{addr.full_name}</p>
                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                <p className="text-sm text-muted-foreground">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.postal_code}</p>
                <div className="flex gap-2 pt-3">
                  {!addr.is_default && (
                    <Button variant="outline" size="sm" onClick={() => setDefault(addr.id)} className="gap-1 text-xs">
                      <Star className="h-3 w-3" /> Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleDelete(addr.id)} className="gap-1 text-xs text-destructive hover:text-destructive">
                    <Trash2 className="h-3 w-3" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Need Badge import
import { Badge } from '@/components/ui/badge';
