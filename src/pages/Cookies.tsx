import usePageMeta from "@/hooks/usePageMeta";
import { Cookie } from "lucide-react";

export default function Cookies() {
  usePageMeta({ title: "Cookie Policy" });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Cookie Policy</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when 
            you visit a website. They help the website remember information about your visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How We Use Cookies</h2>
          <p className="mb-2">We use cookies to:</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Keep you logged in during your visit</li>
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our website</li>
            <li>Improve our services and user experience</li>
            <li>Provide personalized recommendations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Essential Cookies</h4>
              <p className="text-muted-foreground">
                Required for the website to function. These cannot be disabled.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Analytics Cookies</h4>
              <p className="text-muted-foreground">
                Help us understand how visitors interact with our website.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Marketing Cookies</h4>
              <p className="text-muted-foreground">
                Used to track visitors across websites to display relevant ads.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Managing Cookies</h2>
          <p>
            You can control or delete cookies through your browser settings. 
            However, disabling essential cookies may affect the functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at 
            support@skmobiles.com.
          </p>
        </section>
      </div>
    </div>
  );
}
