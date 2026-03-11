import { Truck, Package, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const shippingOptions = [
  {
    name: 'Standard Shipping',
    time: '3-7 Business Days',
    cost: 'Free on orders above Rs.999 | Rs.49 below',
    description: 'Available across 25,000+ pin codes in India.',
    icon: Package,
  },
  {
    name: 'Express Shipping',
    time: '1-2 Business Days',
    cost: 'Rs.99 flat',
    description: 'Available in major metros: Hyderabad, Mumbai, Delhi, Bangalore, Chennai, Kolkata, Pune.',
    icon: Truck,
  },
];

const steps = [
  { step: '1', title: 'Order Placed', desc: 'Your order is confirmed and payment is verified.' },
  { step: '2', title: 'Processing', desc: 'Items are picked, packed, and quality-checked within 24 hours.' },
  { step: '3', title: 'Dispatched', desc: 'Your package is handed to our logistics partner. You receive a tracking ID.' },
  { step: '4', title: 'Out for Delivery', desc: 'Package is with the delivery agent, en route to your address.' },
  { step: '5', title: 'Delivered', desc: 'Package is delivered. Please inspect before signing.' },
];

export default function Shipping() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Shipping <span className="gradient-text">Information</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We partner with leading logistics providers to deliver your order safely and on time across India.
          </p>
        </div>

        {/* Shipping Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Shipping Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {shippingOptions.map(({ name, time, cost, description, icon: Icon }) => (
              <Card key={name} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground font-medium">Cost:</span>
                    <span className="text-foreground">{cost}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Order Journey */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Order's Journey</h2>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }, index) => (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {step}
                  </div>
                  {index < steps.length - 1 && <div className="w-0.5 h-8 bg-border mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pin Code Coverage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Delivery Coverage</h2>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              We currently deliver to 25,000+ pin codes across all Indian states and union territories. During
              checkout, enter your pin code to verify delivery availability and estimated delivery time.
            </p>
          </div>
        </section>

        {/* Important Notes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
          <div className="space-y-3">
            {[
              'Delivery times are estimates and may vary during peak seasons, public holidays, or due to unforeseen circumstances.',
              'Ensure your delivery address and phone number are accurate at the time of ordering.',
              'For bulky or high-value orders, a signature may be required at delivery.',
              'If you are unavailable at delivery, the courier will attempt re-delivery once more before returning to the hub.',
            ].map((note) => (
              <div key={note} className="flex gap-3 items-start">
                <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
