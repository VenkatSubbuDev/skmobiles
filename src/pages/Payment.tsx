import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, QrCode, Copy, CheckCircle2, Smartphone, Zap } from 'lucide-react';
import RazorpayButton from '@/components/common/RazorpayButton';
import { useNavigate } from 'react-router-dom';

/* ─── Business UPI details ─────────────────────────────────────── */
// Update these with the actual UPI VPA and QR image URL for SK Mobiles
const UPI_VPA = 'skmobiles@upi';           // <- Replace with actual UPI ID
const UPI_QR_URL = '';                      // <- Paste a hosted QR image URL, or leave empty to show generated QR

/* ─── Payment methods displayed on the pay tab ──────────────────── */
const PAYMENT_METHODS = [
  { icon: '💳', label: 'Credit / Debit Card' },
  { icon: '📱', label: 'UPI (GPay, PhonePe, Paytm…)' },
  { icon: '🏦', label: 'Net Banking' },
  { icon: '👝', label: 'Wallets' },
];

export default function Payment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  /* Direct pay state */
  const [amount, setAmount] = useState('');
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [paid, setPaid] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState('');

  /* UPI copy state */
  const [copied, setCopied] = useState(false);

  const numericAmount = parseFloat(amount) || 0;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_VPA).then(() => {
      setCopied(true);
      toast({ title: 'Copied!', description: `UPI ID "${UPI_VPA}" copied to clipboard.` });
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleSuccess = (paymentId: string) => {
    setLastPaymentId(paymentId);
    setPaid(true);
    setAmount('');
  };

  if (paid) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/30">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-1">Thank you for your payment to SK Mobiles.</p>
        {lastPaymentId && (
          <p className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded px-3 py-1 inline-block mt-2">
            Payment ID: {lastPaymentId}
          </p>
        )}
        <div className="flex gap-3 justify-center mt-8">
          <Button variant="outline" onClick={() => setPaid(false)}>Make Another Payment</Button>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <CreditCard className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pay SK Mobiles</h1>
        <p className="text-muted-foreground mt-1">Secure payment powered by Razorpay</p>
      </div>

      <Tabs defaultValue="pay" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="pay" className="gap-2">
            <CreditCard className="h-4 w-4" /> Pay Online
          </TabsTrigger>
          <TabsTrigger value="upi" className="gap-2">
            <QrCode className="h-4 w-4" /> UPI / QR
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Direct Pay ─────────────────────────────── */}
        <TabsContent value="pay">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Enter Payment Details</CardTitle>
              <CardDescription>All major UPI apps, cards, and net banking supported</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment method badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {PAYMENT_METHODS.map(m => (
                  <span key={m.label} className="text-xs bg-secondary/60 border border-border rounded-full px-3 py-1 flex items-center gap-1">
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>

              <Separator />

              {/* Amount */}
              <div className="space-y-1">
                <Label htmlFor="pay-amount">Amount (₹) <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                  <Input
                    id="pay-amount"
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="pl-8 text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="pay-desc">Description (optional)</Label>
                <Input
                  id="pay-desc"
                  placeholder="e.g. Screen replacement, Custom case, etc."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>

              <Separator />

              {/* Customer prefill */}
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Your Details (auto-fills checkout)</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="pay-name">Name</Label>
                  <Input id="pay-name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pay-phone">Phone</Label>
                  <Input id="pay-phone" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="pay-email">Email</Label>
                <Input id="pay-email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <Separator />

              {/* Total preview */}
              {numericAmount > 0 && (
                <div className="flex justify-between items-center bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                  <span className="text-sm text-muted-foreground">You will pay</span>
                  <span className="text-xl font-bold text-primary">₹{numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <RazorpayButton
                amount={numericAmount}
                description={desc || 'Payment to SK Mobiles'}
                prefill={{ name, email, contact: phone }}
                onSuccess={handleSuccess}
                label={numericAmount > 0 ? `Pay ₹${numericAmount.toLocaleString('en-IN')}` : 'Pay Now'}
                className="w-full"
                disabled={numericAmount <= 0}
              />

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" /> Powered by Razorpay · 256-bit SSL secured
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: UPI QR ─────────────────────────────────── */}
        <TabsContent value="upi">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" /> Pay via UPI
              </CardTitle>
              <CardDescription>Scan the QR code below or copy the UPI ID to pay from any UPI app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-52 h-52 bg-white rounded-2xl border-2 border-border flex items-center justify-center overflow-hidden shadow-lg">
                  {UPI_QR_URL ? (
                    <img
                      src={UPI_QR_URL}
                      alt="SK Mobiles UPI QR Code"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    /* Fallback: generate a QR via Google Charts API */
                    <img
                      src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(`upi://pay?pa=${UPI_VPA}&pn=SK%20Mobiles&cu=INR`)}&choe=UTF-8`}
                      alt="SK Mobiles UPI QR Code"
                      className="w-full h-full object-contain p-2"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Open GPay, PhonePe, Paytm, or any UPI app → Scan QR
                </p>
              </div>

              <Separator />

              {/* UPI ID copy */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">UPI ID</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground">
                    {UPI_VPA}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 transition-all ${copied ? 'border-green-500 text-green-600' : ''}`}
                    onClick={handleCopyUPI}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* UPI app icons (decorative) */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Accepted UPI Apps</p>
                <div className="flex flex-wrap gap-2">
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'Cred'].map(app => (
                    <span key={app} className="text-xs bg-secondary/60 border border-border rounded-full px-3 py-1">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-amber-600 mb-1">💡 After payment, please share the screenshot</p>
                <p className="text-xs">WhatsApp us the payment screenshot at our store number for quick order processing.</p>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
