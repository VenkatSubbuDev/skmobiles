import { FileText } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the SK Mobiles website, mobile application, or any related services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and customers. SK Mobiles reserves the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.`,
  },
  {
    title: '2. Use of the Platform',
    content: `You may use the SK Mobiles platform only for lawful purposes and in accordance with these terms. You agree not to:

- Use the platform in any way that violates applicable local, national, or international law.
- Transmit any unsolicited or unauthorised advertising or promotional material.
- Attempt to gain unauthorised access to any part of the platform or its related systems.
- Use automated tools, bots, or scrapers to access or collect data from the platform.
- Submit false or fraudulent orders.`,
  },
  {
    title: '3. Account Registration',
    content: `To place an order, you must create an account on SK Mobiles. You are responsible for:

- Maintaining the confidentiality of your account credentials.
- All activities that occur under your account.
- Providing accurate, current, and complete information during registration.

If you suspect any unauthorised use of your account, contact us immediately at Skmobiles@gmail.com.`,
  },
  {
    title: '4. Products & Pricing',
    content: `All product descriptions, images, and specifications are provided for informational purposes. While we strive for accuracy, we do not warrant that product descriptions are error-free.

Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. SK Mobiles reserves the right to modify prices at any time without prior notice. The price applicable to your order is the price displayed at the time of checkout.`,
  },
  {
    title: '5. Orders & Payment',
    content: `By placing an order, you are making an offer to purchase the selected products. SK Mobiles reserves the right to accept or decline any order.

Payment must be completed at the time of placing the order. We accept UPI, Credit/Debit Cards, Net Banking, popular wallets, and Cash on Delivery (COD) for eligible orders. All online transactions are secured through SSL encryption.`,
  },
  {
    title: '6. Cancellations',
    content: `You may cancel an order before it is dispatched by contacting our support team or via your account dashboard. Once an order is dispatched, it cannot be cancelled; you must initiate a return after delivery.

SK Mobiles reserves the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity. A full refund will be issued for cancelled orders within 5-7 business days.`,
  },
  {
    title: '7. Intellectual Property',
    content: `All content on the SK Mobiles platform - including text, graphics, logos, images, and software - is the property of SK Mobiles or its content suppliers and is protected by Indian and international copyright laws.

You may not reproduce, distribute, modify, or create derivative works from any content on this platform without our express written consent.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the fullest extent permitted by law, SK Mobiles shall not be liable for:

- Any indirect, incidental, or consequential damages arising from your use of the platform.
- Loss of profits, data, or business opportunities.
- Delays or failures in delivery caused by third-party logistics providers.
- Damage caused by defective products beyond our standard warranty terms.

Our maximum liability for any claim arising out of these terms shall not exceed the amount paid by you for the specific order giving rise to the claim.`,
  },
  {
    title: '9. Governing Law',
    content: `These Terms and Conditions are governed by the laws of India. Any disputes arising from your use of SK Mobiles shall be subject to the exclusive jurisdiction of the courts located in Nandyal, Andhra Pradesh.`,
  },
  {
    title: '10. Contact',
    content: `For questions about these Terms and Conditions, please contact:

SK Mobiles
Email: Skmobiles@gmail.com
Phone: +91 99892 99892
Address: Yallur Vi, Mainroad, Gospadu Mandal, Nandyal Dist, Andhra Pradesh, India - 518501`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-muted-foreground">Last updated: 1 January 2025</p>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
            Please read these Terms and Conditions carefully before using the SK Mobiles platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title} className="border-b border-border/50 pb-8 last:border-0">
              <h2 className="text-xl font-semibold mb-3">{title}</h2>
              <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{content}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
