import { Link, NavLink } from 'react-router-dom';
import { Smartphone, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Cases & Covers', slug: 'cases' },
  { name: 'Chargers', slug: 'chargers' },
  { name: 'Earphones', slug: 'earphones' },
  { name: 'Earbuds', slug: 'earbuds' },
];

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQs', href: '/faq' },
  { name: 'Shipping Info', href: '/shipping' },
  { name: 'Returns', href: '/returns' },
  { name: 'Privacy Policy', href: '/privacy' },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-muted-foreground">Get the latest deals and offers directly in your inbox</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="w-full md:w-80 bg-secondary/50 border-border"
              />
              <Button className="bg-primary hover:bg-primary/90 neon-glow">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Smartphone className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">skmobiles</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Your one-stop destination for premium mobile accessories. Quality products, unbeatable prices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    to={`/category/${cat.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <NavLink 
                    to={link.href}
                    className={({ isActive }) => 
                      `hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>123 Tech Street, Mobile City, India 500001</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>support@skmobiles.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 skmobiles. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <NavLink to="/terms" className={({ isActive }) => 
                `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`
              }>Terms</NavLink>
              <NavLink to="/privacy" className={({ isActive }) => 
                `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`
              }>Privacy</NavLink>
              <NavLink to="/cookies" className={({ isActive }) => 
                `hover:text-primary transition-colors ${isActive ? 'text-primary' : ''}`
              }>Cookies</NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
