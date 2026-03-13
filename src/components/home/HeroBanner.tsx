import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import heroCaseImg from '@/assets/hero-custom-case.png';
import heroEarbudsImg from '@/assets/hero-earbuds.png';
import heroCasesCollectionImg from '@/assets/hero-custom-cases-collection.png';

const slides = [
  {
    id: '1',
    badge: '🔥 Limited Offer — ₹199 Only',
    title: 'Custom Unbreakable Cases',
    subtitle: 'Upload any photo — your loved ones, celebrities, or landscapes. We print it on a premium unbreakable case that protects your phone in style.',
    cta: 'Design Your Case',
    ctaLink: '/custom-case',
    secondaryCta: 'View All Products',
    secondaryLink: '/products',
    image: heroCaseImg,
    imageAlt: 'Custom printed unbreakable phone case',
    showPrice: true,
  },
  {
    id: '2',
    badge: '🎧 New Arrivals',
    title: 'Premium Wireless Earbuds',
    subtitle: 'Crystal-clear sound with deep bass. Up to 36hrs battery life, IPX5 waterproof, and ultra-low latency for gaming. Starting from ₹299.',
    cta: 'Shop Earbuds',
    ctaLink: '/products',
    secondaryCta: 'View All',
    secondaryLink: '/products',
    image: heroEarbudsImg,
    imageAlt: 'Premium wireless earbuds with charging case',
    showPrice: false,
  },
  {
    id: '3',
    badge: '✨ 500+ Designs Available',
    title: 'Cases That Tell Your Story',
    subtitle: 'From celebrity prints to stunning landscapes — our HD quality custom cases are unbreakable and uniquely yours. Cash on delivery available!',
    cta: 'Explore Collection',
    ctaLink: '/custom-case',
    secondaryCta: 'Browse All',
    secondaryLink: '/products',
    image: heroCasesCollectionImg,
    imageAlt: 'Collection of custom printed phone cases with vibrant designs',
    showPrice: false,
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-[550px] md:min-h-[650px] overflow-hidden">
      {/* Background */}
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
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[hsl(var(--neon-pink))]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center min-h-[550px] md:min-h-[650px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Text Side */}
          <div className="order-2 lg:order-1">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0 relative'
                    : 'opacity-0 translate-y-8 absolute pointer-events-none'
                }`}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5 animate-fade-up">
                  {slide.badge}
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  <span className="gradient-text">{slide.title}</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 neon-glow text-lg px-8">
                    <Link to={slide.ctaLink}>{slide.cta}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                    <Link to={slide.secondaryLink}>{slide.secondaryCta}</Link>
                  </Button>
                </div>
                {/* Price callout */}
                {slides[currentSlide].showPrice && (
                  <div className="mt-6 flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                    <span className="text-3xl font-bold text-primary">₹199</span>
                    <span className="text-lg text-muted-foreground line-through">₹249</span>
                    <Badge variant="destructive" className="animate-pulse">20% OFF</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-75 animate-glow" />
              <img
                src={heroCaseImg}
                alt="Custom printed unbreakable phone case"
                className="relative z-10 w-64 md:w-80 lg:w-96 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full glass hover:neon-glow" onClick={prevSlide}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full glass hover:neon-glow" onClick={nextSlide}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
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
