import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';

export default function WishlistTab() {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (items.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">Your wishlist is empty</h3>
          <p className="text-sm text-muted-foreground mt-1">Save items you love for later.</p>
          <Link to="/products">
            <Button className="mt-4" variant="outline">Browse Products</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map(item => {
        const product = item.product as Product | undefined;
        if (!product) return null;

        return (
          <Card key={item.id} className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                <Link to={`/product/${product.slug}`} className="shrink-0">
                  <img
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-20 h-20 rounded-md object-cover bg-secondary"
                  />
                </Link>
                <div className="flex-1 min-w-0 space-y-1">
                  <Link to={`/product/${product.slug}`}>
                    <h4 className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">{product.name}</h4>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">₹{Number(product.price).toLocaleString()}</span>
                    {product.original_price && (
                      <span className="text-xs text-muted-foreground line-through">₹{Number(product.original_price).toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(product.stock_quantity ?? 0) > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1 text-xs h-8"
                      disabled={(product.stock_quantity ?? 0) === 0}
                      onClick={() => addToCart(product.id)}
                    >
                      <ShoppingCart className="h-3 w-3" /> Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs h-8 text-destructive hover:text-destructive"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
