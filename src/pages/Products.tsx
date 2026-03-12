import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, LayoutList, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category } from '@/types';
import usePageMeta from '@/hooks/usePageMeta';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-az' | 'name-za' | 'featured';

export default function Products() {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams<{ slug: string }>();
  
  // Dynamic page title based on category
  const pageTitle = categorySlug 
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    : 'All Products';
  usePageMeta({ title: pageTitle });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [gridView, setGridView] = useState(true);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  useEffect(() => { fetchData(); }, []);

  // Auto-expand parent when a subcategory slug is active
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const selected = categories.find(c => c.slug === selectedCategory);
      if (selected?.parent_id) {
        setExpandedParents(prev => new Set([...prev, selected.parent_id!]));
      }
    }
  }, [selectedCategory, categories]);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').eq('is_active', true),
      supabase.from('categories').select('*').eq('is_active', true).order('name'),
    ]);

    const prods = (productsRes.data || []) as Product[];
    setProducts(prods);
    setCategories(categoriesRes.data as Category[] || []);

    if (prods.length > 0) {
      const max = Math.max(...prods.map(p => p.price));
      setMaxPrice(max);
      setPriceRange([0, max]);
    }
    setLoading(false);
  };

  // Build category tree
  const categoryTree = useMemo(() => {
    const roots = categories.filter(c => !c.parent_id);
    const getChildren = (parentId: string): Category[] =>
      categories.filter(c => c.parent_id === parentId);
    return roots.map(c => ({ ...c, children: getChildren(c.id) }));
  }, [categories]);

  // Get all descendant category slugs for a given slug
  const getCategorySlugsForFilter = (slug: string): string[] => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat) return [slug];
    const children = categories.filter(c => c.parent_id === cat.id);
    if (children.length === 0) return [slug];
    return [slug, ...children.map(c => c.slug)];
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    if (selectedCategory && selectedCategory !== 'all') {
      const slugs = getCategorySlugsForFilter(selectedCategory);
      result = result.filter(p => p.category && slugs.includes(p.category.slug));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name-az': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-za': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'featured': result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, categories]);

  const toggleParent = (parentId: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      next.has(parentId) ? next.delete(parentId) : next.add(parentId);
      return next;
    });
  };

  const getDisplayName = () => {
    if (selectedCategory === 'all') return 'All Products';
    const cat = categories.find(c => c.slug === selectedCategory);
    if (!cat) return 'Products';
    if (cat.parent_id) {
      const parent = categories.find(c => c.id === cat.parent_id);
      return parent ? `${parent.name} › ${cat.name}` : cat.name;
    }
    return cat.name;
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
          >
            All Products
          </button>
          {categoryTree.map(parent => {
            const children = parent.children || [];
            const isExpanded = expandedParents.has(parent.id);
            const isParentSelected = selectedCategory === parent.slug;
            const hasActiveChild = children.some(c => c.slug === selectedCategory);

            return (
              <div key={parent.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedCategory(parent.slug)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${isParentSelected || hasActiveChild ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                  >
                    {parent.icon && <span className="mr-1.5">{parent.icon}</span>}
                    {parent.name}
                  </button>
                  {children.length > 0 && (
                    <button
                      onClick={() => toggleParent(parent.id)}
                      className="p-1.5 rounded hover:bg-secondary text-muted-foreground"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                {isExpanded && children.length > 0 && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-2">
                    {children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedCategory(child.slug)}
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === child.slug ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                      >
                        {child.icon && <span className="mr-1.5">{child.icon}</span>}
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          max={maxPrice}
          step={100}
          className="mb-3"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={() => { setSelectedCategory('all'); setPriceRange([0, maxPrice]); setSearchQuery(''); }}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{getDisplayName()}</h1>
          <p className="text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary/50 border-border" />
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-44 bg-secondary/50 border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-az">Name: A to Z</SelectItem>
                <SelectItem value="name-za">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex items-center border border-border rounded-lg">
              <Button variant={gridView ? "secondary" : "ghost"} size="icon" className="rounded-r-none" onClick={() => setGridView(true)}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={!gridView ? "secondary" : "ghost"} size="icon" className="rounded-l-none" onClick={() => setGridView(false)}>
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon"><SlidersHorizontal className="h-4 w-4" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-card">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterSidebar /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-6">
              <FilterSidebar />
            </div>
          </aside>
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">No products found</p>
                <Button variant="outline" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setPriceRange([0, maxPrice]); }}>Clear Filters</Button>
              </div>
            ) : (
              <div className={gridView ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" : "flex flex-col gap-4"}>
                {filtered.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
