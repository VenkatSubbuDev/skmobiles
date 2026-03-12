import usePageMeta from "@/hooks/usePageMeta";

export default function About() {
  usePageMeta({ title: "About Us" });

  return (
    <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-4">
            Welcome to SK Mobiles, your premier destination for premium mobile accessories in India.
          </p>
          <p className="mb-4">
            Founded with a vision to provide quality mobile accessories at affordable prices, 
            SK Mobiles has grown to become a trusted name in the industry. We specialize in 
            offering a wide range of products including mobile phones, cases, chargers, 
            earphones, and earbuds from top brands.
          </p>
          <p className="mb-4">
            Our commitment to customer satisfaction, quality products, and competitive pricing 
            has made us a preferred choice for mobile accessory shoppers across India.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>100% authentic products</li>
            <li>Competitive pricing</li>
            <li>Fast shipping across India</li>
            <li>Easy returns and exchanges</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
    </div>
  );
}
