import { Smartphone, Users, Award, Truck, Shield, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { label: 'Happy Customers', value: '50,000+', icon: Users },
  { label: 'Products Available', value: '1,200+', icon: Smartphone },
  { label: 'Years in Business', value: '8+', icon: Award },
  { label: 'Cities Served', value: '500+', icon: Truck },
];

const values = [
  {
    icon: Shield,
    title: 'Quality Assured',
    description:
      'Every product we sell goes through rigorous quality checks. We only stock genuine accessories from trusted brands.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description:
      'We partner with top logistics providers to ensure your order reaches you quickly and safely across India.',
  },
  {
    icon: Star,
    title: 'Customer First',
    description:
      'Our support team is available 7 days a week to help with any queries, returns, or product guidance.',
  },
  {
    icon: Award,
    title: 'Best Prices',
    description:
      'We negotiate directly with manufacturers and distributors to offer the most competitive prices in the market.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary mb-6">
            <Smartphone className="h-4 w-4" />
            Est. 2016 &middot; Nandyal, Andhra Pradesh, India
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">SK Mobiles</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SK Mobiles is a trusted destination for premium mobile accessories, based in Nandyal, Andhra Pradesh.
            We have grown from a local shop to a platform serving thousands of customers across India with
            quality products at honest prices.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-border/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold gradient-text">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                SK Mobiles was founded in 2016 in Nandyal, Andhra Pradesh by a mobile technology enthusiast who
                noticed a gap in the market for affordable yet high-quality mobile accessories. Starting with a
                modest shop on the Mainroad in Gospadu Mandal, the brand quickly earned a reputation for genuine
                products and exceptional service.
              </p>
              <p>
                Today, SK Mobiles serves customers across India, stocking products spanning smartphones, cases,
                chargers, earphones, earbuds, screen protectors, and more - all at the fairest possible price.
              </p>
              <p>
                Our mission remains simple: bring the best mobile accessories to every Indian home backed by
                reliable, friendly after-sales support.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-border p-8 flex flex-col items-center justify-center gap-4">
              <Smartphone className="h-20 w-20 text-primary" />
              <p className="text-2xl font-bold gradient-text">SK Mobiles</p>
              <p className="text-sm text-muted-foreground text-center">
                Yallur Vi, Mainroad, Gospadu Mandal<br />
                Nandyal Dist, Andhra Pradesh - 518501
              </p>
              <p className="text-sm text-primary">+91 99892 99892</p>
              <p className="text-sm text-muted-foreground">Skmobiles@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose SK Mobiles?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
