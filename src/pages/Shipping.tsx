import usePageMeta from "@/hooks/usePageMeta";
import { Truck, Package, Clock, DollarSign } from "lucide-react";

export default function Shipping() {
  usePageMeta({ title: "Shipping Info" });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Shipping Information</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card p-6 rounded-lg border">
          <Truck className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Standard Shipping</h3>
          <p className="text-muted-foreground">3-7 business days</p>
          <p className="text-sm text-muted-foreground mt-2">Free for orders above ₹999</p>
          <p className="text-primary font-semibold mt-1">₹99 for orders below ₹999</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <Package className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Express Shipping</h3>
          <p className="text-muted-foreground">1-3 business days</p>
          <p className="text-sm text-muted-foreground mt-2">Available in major cities</p>
          <p className="text-primary font-semibold mt-1">₹199 flat rate</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Shipping Process</h2>
      <div className="space-y-4 mb-12">
        <div className="flex gap-4">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary">1</span>
          </div>
          <div>
            <h4 className="font-semibold">Order Placed</h4>
            <p className="text-muted-foreground">Once you place your order, we process it within 24 hours.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary">2</span>
          </div>
          <div>
            <h4 className="font-semibold">Shipped</h4>
            <p className="text-muted-foreground">Your order is packed and handed over to our courier partner.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary">3</span>
          </div>
          <div>
            <h4 className="font-semibold">In Transit</h4>
            <p className="text-muted-foreground">Track your package in real-time with our tracking system.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary">4</span>
          </div>
          <div>
            <h4 className="font-semibold">Delivered</h4>
            <p className="text-muted-foreground">Your order arrives at your doorstep.</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Delivery Areas</h2>
      <p className="text-muted-foreground mb-4">
        We deliver to all major cities and towns across India. Some remote locations may have extended delivery times.
      </p>
    </div>
  );
}
