import { RotateCcw, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const eligible = [
  'Item received is damaged or defective',
  'Wrong item delivered',
  'Item is missing accessories or components',
  'Product does not match the description on the website',
];

const notEligible = [
  'Items returned after 7 days of delivery',
  'Used, washed, or altered products',
  'Products without original packaging or invoice',
  'Consumables (screen protector films once applied)',
];

const returnSteps = [
  {
    icon: Package,
    step: '1. Initiate Return',
    desc: 'Log in to your account, go to My Orders, select the item, and click "Request Return". Fill in the reason and upload photos if required.',
  },
  {
    icon: CheckCircle,
    step: '2. Approval',
    desc: 'Our team reviews your request within 24 hours and approves it if it meets the return criteria.',
  },
  {
    icon: RotateCcw,
    step: '3. Pickup Arranged',
    desc: 'Once approved, a pickup is scheduled within 2 business days from your delivery address.',
  },
  {
    icon: Clock,
    step: '4. Refund Processed',
    desc: 'After the item is received and inspected, your refund is processed within 5-7 business days to the original payment method.',
  },
];

export default function Returns() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <RotateCcw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Returns & <span className="gradient-text">Refunds</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We want you to be completely satisfied with every purchase. If something is not right, we make returns
            easy.
          </p>
        </div>

        {/* Policy Summary */}
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 mb-12 text-center">
          <p className="text-xl font-semibold">
            <span className="gradient-text">7-Day</span> hassle-free return policy on all eligible products.
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Returns must be initiated within 7 days of delivery.
          </p>
        </div>

        {/* Eligible / Not Eligible */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-400">
                <CheckCircle className="h-5 w-5" /> Eligible for Return
              </h2>
              <ul className="space-y-2">
                {eligible.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-red-400">
                <XCircle className="h-5 w-5" /> Not Eligible for Return
              </h2>
              <ul className="space-y-2">
                {notEligible.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* How to Return */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">How to Return an Item</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {returnSteps.map(({ icon: Icon, step, desc }) => (
              <Card key={step} className="bg-card border-border">
                <CardContent className="pt-6 flex gap-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">{step}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <div className="text-center p-6 rounded-2xl bg-secondary/30 border border-border">
          <p className="text-muted-foreground mb-2">Need help with a return or have questions?</p>
          <Link to="/contact" className="text-primary font-medium hover:underline">
            Contact our support team &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
