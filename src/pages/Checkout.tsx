import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Address, Product, DeliveryMethod } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, Truck, Store, Plus, ArrowLeft, ShoppingBag, Loader2, CheckCircle2
} from 'lucide-react';

const SHIPPING_COST = 99;

const emptyAddress = {
  full_name: '', phone: '', address_line1: '', address_line2: '',
  city: '', state: '', postal_code: '', country: 'India',
};

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard_shipping');
  const [notes, setNotes] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<'details' | 'review'>('details');

  // New address dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [form, setForm] = useState(emptyAddress);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !authLoading) {
      // Allow staying if just placed order (handled by confirmation redirect)
    }
  }, [items]);

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user!.id)
      .order('is_default', { ascending: false });
    const addrs = (data as Address[]) || [];
    setAddresses(addrs);
    if (addrs.length > 0) {
      const def = addrs.find(a => a.is_default) || addrs[0];
      setSelectedAddressId(def.id);
    }
    setLoadingAddresses(false);
  };

  const handleSaveAddress = async () => {
    if (!form.full_name || !form.phone || !form.address_line1 || !form.city || !form.state || !form.postal_code) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setSavingAddress(true);
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...form, user_id: user!.id, is_default: addresses.length === 0 })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to save address', variant: 'destructive' });
    } else {
      const newAddr = data as Address;
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setForm(emptyAddress);
      setDialogOpen(false);
      toast({ title: 'Address added' });
    }
    setSavingAddress(false);
  };

  const shippingCost = deliveryMethod === 'store_pickup' ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (deliveryMethod === 'standard_shipping' && !selectedAddressId) {
      toast({ title: 'Select address', description: 'Please select a delivery address', variant: 'destructive' });
      return;
    }
    if (items.length === 0) {
      toast({ title: 'Cart empty', description: 'Add items to your cart first', variant: 'destructive' });
      return;
    }

    setPlacing(true);

    const shippingAddr = deliveryMethod === 'standard_shipping' && selectedAddress
      ? {
          full_name: selectedAddress.full_name,
          phone: selectedAddress.phone,
          address_line1: selectedAddress.address_line1,
          address_line2: selectedAddress.address_line2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postal_code: selectedAddress.postal_code,
          country: selectedAddress.country,
        }
      : null;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user!.id,
        subtotal,
        shipping_cost: shippingCost,
        total,
        delivery_method: deliveryMethod,
        shipping_address: shippingAddr,
        notes: notes || null,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      toast({ title: 'Error', description: 'Failed to place order', variant: 'destructive' });
      setPlacing(false);
      return;
    }

    // Create order items
    const orderItems = items.map(item => {
      const product = item.product as Product;
      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product?.name || 'Product',
        product_image: product?.images?.[0] || null,
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      toast({ title: 'Error', description: 'Order created but items failed to save', variant: 'destructive' });
      setPlacing(false);
      return;
    }

    // Clear cart
    await clearCart();
    setPlacing(false);
    navigate(`/order-confirmation/${order.id}`);
  };

  if (authLoading || loadingAddresses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Checkout</h1>

      {step === 'details' ? (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Method */}
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Delivery Method</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={v => setDeliveryMethod(v as DeliveryMethod)} className="grid gap-3 sm:grid-cols-2">
                  <Label htmlFor="shipping" className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${deliveryMethod === 'standard_shipping' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="standard_shipping" id="shipping" />
                    <div>
                      <p className="font-medium text-foreground">Standard Shipping</p>
                      <p className="text-xs text-muted-foreground">₹{SHIPPING_COST} · 3-5 business days</p>
                    </div>
                  </Label>
                  <Label htmlFor="pickup" className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${deliveryMethod === 'store_pickup' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="store_pickup" id="pickup" />
                    <div>
                      <p className="font-medium text-foreground">Store Pickup</p>
                      <p className="text-xs text-muted-foreground">Free · Ready in 1-2 hours</p>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {deliveryMethod === 'standard_shipping' && (
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Shipping Address</CardTitle>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4" /> New
                  </Button>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">No addresses saved</p>
                      <Button size="sm" onClick={() => setDialogOpen(true)}>Add Address</Button>
                    </div>
                  ) : (
                    <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId} className="space-y-3">
                      {addresses.map(addr => (
                        <Label key={addr.id} htmlFor={addr.id} className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                          <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{addr.full_name}</span>
                              {addr.is_default && <Badge variant="outline" className="text-xs">Default</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{addr.phone}</p>
                            <p className="text-sm text-muted-foreground">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.postal_code}</p>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-lg">Order Notes (optional)</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions for your order..." className="resize-none" rows={3} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border sticky top-4">
              <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-auto custom-scrollbar">
                  {items.map(item => {
                    const product = item.product as Product;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <img src={product?.images?.[0] || '/placeholder.svg'} alt={product?.name} className="w-12 h-12 rounded-md object-cover bg-secondary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product?.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-foreground">₹{((product?.price || 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>

                <Button
                  className="w-full neon-glow"
                  size="lg"
                  onClick={() => setStep('review')}
                  disabled={deliveryMethod === 'standard_shipping' && !selectedAddressId}
                >
                  Review Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Review Step */
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Review Your Order</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Delivery</h4>
                <p className="text-foreground">{deliveryMethod === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</p>
              </div>

              {deliveryMethod === 'standard_shipping' && selectedAddress && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Ship To</h4>
                  <p className="text-foreground">{selectedAddress.full_name}, {selectedAddress.phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedAddress.address_line1}{selectedAddress.address_line2 ? `, ${selectedAddress.address_line2}` : ''}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}</p>
                </div>
              )}

              {notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                  <p className="text-sm text-foreground">{notes}</p>
                </div>
              )}

              <Separator className="bg-border" />

              <div className="space-y-3">
                {items.map(item => {
                  const product = item.product as Product;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{product?.name} × {item.quantity}</span>
                      <span className="text-foreground">₹{((product?.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <Separator className="bg-border" />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
                <div className="flex justify-between font-semibold text-lg pt-2"><span>Total</span><span className="text-primary">₹{total.toLocaleString()}</span></div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('details')} className="flex-1">Edit</Button>
                <Button onClick={handlePlaceOrder} disabled={placing} className="flex-1 neon-glow gap-2">
                  {placing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <Label htmlFor={`checkout-${f.id}`}>{f.label}</Label>
                <Input id={`checkout-${f.id}`} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
            <Button onClick={handleSaveAddress} disabled={savingAddress} className="mt-2">
              {savingAddress ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
