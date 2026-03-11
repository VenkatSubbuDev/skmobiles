import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3-7 business days across India. Express delivery (1-2 business days) is available in select cities for an additional charge.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders above Rs.999. Orders below Rs.999 incur a flat shipping fee of Rs.49.',
      },
      {
        q: 'Can I track my order?',
        a: 'Absolutely. Once your order is dispatched, you will receive an email and SMS with a tracking link. You can also track orders from the "Track Order" page using your order ID.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we ship only within India. We are working on expanding to international markets soon.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a hassle-free 7-day return policy for all products. Items must be unused, in their original packaging, and accompanied by the original invoice.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Log in to your account, navigate to "My Orders", select the item you want to return, and click "Request Return". Our team will arrange a pickup within 2 business days.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once we receive and inspect the returned item, refunds are processed within 5-7 business days. The amount is credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Products & Authenticity',
    items: [
      {
        q: 'Are all products genuine?',
        a: 'Yes, 100%. SK Mobiles is an authorised reseller for all brands we carry. Every product comes with a manufacturer warranty where applicable.',
      },
      {
        q: 'Do you sell used or refurbished products?',
        a: 'No. We sell only brand-new, sealed products. All items are sourced directly from authorised distributors.',
      },
      {
        q: 'What warranty do products come with?',
        a: 'Warranty varies by product and brand. Most accessories carry a 6-month to 1-year manufacturer warranty. Warranty details are listed on each product page.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery.',
      },
      {
        q: 'Is Cash on Delivery available?',
        a: 'Yes, Cash on Delivery (COD) is available on orders up to Rs.5,000 in most pin codes across India.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use industry-standard SSL encryption and do not store your card details on our servers. All payments are processed through PCI-DSS compliant payment gateways.',
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Find quick answers to the most common questions about shopping at SK Mobiles.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqs.map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 text-primary">{category}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {items.map(({ q, a }) => (
                  <AccordionItem
                    key={q}
                    value={q}
                    className="bg-card border border-border rounded-lg px-4 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-primary/10 border border-primary/20">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is available Monday to Saturday, 9 AM - 8 PM IST.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
