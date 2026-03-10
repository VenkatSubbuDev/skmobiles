import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, Loader2 } from 'lucide-react';

export default function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .maybeSingle();

    if (data) {
      setFullName(data.full_name || '');
      setPhone(data.phone || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('user_id', user!.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarFallback className="bg-secondary text-foreground text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{fullName || 'No name set'}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled className="opacity-60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
