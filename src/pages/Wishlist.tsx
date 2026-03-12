import usePageMeta from "@/hooks/usePageMeta";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function Wishlist() {
  usePageMeta({ title: "Wishlist" });
  const { items: wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (item: any) => {
    if (!item.product) return;
    
    await addToCart(item.product, 1);
    await removeFromWishlist(item.product_id);
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save items you love by clicking the heart icon on any product
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            if (!product) return null;
            
            return (
              <div key={item.id} className="bg-card rounded-lg border overflow-hidden group">
                <Link to={`/product/${product.slug}`}>
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Heart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-primary mb-3">
                    ₹{product.price?.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
