import { Cookie } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const cookieTypes = [
  {
    name: 'Strictly Necessary Cookies',
    required: true,
    description:
      'These cookies are essential for the website to function properly. They enable core features like user authentication, shopping cart, and secure checkout. These cannot be disabled.',
    examples: ['Session token', 'Cart contents', 'CSRF protection token'],
  },
  {
    name: 'Performance & Analytics Cookies',
    required: false,
    description:
      'These cookies help us understand how visitors interact with our website by collecting anonymous data about page visits, time spent, and errors encountered. This helps us improve the platform.',
    examples: ['Google Analytics', 'Page view tracking', 'Error logging'],
  },
  {
    name: 'Functional Cookies',
    required: false,
    description:
      'These cookies remember your preferences and settings to provide a more personalised experience, such as your preferred currency, language, and recently viewed products.',
    examples: ['Theme preference', 'Recently viewed products', 'Search history'],
  },
  {
    name: 'Marketing & Targeting Cookies',
    required: false,
    description:
      'These cookies track your browsing habits to display relevant advertisements on other platforms. They may also be used by our advertising partners.',
    examples: ['Retargeting pixels', 'Ad frequency capping', 'Conversion tracking'],
  },
];

const sections = [
  {
    title: 'What Are Cookies?',
    content:
      'Cookies are small text files stored on your device when you visit a website. They help the website remember information about your visit, making your next visit easier and the site more useful to you.',
  },
  {
    title: 'How We Use Cookies',
    content:
      'SK Mobiles uses cookies to provide essential website functionality, remember your preferences, analyse site traffic, and occasionally to deliver targeted advertisements. We never use cookies to store sensitive personal information such as passwords or payment details.',
  },
  {
    title: 'Managing Cookies',
    content:
      'You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. Please note that disabling strictly necessary cookies will affect the functionality of the website, including your ability to log in and complete purchases.\n\nFor detailed instructions on managing cookies in your browser:\n- Google Chrome: Settings > Privacy and security > Cookies\n- Mozilla Firefox: Options > Privacy & Security\n- Safari: Preferences > Privacy\n- Microsoft Edge: Settings > Cookies and site permissions',
  },
  {
    title: 'Third-Party Cookies',
    content:
      'Some third-party services integrated into our platform (such as Google Analytics and payment processors) may also set their own cookies. These are governed by the respective third-party privacy policies, which we encourage you to review.',
  },
  {
    title: 'Updates to This Policy',
    content:
      'We may update this Cookie Policy from time to time. Any changes will be reflected on this page with an updated date. We recommend reviewing this policy periodically.',
  },
];

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Cookie <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-muted-foreground">Last updated: 1 January 2025</p>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
            This policy explains how SK Mobiles uses cookies and similar technologies on our website.
          </p>
        </div>

        {/* Cookie Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {cookieTypes.map(({ name, required, description, examples }) => (
              <Card key={name} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold">{name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                        required
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                          : 'bg-secondary text-muted-foreground border border-border'
                      }`}
                    >
                      {required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs bg-secondary/50 border border-border rounded-md px-2 py-1 text-muted-foreground"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title} className="border-b border-border/50 pb-8 last:border-0">
              <h2 className="text-xl font-semibold mb-3">{title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
