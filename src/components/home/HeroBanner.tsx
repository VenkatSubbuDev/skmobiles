import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Banner } from '@/types';

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (data && data.length > 0) {
      setBanners(data);
    } else {
      // Default banners if none in database
      setBanners([
        {
          id: '1',
          title: 'New Arrivals',
          subtitle: 'Discover the latest smartphones and accessories',
          link_url: '/products',
          image_url: null,
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Mega Sale',
          subtitle: 'Up to 50% off on premium accessories',
          link_url: '/products?sale=true',
          image_url: null,
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Premium Earbuds',
          subtitle: 'Experience true wireless freedom',
          link_url: '/category/earbuds',
          image_url: null,
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-background via-card to-background shimmer" />
    );
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Slides */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 flex items-center justify-center text-center transition-all duration-700 ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="max-w-3xl mx-auto px-4">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20 animate-fade-up">
                ✨ Premium Collection
              </span>
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="gradient-text">{banner.title}</span>
              </h1>
              <p 
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                {banner.subtitle}
              </p>
              <div 
                className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 neon-glow">
                  <Link to={banner.link_url || '/products'}>
                    Shop Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                  <Link to="/products">
                    View All Products
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full glass hover:neon-glow"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full glass hover:neon-glow"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary w-8 neon-glow' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
