import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product, Review } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug!)
      .eq('is_active', true)
      .single();

    if (data) {
      const prod = data as Product;
      setProduct(prod);

      const [relatedRes, reviewsRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').eq('category_id', prod.category_id!).neq('id', prod.id).eq('is_active', true).limit(4),
        supabase.from('reviews').select('*, profile:profiles(*)').eq('product_id', prod.id).order('created_at', { ascending: false }),
      ]);

      setRelatedProducts((relatedRes.data || []) as Product[]);
      setReviews((reviewsRes.data || []) as Review[]);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) addToCart(product.id, quantity);
  };

  const handleWishlist = () => {
    if (!product) return;
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id);
  };

  const handleSubmitReview = async () => {
    if (!user || !product) {
      toast({ title: 'Please sign in', description: 'You need to sign in to leave a review', variant: 'destructive' });
      return;
    }
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: product.id, user_id: user.id, rating: reviewRating, title: reviewTitle, comment: reviewComment,
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    } else {
      toast({ title: 'Review submitted!' });
      setReviewTitle(''); setReviewComment(''); setReviewRating(5);
      fetchProduct();
    }
    setSubmittingReview(false);
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const discount = product?.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border/50">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                      i === selectedImage ? "border-primary" : "border-border/50 hover:border-primary/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.category && (
              <Badge variant="outline" className="text-primary border-primary/30">{product.category.name}</Badge>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn("h-5 w-5", s <= avgRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
                  <Badge className="bg-accent text-accent-foreground">-{discount}%</Badge>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <Separator />

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full", product.stock_quantity > 0 ? "bg-green-500" : "bg-destructive")} />
              <span className="text-sm">{product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}</span>
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}><Plus className="h-4 w-4" /></Button>
              </div>

              <Button className="flex-1 neon-glow" size="lg" onClick={handleAddToCart} disabled={product.stock_quantity === 0}>
                <ShoppingCart className="h-5 w-5 mr-2" />Add to Cart
              </Button>

              <Button variant="outline" size="lg" onClick={handleWishlist} className={cn(inWishlist && "text-destructive border-destructive/30")}>
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Over ₹999' },
                { icon: Shield, label: 'Warranty', desc: '1 Year' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '7 Days' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mb-16">
          <TabsList className="bg-secondary/50 border border-border/50">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-6">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="grid gap-3">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No specifications available</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-8">
            {/* Review Form */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <Star className={cn("h-6 w-6 transition-colors", s <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-300")} />
                    </button>
                  ))}
                </div>
                <Input placeholder="Review title" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} className="bg-secondary/50 border-border" />
                <Textarea placeholder="Your review..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="bg-secondary/50 border-border" rows={4} />
                <Button onClick={handleSubmitReview} disabled={submittingReview || !reviewComment}>Submit Review</Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first!</p>
              ) : reviews.map(review => (
                <div key={review.id} className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(review.profile?.full_name?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.profile?.full_name || 'Anonymous'}</span>
                        {review.is_verified_purchase && <Badge variant="outline" className="text-xs">Verified</Badge>}
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={cn("h-4 w-4", s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                        ))}
                      </div>
                      {review.title && <p className="font-medium mb-1">{review.title}</p>}
                      {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
                      <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
