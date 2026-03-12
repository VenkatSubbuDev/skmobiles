import usePageMeta from "@/hooks/usePageMeta";
import { RotateCcw, Shield, AlertCircle } from "lucide-react";

export default function Returns() {
  usePageMeta({ title: "Returns" });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Returns & Exchanges</h1>
      
      <div className="bg-card p-6 rounded-lg border mb-8">
        <RotateCcw className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
        <p className="text-muted-foreground">
          We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 7 days.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">7-Day Return Window</h4>
            <p className="text-muted-foreground">Returns accepted within 7 days of delivery</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Original Condition</h4>
            <p className="text-muted-foreground">Items must be unused and in original packaging</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Proof of Purchase</h4>
            <p className="text-muted-foreground">Original receipt or order confirmation required</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Items Not Eligible for Return</h2>
      <div className="flex items-start gap-3 mb-8">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="text-muted-foreground">
          <p>For hygiene reasons, the following items cannot be returned:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Earphones and earbuds (once opened)</li>
            <li>Screen protectors</li>
            <li>Software/Digital products</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">How to Return</h2>
      <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
        <li>Contact our support team via email or phone to initiate a return</li>
        <li>Pack the item securely in original packaging</li>
        <li>Ship the package to our return address</li>
        <li>Refunds are processed within 5-7 business days after receiving the return</li>
      </ol>
    </div>
  );
}
