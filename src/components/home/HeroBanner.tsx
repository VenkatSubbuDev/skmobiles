import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

import heroCaseImg from '@/assets/hero-custom-case.png';
import customCaseLandscape from '@/assets/custom_case_landscape.png';
import customCasePortrait from '@/assets/custom_case_portrait.png';
import customCaseUserUpload from '@/assets/custom_case_user_upload.png';
import customCaseUserUpload2 from '@/assets/custom_case_user_upload_2.png';
import customCaseUserUpload3 from '@/assets/custom_case_user_upload_3.png';

const slides = [
  {
    id: '1',
    badge: '🔥 Limited Offer — ₹199 Only',
    title: 'Custom Unbreakable Cases',
    titleGradient: false,
    titleSpan: 'Custom',
    titleEnd: ' Unbreakable Cases',
    subtitle: 'Upload any photo — your loved ones, celebrities, or landscapes. We print it on a premium unbreakable case that protects your phone in style.',
    cta: 'Design Your Case',
    ctaLink: '/custom-case',
    secondaryCta: 'View All Products',
    secondaryLink: '/products',
    image: customCaseUserUpload,
    showPrice: true,
  },
  {
    id: '2',
    badge: '✨ Premium Quality',
    title: 'Your Photo, Your Case',
    titleGradient: false,
    titleSpan: 'Your Photo',
    titleEnd: ', Your Case',
    subtitle: 'HD print quality on military-grade protection. Choose from 500+ phone models. Cash on delivery available.',
    cta: 'Create Now',
    ctaLink: '/custom-case',
    secondaryCta: 'Browse Products',
    secondaryLink: '/products',
    image: customCasePortrait,
  },
  {
    id: '3',
    badge: '🎁 Perfect Gift Idea',
    title: 'Gift a Custom Case',
    titleGradient: true,
    titleSpan: 'Gift a ',
    titleEnd: 'Custom Case',
    subtitle: "Surprise someone with a phone case featuring their favorite photo. The perfect personal gift for any occasion!",
    cta: 'Start Designing',
    ctaLink: '/custom-case',
    secondaryCta: 'Learn More',
    secondaryLink: '/about',
    image: customCaseUserUpload2,
  },
  {
    id: '4',
    badge: '📱 Latest Models Supported',
    title: 'iPhone 16 Series Cases',
    titleGradient: false,
    titleSpan: 'iPhone 16',
    titleEnd: ' Series Cases',
    subtitle: "Protect your newest device with our ultra-slim, magma-resistant custom shells. Available now.",
    cta: 'Shop iPhone',
    ctaLink: '/products',
    secondaryCta: 'Explore Android',
    secondaryLink: '/products',
    image: customCaseUserUpload3,
  },
  {
    id: '5',
    badge: '🛒 Bulk Orders Available',
    title: 'Corporate Merchandising',
    titleGradient: false,
    titleSpan: 'Corporate',
    titleEnd: ' Merchandising',
    subtitle: "Order custom cases with your company logo for your entire team. Special discounts apply for orders starting at 50 units.",
    cta: 'Get a Quote',
    ctaLink: '/contact',
    secondaryCta: 'Learn More',
    secondaryLink: '/about',
    image: heroCaseImg,
  },
];

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Auto play setup
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 6000);

    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  return (
    <div className="container mx-auto px-4 pb-8 pt-2">
      <section className="relative overflow-hidden bg-card/30 rounded-3xl shadow-2xl">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-card/50 to-background/80 mix-blend-overlay" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Embla Carousel Viewport */}
        <div className="relative overflow-hidden w-full" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="px-10 sm:px-16 lg:px-24 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[400px] md:min-h-[450px]">
                  
                  {/* Text Side */}
                  <div className="flex flex-col justify-center order-2 lg:order-1 relative z-10 animate-fade-up max-w-xl mx-auto lg:mx-0">
                    <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 backdrop-blur-sm">
                      {slide.badge}
                    </Badge>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                      {slide.titleGradient ? (
                        <span className="gradient-text">{slide.title}</span>
                      ) : (
                        <>
                          <span className="text-foreground">{slide.titleSpan}</span>
                          {slide.titleEnd && <span className="text-slate-400">{slide.titleEnd}</span>}
                        </>
                      )}
                    </h1>
                    
                    <p className="text-base md:text-lg text-muted-foreground/90 mb-6 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild size="default" className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow px-6 font-semibold rounded-full">
                        <Link to={slide.ctaLink}>{slide.cta}</Link>
                      </Button>
                      <Button asChild variant="outline" size="default" className="border-primary/30 hover:bg-primary/10 px-6 font-semibold rounded-full bg-background/50 backdrop-blur-md">
                        <Link to={slide.secondaryLink}>{slide.secondaryCta}</Link>
                      </Button>
                    </div>
                    
                    {/* Optional Price callout */}
                    {slide.showPrice && (
                      <div className="mt-6 flex items-center gap-3 bg-background/40 w-fit px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                        <span className="text-2xl font-extrabold text-primary tracking-tight">₹199</span>
                        <span className="text-base text-muted-foreground/60 line-through decoration-muted-foreground/40 text-decoration-thickness-2">₹249</span>
                        <Badge variant="destructive" className="animate-pulse bg-red-500/10 text-red-500 border-red-500/20 text-xs py-0">20% OFF</Badge>
                      </div>
                    )}
                  </div>

                  {/* Image Side */}
                  <div className="order-1 lg:order-2 flex justify-center items-center relative min-h-[250px] md:min-h-[350px]">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] scale-75 animate-pulse" />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="relative z-10 w-full max-w-[200px] md:max-w-[280px] lg:max-w-[350px] drop-shadow-[0_0_30px_rgba(var(--primary),0.3)] object-contain transform transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 hidden md:flex">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all text-white shadow-lg" 
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 hidden md:flex">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all text-white shadow-lg" 
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === selectedIndex 
                  ? 'w-6 bg-primary neon-glow' 
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
