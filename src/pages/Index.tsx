import HeroBanner from '@/components/home/HeroBanner';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Features from '@/components/home/Features';
import usePageMeta from '@/hooks/usePageMeta';

export default function Index() {
  usePageMeta({ title: 'Home' });
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <Features />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
}
