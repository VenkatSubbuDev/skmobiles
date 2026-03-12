import usePageMeta from "@/hooks/usePageMeta";

export default function Privacy() {
  usePageMeta({ title: "Privacy Policy" });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">Introduction</h2>
          <p>
            At SK Mobiles, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
          <p className="mb-2">We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Register on the Website</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us</li>
          </ul>
          <p className="mt-2">
            This information may include: name, email address, phone number, shipping address, 
            and payment information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
          <p className="mb-2">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Process your orders and transactions</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your customer service requests</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties 
            except as necessary to complete your order (e.g., shipping companies, payment processors).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. 
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at 
            support@skmobiles.com.
          </p>
        </section>
      </div>
    </div>
  );
}
