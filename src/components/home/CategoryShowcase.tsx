import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shield, Zap, Headphones, Music, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone, Shield, Zap, Headphones, Music,
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('name');
    setCategories(data as Category[] || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our wide range of mobile accessories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon || 'Smartphone'] || Smartphone;
            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 card-hover animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="relative mb-4">
                    <IconComponent className="h-12 w-12 md:h-16 md:w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-center text-sm md:text-base group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
