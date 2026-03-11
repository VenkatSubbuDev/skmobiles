import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Wishlist() {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your Wishlist</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to save your favourite products and access them from any device.
          </p>
          <Link to="/auth">
            <Button className="bg-primary hover:bg-primary/90 neon-glow">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">
            My <span className="gradient-text">Wishlist</span>
          </h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">
            Browse our products and tap the heart icon to save items you love.
          </p>
          <Link to="/products">
            <Button className="bg-primary hover:bg-primary/90 neon-glow">Explore Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            My <span className="gradient-text">Wishlist</span>
          </h1>
          <span className="text-muted-foreground text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;

            const discount = product.original_price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;

            return (
              <Card
                key={item.id}
                className="group relative overflow-hidden bg-card border-border/50 hover:border-primary/40 transition-colors"
              >
                {/* Image */}
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-primary uppercase tracking-wider mb-1">
                    {product.category?.name || 'Product'}
                  </p>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">&#8377;{product.price.toLocaleString()}</span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        &#8377;{product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 neon-glow text-sm"
                      disabled={product.stock_quantity === 0}
                      onClick={() => addToCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
