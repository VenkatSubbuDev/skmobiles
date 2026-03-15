import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, CreditCard, ShieldCheck, Settings } from 'lucide-react';
import usePageMeta from '@/hooks/usePageMeta';

export default function PaymentGatewayGuide() {
  usePageMeta({ title: 'Payment Gateway Setup Guide | Admin' });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Payment Gateway Integration Guide</h2>
        <p className="text-muted-foreground mt-1">Follow these steps to set up Razorpay for your SK Mobiles ecommerce store.</p>
      </div>

      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Why Razorpay?
          </CardTitle>
          <CardDescription>
            Razorpay is India's most popular payment gateway, supporting UPI, Credit/Debit Cards, Netbanking, and Wallets. It is secure, easy to integrate, and offers excellent support for businesses.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <StepCard 
          step={1}
          icon={ExternalLink}
          title="Create a Razorpay Account" 
          description="Go to the Razorpay website and create a new business account."
          details={
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-foreground">
              <li>Visit <a href="https://razorpay.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">razorpay.com</a> and click "Sign Up".</li>
              <li>Use the business email: <strong>skmobiles@gmail.com</strong>.</li>
              <li>Select your business type (likely "Proprietorship" or "Unregistered" if just starting).</li>
            </ul>
          }
        />

        <StepCard 
          step={2}
          icon={ShieldCheck}
          title="Complete KYC Verification" 
          description="Submit the necessary documents to activate your account to receive payments."
          details={
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-foreground">
              <li>Upload your PAN Card details.</li>
              <li>Provide your Business details / GST Certificate (if applicable).</li>
              <li>Upload an Identity Proof (Aadhar Card/Voter ID).</li>
              <li>Link the Bank Account where the money should be deposited.</li>
            </ul>
          }
        />

        <StepCard 
          step={3}
          icon={Settings}
          title="Generate API Keys" 
          description="Once your account is activated, you need to generate API keys to link your website."
          details={
            <div className="space-y-2 text-sm">
              <p>In the Razorpay Dashboard:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Go to <strong>Settings</strong> &gt; <strong>API Keys</strong>.</li>
                <li>Ensure you are in <strong>Live Mode</strong> (switch at the top if in Test mode, but test mode is good for initial checks).</li>
                <li>Click <strong>Generate Key</strong>.</li>
                <li>Copy the <strong>Key ID</strong> and <strong>Key Secret</strong>.</li>
              </ol>
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md mt-2">
                <p className="text-destructive font-semibold">⚠️ Important Security Warning</p>
                <p className="text-destructive text-xs">Never share your Key Secret with anyone or paste it in public forums. You will need to securely provide these keys to your developer to put into the Supabase environment variables.</p>
              </div>
            </div>
          }
        />

        <StepCard 
          step={4}
          icon={CreditCard}
          title="Enable Payment Methods" 
          description="Ensure UPI, Cards, and Netbanking are enabled for your customers."
          details={
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-foreground">
              <li>Go to <strong>Settings</strong> &gt; <strong>Payment Methods</strong>.</li>
              <li>Ensure <strong>UPI</strong> is toggled On (critical for Indian customers).</li>
              <li>Ensure major Credit and Debit Cards are checked.</li>
            </ul>
          }
        />
        
        <StepCard 
          step={5}
          icon={ExternalLink}
          title="Provide Keys to System" 
          description="Final integration step to connect the store with Razorpay."
          details={
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-foreground">
              <li>Once you have the keys, we will add them to the secure Supabase Edge Functions environment.</li>
              <li>The checkout page logic will then be updated to initialize the Razorpay checkout modal seamlessly.</li>
            </ul>
          }
        />
      </div>
    </div>
  );
}

function StepCard({ step, title, description, details, icon: Icon }: any) {
  return (
    <Card className="glass overflow-hidden border-border/50">
      <div className="flex">
        <div className="w-16 bg-primary/10 flex flex-col items-center justify-center border-r border-border/50">
          <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Step</span>
          <span className="text-3xl font-extrabold text-primary">{step}</span>
        </div>
        <CardContent className="p-6 flex-1">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Icon className="w-5 h-5 text-muted-foreground" /> {title}
          </h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="bg-secondary/30 p-4 rounded-lg border border-border/40">
            {details}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
