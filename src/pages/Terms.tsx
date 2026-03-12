import usePageMeta from "@/hooks/usePageMeta";

export default function Terms() {
  usePageMeta({ title: "Terms of Service" });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">Acceptance of Terms</h2>
          <p>
            By accessing and using the SK Mobiles website, you accept and agree to be bound 
            by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Use License</h2>
          <p>
            Permission is granted to temporarily use SK Mobiles for personal, non-commercial use only. 
            This is the grant of a license, not a transfer of title.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Product Information</h2>
          <p className="mb-2">
            We strive to provide accurate product descriptions and pricing. However:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Product colors may vary slightly from what appears on your screen</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to limit quantities of any order</li>
            <li>We reserve the right to refuse or cancel any order</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Orders and Payment</h2>
          <p>
            By placing an order, you agree to provide accurate and complete information. 
            All orders are subject to availability and confirmation of the order price.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Limitation of Liability</h2>
          <p>
            SK Mobiles shall not be liable for any damages arising out of or in connection 
            with the use of this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at 
            support@skmobiles.com.
          </p>
        </section>
      </div>
    </div>
  );
}
