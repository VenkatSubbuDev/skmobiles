import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import usePageMeta from '@/hooks/usePageMeta';
import { Upload, Smartphone, ImageIcon, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface Model {
  id: string;
  brand_id: string;
  name: string;
}

export default function CustomCase() {
  usePageMeta({ title: 'Custom Case Builder - Design Your Own Phone Case' });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();

  const SALE_PRICE = 199;
  const ORIGINAL_PRICE = 249;

  useEffect(() => {
    supabase.from('brands' as any).select('*').eq('is_active', true).order('display_order').then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedBrand) { setModels([]); setSelectedModel(''); return; }
    supabase.from('models' as any).select('*').eq('brand_id', selectedBrand).eq('is_active', true).order('display_order').then(({ data }) => {
      if (data) setModels(data);
      setSelectedModel('');
    });
  }, [selectedBrand]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image under 10MB', variant: 'destructive' });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !imageFile || !customerName || !customerPhone || !shippingAddress) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // Upload image
      const ext = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('case-images').upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('case-images').getPublicUrl(fileName);

      // Create order
      const { data, error } = await supabase.from('custom_case_orders').insert({
        brand_id: selectedBrand,
        model_id: selectedModel,
        image_url: publicUrl,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        shipping_address: shippingAddress,
        quantity,
        price: SALE_PRICE * quantity,
        order_number: 'TEMP', // trigger will replace
      }).select('order_number').single();

      if (error) throw error;

      setOrderPlaced(true);
      setOrderNumber(data.order_number);
      toast({ title: '🎉 Order placed!', description: `Your custom case order ${data.order_number} has been placed.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass border-primary/30 text-center">
          <CardContent className="p-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">Order Confirmed!</h2>
            <p className="text-muted-foreground">Your custom case is being prepared</p>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-xl font-mono font-bold text-primary">{orderNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">We'll contact you on your phone number for order updates and payment confirmation.</p>
            <Button onClick={() => { setOrderPlaced(false); setImageFile(null); setImagePreview(null); setCustomerName(''); setCustomerPhone(''); setShippingAddress(''); setQuantity(1); }} className="w-full">
              Design Another Case
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-background via-card to-background py-12 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🔥 Limited Offer</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Design Your Custom Case</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Upload any photo — your loved ones, celebrities, landscapes — we print it on an unbreakable case!
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-primary flex items-center"><IndianRupee className="w-6 h-6" />199</span>
            <span className="text-xl text-muted-foreground line-through flex items-center"><IndianRupee className="w-4 h-4" />249</span>
            <Badge variant="destructive" className="animate-pulse">20% OFF</Badge>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: ShieldCheck, label: 'Unbreakable', desc: 'Military grade protection' },
            { icon: ImageIcon, label: 'HD Print', desc: 'Vibrant photo quality' },
            { icon: Smartphone, label: 'All Models', desc: '500+ phone models' },
            { icon: Upload, label: 'Easy Upload', desc: 'Any photo works' },
          ].map((f, i) => (
            <Card key={i} className="glass text-center card-hover">
              <CardContent className="p-4">
                <f.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <Card className="glass border-border/50">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" /> Step 1: Select Your Phone
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mobile Brand *</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>
                      {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model *</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                    <SelectTrigger><SelectValue placeholder={selectedBrand ? 'Select model' : 'Select brand first'} /></SelectTrigger>
                    <SelectContent>
                      {models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Step 2: Upload Your Photo
              </h2>
              <div className="space-y-2">
                <Label>Upload Image * (Max 10MB, JPG/PNG)</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                        <p className="text-sm text-primary">✓ Image selected — click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Click or drag to upload your photo</p>
                        <p className="text-xs text-muted-foreground">This photo will be printed on your case</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-semibold">Step 3: Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="10 digit mobile number" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email (optional)</Label>
                <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Shipping Address *</Label>
                <Textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="Full address with pincode" required rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min={1} max={10} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card className="glass border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Price per case</span>
                <div className="flex items-center gap-2">
                  <span className="line-through text-muted-foreground text-sm">₹{ORIGINAL_PRICE}</span>
                  <span className="font-bold text-primary">₹{SALE_PRICE}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Quantity</span>
                <span>{quantity}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">₹{SALE_PRICE * quantity}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">💰 You save ₹{(ORIGINAL_PRICE - SALE_PRICE) * quantity}!</p>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full text-lg neon-glow" disabled={submitting}>
            {submitting ? 'Placing Order...' : `🛒 Place Order — ₹${SALE_PRICE * quantity}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Cash on Delivery available • Free shipping on orders above ₹499</p>
        </form>
      </div>
    </div>
  );
}
