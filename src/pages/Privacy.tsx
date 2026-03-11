import { Shield } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you use SK Mobiles, we collect the following types of information:

Personal Information: Name, email address, phone number, and delivery address when you create an account or place an order.

Payment Information: We do not store your card details. Payments are processed securely through PCI-DSS compliant third-party payment gateways.

Usage Data: Pages visited, products viewed, search queries, device type, browser type, and IP address, collected via cookies and analytics tools.

Communications: If you contact our support team, we retain records of those communications to resolve disputes and improve service.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

- Process and fulfil your orders, including shipping and delivery notifications.
- Send order confirmations, invoices, and support communications.
- Personalise your shopping experience with relevant product recommendations.
- Send promotional emails and offers (you may opt out at any time).
- Detect and prevent fraud and security incidents.
- Comply with legal obligations under Indian law.`,
  },
  {
    title: '3. Sharing Your Information',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your data with:

Logistics Partners: Name, address, and phone number are shared with delivery partners to fulfil your orders.

Payment Processors: Encrypted payment data is shared with our payment gateway providers.

Service Providers: Analytics, cloud hosting, and customer support tools that help us operate the platform under strict confidentiality agreements.

Legal Authorities: We may disclose information when required by law, court order, or government regulation.`,
  },
  {
    title: '4. Cookies',
    content: `We use cookies and similar tracking technologies to enhance your experience. Cookies help us remember your preferences, keep your cart intact, and analyse site traffic.

You can control cookies through your browser settings. Disabling cookies may affect the functionality of some features on the website. For more details, please read our Cookie Policy.`,
  },
  {
    title: '5. Data Security',
    content: `We implement industry-standard security measures including SSL/TLS encryption, secure server infrastructure, and access controls to protect your personal data from unauthorised access, alteration, disclosure, or destruction.

However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide services. If you request deletion of your account, we will remove your data within 30 days, except where retention is required by law (e.g., financial records retained for 7 years per Indian accounting laws).`,
  },
  {
    title: '7. Your Rights',
    content: `Under applicable Indian data protection laws, you have the right to:

- Access the personal data we hold about you.
- Request correction of inaccurate data.
- Request deletion of your data (subject to legal obligations).
- Opt out of marketing communications at any time.
- Lodge a complaint with the relevant data protection authority.

To exercise these rights, contact us at Skmobiles@gmail.com.`,
  },
  {
    title: "8. Children's Privacy",
    content: `SK Mobiles is not intended for children under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a minor, please contact us immediately.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a prominent notice on our website. The date of the last update is displayed below.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us:

SK Mobiles
Email: Skmobiles@gmail.com
Phone: +91 99892 99892
Address: Yallur Vi, Mainroad, Gospadu Mandal, Nandyal Dist, Andhra Pradesh, India - 518501`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-muted-foreground">Last updated: 1 January 2025</p>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
            Your privacy is important to us. This policy explains what information we collect, how we use it, and the
            rights you have over your data.
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
