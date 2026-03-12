import usePageMeta from "@/hooks/usePageMeta";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  usePageMeta({ title: "Contact Us" });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-muted-foreground">123 Tech Street, Mobile City, India 500001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+91 9876543210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">support@skmobiles.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-muted-foreground">Monday - Saturday: 9 AM - 7 PM</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea placeholder="Your message..." className="min-h-[150px]" />
            </div>
            <Button className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
