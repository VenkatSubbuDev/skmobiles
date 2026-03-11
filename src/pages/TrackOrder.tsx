import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

type TrackingStatus = 'ordered' | 'processing' | 'dispatched' | 'out_for_delivery' | 'delivered';

const statusSteps: { key: TrackingStatus; label: string; icon: typeof Package }[] = [
  { key: 'ordered', label: 'Order Placed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'dispatched', label: 'Dispatched', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

// Demo tracking data for display purposes
const demoOrders: Record<string, { status: TrackingStatus; courier: string; trackingId: string; eta: string }> = {
  'SKM-001': {
    status: 'out_for_delivery',
    courier: 'BlueDart',
    trackingId: 'BD-9876543210',
    eta: 'Today by 8:00 PM',
  },
  'SKM-002': {
    status: 'dispatched',
    courier: 'DTDC',
    trackingId: 'DTDC-1234567890',
    eta: '12 March 2025',
  },
};

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<typeof demoOrders[string] | null | 'not_found'>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    const order = demoOrders[orderId.toUpperCase()];
    setResult(order || 'not_found');
  };

  const currentStepIndex =
    result && result !== 'not_found'
      ? statusSteps.findIndex((s) => s.key === result.status)
      : -1;

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Track Your <span className="gradient-text">Order</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your order ID and registered email to see the latest delivery status.
          </p>
        </div>

        {/* Track Form */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="e.g. SKM-001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Registered Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 neon-glow"
              >
                {loading ? (
                  'Tracking...'
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        {result === 'not_found' && (
          <Card className="bg-card border-border border-red-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-red-400 font-medium mb-2">Order not found</p>
              <p className="text-sm text-muted-foreground">
                We could not find an order with ID <strong>{orderId}</strong>. Please check the order ID and email
                address.{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact support
                </Link>{' '}
                if you need help.
              </p>
            </CardContent>
          </Card>
        )}

        {result && result !== 'not_found' && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold">{orderId.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Courier</p>
                  <p className="font-semibold">{result.courier}</p>
                  <p className="text-xs text-primary">{result.trackingId}</p>
                </div>
              </div>

              {result.eta && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 text-center">
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold text-primary">{result.eta}</p>
                </div>
              )}

              {/* Progress Steps */}
              <div className="space-y-4">
                {statusSteps.map(({ key, label, icon: Icon }, index) => {
                  const completed = index <= currentStepIndex;
                  const active = index === currentStepIndex;
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          completed
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-transparent border-border text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`font-medium ${active ? 'text-primary' : completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label}
                        {active && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{' '}
          <Link to="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
