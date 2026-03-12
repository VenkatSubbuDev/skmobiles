import { useState } from "react";
import usePageMeta from "@/hooks/usePageMeta";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function TrackOrder() {
  usePageMeta({ title: "Track Order" });
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [trackingResult, setTrackingResult] = useState<{
    found: boolean;
    status?: string;
    steps?: { status: string; completed: boolean; date: string }[];
  } | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo tracking - in production this would call an API
    if (orderId) {
      setTrackingResult({
        found: true,
        status: "In Transit",
        steps: [
          { status: "Order Placed", completed: true, date: "2024-01-15" },
          { status: "Order Confirmed", completed: true, date: "2024-01-15" },
          { status: "Shipped", completed: true, date: "2024-01-16" },
          { status: "Out for Delivery", completed: false, date: "Expected: 2024-01-18" },
          { status: "Delivered", completed: false, date: "Expected: 2024-01-18" },
        ],
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Track Your Order</h1>
      
      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order ID</label>
            <Input
              placeholder="Enter your order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Track Order
          </Button>
        </form>
      </div>

      {trackingResult?.found && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Order Status</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {trackingResult.status}
              </span>
            </div>
            <p className="text-muted-foreground">Order ID: {orderId}</p>
          </div>

          <div className="space-y-0">
            {trackingResult.steps?.map((step, index) => (
              <div key={index} className="flex gap-4 pb-8 relative">
                {/* Connector line */}
                {index < (trackingResult.steps?.length || 0) - 1 && (
                  <div 
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -mb-8 ${
                      step.completed ? "bg-primary" : "bg-muted"
                    }`} 
                  />
                )}
                
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1 pt-1">
                  <h4 className={`font-medium ${step.completed ? "" : "text-muted-foreground"}`}>
                    {step.status}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
