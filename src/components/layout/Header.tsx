import { NavLink, Link } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import CartDrawer from './CartDrawer';

const categories = [
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Cases', slug: 'cases' },
  { name: 'Chargers', slug: 'chargers' },
  { name: 'Earphones', slug: 'earphones' },
  { name: 'Earbuds', slug: 'earbuds' },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border/30">
          <p>Free shipping on orders over ₹999</p>
          <div className="flex items-center gap-4">
            <Link to="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-card border-border">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLink to="/" className={({ isActive }) => 
                  `text-lg font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }>Home</NavLink>
                <NavLink to="/products" className={({ isActive }) => 
                  `text-lg font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }>All Products</NavLink>
                <NavLink to="/custom-case" className={({ isActive }) => 
                  `text-lg font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`
                }>🎨 Custom Case</NavLink>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Smartphone className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-xl font-bold gradient-text">skmobiles</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => 
              `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'}`
            }>
              Home
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => 
              `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'}`
            }>
              Products
            </NavLink>
            <NavLink to="/custom-case" className={({ isActive }) => 
              `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'}`
            }>
              Custom Case
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 bg-secondary/50 border-border focus:border-primary"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            <Link to={user ? "/account" : "/auth"}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
