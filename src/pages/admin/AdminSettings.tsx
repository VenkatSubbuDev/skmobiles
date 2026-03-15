import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, IndianRupee } from 'lucide-react';

interface SiteSetting {
  key: string;
  value: any;
  description: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('site_settings' as any).select('*') as { data: any[] | null, error: any };
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch settings', variant: 'destructive' });
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSettings = async () => {
    setSaving(true);
    const promises = settings.map(s => 
      supabase.from('site_settings' as any).update({ value: s.value }).eq('key', s.key)
    );

    const results = await Promise.all(promises);
    const hasError = results.some(r => r.error);

    if (hasError) {
      toast({ title: 'Error', description: 'Some settings failed to save', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'All settings updated successfully' });
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const customCaseSalePrice = settings.find(s => s.key === 'custom_case_sale_price');
  const customCaseOriginalPrice = settings.find(s => s.key === 'custom_case_original_price');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">Manage global configurations and pricing</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="neon-glow">
          {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Custom Case Pricing
            </CardTitle>
            <CardDescription>Configure default prices for personalized phone cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sale-price">Sale Price (₹)</Label>
              <Input 
                id="sale-price"
                type="number" 
                value={customCaseSalePrice?.value || ''} 
                onChange={e => handleUpdateSetting('custom_case_sale_price', e.target.value)}
                placeholder="299"
              />
              <p className="text-[10px] text-muted-foreground">{customCaseSalePrice?.description}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="original-price">Original Price (₹)</Label>
              <Input 
                id="original-price"
                type="number" 
                value={customCaseOriginalPrice?.value || ''} 
                onChange={e => handleUpdateSetting('custom_case_original_price', e.target.value)}
                placeholder="499"
              />
              <p className="text-[10px] text-muted-foreground">{customCaseOriginalPrice?.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future settings */}
        <Card className="glass opacity-50 border-dashed">
          <CardHeader>
            <CardTitle>Other Settings</CardTitle>
            <CardDescription>More global configurations coming soon...</CardDescription>
          </CardHeader>
          <CardContent className="h-32 flex items-center justify-center text-muted-foreground text-sm italic">
            Tax rates, Shipping thresholds, and more will be added here.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
