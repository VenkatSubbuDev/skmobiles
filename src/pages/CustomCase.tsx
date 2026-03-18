import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import usePageMeta from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import { Upload, Smartphone, ImageIcon, ShieldCheck, CheckCircle2, IndianRupee, MapPin, Phone, Loader2 } from 'lucide-react';

declare global { interface Window { Razorpay: any; } }

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
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [salePrice, setSalePrice] = useState(299);
  const [originalPrice, setOriginalPrice] = useState(499);
  const SHIPPING_CHARGE = 0;

  useEffect(() => {
    if (user) {
      setCustomerName(user.user_metadata?.full_name || '');
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    supabase.from('site_settings' as any).select('*').then(({ data }: { data: any[] | null }) => {
      if (data) {
        const sp = data.find(s => s.key === 'custom_case_sale_price');
        const op = data.find(s => s.key === 'custom_case_original_price');
        if (sp) setSalePrice(Number(sp.value));
        if (op) setOriginalPrice(Number(op.value));
      }
    });

    supabase.from('brands' as any).select('*').eq('is_active', true).order('display_order').then(({ data }) => {
      if (data) setBrands(data as unknown as Brand[]);
    });
  }, []);

  useEffect(() => {
    if (!selectedBrand) { setModels([]); setSelectedModel(''); return; }
    supabase.from('models' as any).select('*').eq('brand_id', selectedBrand).eq('is_active', true).order('display_order').then(({ data }) => {
      if (data) setModels(data as unknown as Model[]);
      setSelectedModel('');
    });
  }, [selectedBrand]);

  const validateStep = (step: number) => {
    if (step === 1 && (!selectedBrand || !selectedModel)) return false;
    if (step === 2 && !imageFile) return false;
    if (step === 3 && (!customerName || !customerPhone || !address || !city || !state || !pincode)) return false;
    return true;
  };

  const nextStep = () => {
    if (!user && currentStep === 2) {
      toast({ title: 'Sign in required', description: 'Please sign in to proceed' });
      navigate('/auth?redirect=/custom-case');
      return;
    }
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({ title: 'Required Fields', description: 'Please complete all fields in this step', variant: 'destructive' });
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

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
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to place an order' });
      navigate('/auth?redirect=/custom-case');
      return;
    }
    if (!selectedBrand || !selectedModel || !imageFile || !customerName || !customerPhone || !address || !city || !state || !pincode) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    if (customerPhone.length < 10) {
      toast({ title: 'Invalid Phone', description: 'Please enter a valid 10-digit mobile number', variant: 'destructive' });
      return;
    }
    if (pincode.length !== 6) {
      toast({ title: 'Invalid Pincode', description: 'Please enter a valid 6-digit pincode', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const totalAmount = salePrice * quantity;

    try {
      // 1. Upload image
      const ext = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('case-images').upload(fileName, imageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('case-images').getPublicUrl(fileName);

      // 2. Prepare Razorpay
      const loadRazorpay = () => new Promise(res => {
        if (window.Razorpay) return res(true);
        const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => res(true); s.onerror = () => res(false); document.body.appendChild(s);
      });

      const rzKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const isRazorpayConfigured = !!rzKey && !rzKey.includes('XXXX');
      const rzReady = await loadRazorpay();

      if (!isRazorpayConfigured || !rzReady) {
        throw new Error('Payment gateway not configured. Please set a valid VITE_RAZORPAY_KEY_ID and try again.');
      }

      // 3. Create Razorpay Order via Edge Function
      const { data: rzOrder, error: rzErr } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: totalAmount, receipt: `custom-${Date.now()}` }
      });
      if (rzErr || !rzOrder?.id) throw new Error('Failed to initialize payment');

      // 4. Open Razorpay
      // 5. Create Order upfront as pending
      const { data: order, error: orderErr } = await (supabase.from('custom_case_orders') as any).insert({
        user_id: user.id, brand_id: selectedBrand, model_id: selectedModel, image_url: publicUrl,
        customer_name: customerName, customer_phone: customerPhone, customer_email: customerEmail || null,
        shipping_address: address, city, state, pincode, quantity, price: totalAmount,
        payment_status: 'pending',
        status: 'pending',
        order_number: 'TEMP'
      }).select().single();

      if (orderErr) throw orderErr;

      // 6. Finalize Verification on Success
      const options = {
        key: rzKey, amount: rzOrder.amount, currency: rzOrder.currency, name: 'SK Mobiles',
        description: `Custom Case for ${models.find(m => m.id === selectedModel)?.name}`,
        order_id: rzOrder.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
                table: 'custom_case_orders'
              }
            });

            if (verifyRes.error) throw new Error(verifyRes.error.message || 'Verification failed');

            setOrderPlaced(true);
            // Fetch updated order for the final order number
            const { data: updatedOrder } = await (supabase.from('custom_case_orders') as any).select('order_number').eq('id', order.id).single();
            setOrderNumber(updatedOrder?.order_number || order.id);
            toast({ title: '🎉 Order placed!', description: `Order ${updatedOrder?.order_number || ''} confirmed.` });
            
            // Trigger WhatsApp notification
            const waMessage = `New Custom Case Order! %0AOrder: ${updatedOrder?.order_number || ''}%0AModel: ${models.find(m => m.id === selectedModel)?.name}%0AAmount: ₹${totalAmount}`;
            window.open(`https://wa.me/918688575044?text=${waMessage}`, '_blank');
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            toast({ 
              title: 'Payment Verification Error', 
              description: 'Your payment was successful but verification failed. Please contact support.', 
              variant: 'destructive' 
            });
          }
        },
        prefill: { name: customerName, email: customerEmail, contact: customerPhone },
        theme: { color: '#0ea5e9' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({ title: 'Order Failed', description: err.message, variant: 'destructive' });
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
            <Button onClick={() => { setOrderPlaced(false); setImageFile(null); setImagePreview(null); setCustomerName(''); setCustomerPhone(''); setAddress(''); setCity(''); setState(''); setPincode(''); setQuantity(1); }} className="w-full">
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
        <div className="container mx-auto text-center max-w-2xl px-4">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">🔥 Premium Quality</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Design Your Custom Case</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Upload any photo — your loved ones, celebrities, landscapes — we print it on an unbreakable case!
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-primary flex items-center"><IndianRupee className="w-6 h-6" />{salePrice}</span>
            <span className="text-xl text-muted-foreground line-through flex items-center"><IndianRupee className="w-4 h-4" />{originalPrice}</span>
            <Badge variant="destructive" className="animate-pulse">FREE SHIPPING</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex justify-between items-center relative">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                  currentStep >= step ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                )}>
                  {step < currentStep ? "✓" : step}
                </div>
                <span className="text-[10px] mt-2 uppercase tracking-wider font-semibold text-muted-foreground">
                  {step === 1 ? "Model" : step === 2 ? "Photo" : step === 3 ? "Details" : "Review"}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Features (only on Step 1) */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, label: 'Unbreakable', desc: 'Military grade protection' },
              { icon: ImageIcon, label: 'HD Print', desc: 'Vibrant photo quality' },
              { icon: Smartphone, label: 'All Models', desc: '500+ phone models' },
              { icon: Upload, label: 'Easy Upload', desc: 'Any photo works' },
            ].map((f, i) => (
              <Card key={i} className="glass text-center card-hover overflow-hidden">
                <CardContent className="p-4">
                  <f.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-sm">{f.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="max-w-2xl mx-auto space-y-6">
          {currentStep === 1 && (
            <Card className="glass border-border/50 animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" /> Select Your Phone
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
                <Button onClick={nextStep} className="w-full mt-4" disabled={!selectedBrand || !selectedModel}>
                  Continue to Upload Photo
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="glass border-border/50 animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" /> Upload Your Photo
                </h2>
                <div className="space-y-2">
                  <Label>Photo to Print * (Max 10MB)</Label>
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
                          <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                          <p className="text-sm text-primary font-medium">✓ Click to change photo</p>
                        </div>
                      ) : (
                        <div className="space-y-2 py-4">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground font-medium">Click to upload your photo</p>
                          <p className="text-xs text-muted-foreground">High resolution photos work best</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                  <Button onClick={nextStep} className="flex-[2]" disabled={!imageFile}>Continue to Shipping</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="glass border-border/50 animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Shipping Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Recipient Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" value={customerPhone} onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0,10))} placeholder="10-digit mobile" required />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email (Optional)</Label>
                    <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="For order updates" />
                  </div>
                  <div className="space-y-2">
                    <Label>PIN Code *</Label>
                    <Input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="6-digit Pincode" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Full Residential Address *</Label>
                  <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Building, Street, Area..." required rows={2} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" required />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Input value={state} onChange={e => setState(e.target.value)} placeholder="State" required />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                  <Button onClick={nextStep} className="flex-[2]">Review Order</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <Card className="glass border-primary/30 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary/5 p-4 border-b border-primary/10">
                    <h2 className="font-bold flex items-center gap-2 text-primary">
                      <CheckCircle2 className="w-5 h-5" /> Review Your Custom Case
                    </h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3">
                        <p className="text-xs uppercase tracking-tighter text-muted-foreground mb-2">Design Preview</p>
                        {imagePreview && (
                          <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border shadow-inner bg-muted">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-tighter text-muted-foreground">Mobile Model</p>
                          <p className="font-bold text-lg">{brands.find(b => b.id === selectedBrand)?.name} {models.find(m => m.id === selectedModel)?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-tighter text-muted-foreground">Shipping To</p>
                          <p className="font-medium">{customerName}</p>
                          <p className="text-sm text-muted-foreground">{address}</p>
                          <p className="text-sm text-muted-foreground">{city}, {state} - {pincode}</p>
                          <p className="text-sm text-muted-foreground">Phone: {customerPhone}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="font-bold text-2xl text-primary">₹{(salePrice * quantity).toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">Includes GST & Free Shipping</p>
                          </div>
                          <div className="text-right">
                             <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Quantity: {quantity}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep} size="lg" className="flex-1" disabled={submitting}>Back</Button>
                <Button onClick={handleSubmit} size="lg" className="flex-[2] neon-glow py-7" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Processing...</span>
                  ) : (
                    `Place Order — ₹${(salePrice * quantity).toLocaleString()}`
                  )}
                </Button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">Secure Payment • Free Shipping all over India</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

