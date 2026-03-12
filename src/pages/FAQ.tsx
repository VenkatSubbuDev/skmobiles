import usePageMeta from "@/hooks/usePageMeta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  usePageMeta({ title: "FAQ" });

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by clicking on the 'Track Order' link in the header or footer. Enter your order number and email to get real-time updates on your shipment."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for most products. Items must be unused and in original packaging. Contact our support team to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-7 business days. Express shipping (where available) delivers in 1-3 business days. Orders are processed within 24 hours."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship only within India. We're working on expanding our shipping destinations soon."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us via email at support@skmobiles.com, call us at +91 9876543210, or use the contact form on our website."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes! We source all our products directly from authorized distributors and manufacturers. All products come with genuine manufacturer warranty."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. We also offer cash on delivery for orders under ₹10,000."
    },
    {
      question: "How do I update my account information?",
      answer: "Log in to your account and navigate to the 'Profile' section to update your personal details, shipping addresses, and preferences."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Find answers to the most common questions about our products and services.
      </p>
      <Accordion type="single" collapsible className="w-full max-w-3xl">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
