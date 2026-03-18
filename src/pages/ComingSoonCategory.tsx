import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BellRing, Clock3, Headphones, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import usePageMeta from '@/hooks/usePageMeta';

const contentBySlug: Record<string, { title: string; subtitle: string; icon: typeof Watch }> = {
  'smart-watches': {
    title: 'Smart Watches',
    subtitle: 'Premium wearables are launching soon with curated models and launch offers.',
    icon: Watch,
  },
  earbuds: {
    title: 'Earbuds',
    subtitle: 'High-bass, low-latency earbuds are coming soon with exclusive first-drop pricing.',
    icon: Headphones,
  },
};

export default function ComingSoonCategory() {
  const { slug = '' } = useParams<{ slug: string }>();
  const content = contentBySlug[slug] || {
    title: 'This Category',
    subtitle: 'New products are arriving soon.',
    icon: Clock3,
  };
  const Icon = content.icon;

  usePageMeta({ title: `${content.title} Coming Soon` });

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_600px_at_10%_10%,#0ea5e920,transparent),radial-gradient(900px_450px_at_90%_20%,#f59e0b26,transparent),linear-gradient(180deg,#020617_0%,#04132d_45%,#031226_100%)]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-wide uppercase text-sky-200">
            <BellRing className="h-3.5 w-3.5" />
            Launching Soon
          </div>

          <div className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-300/30 bg-sky-500/10 text-sky-300">
            <Icon className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-white">
            {content.title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300">
            {content.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold">
              <Link to="/products">
                Explore Available Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <Link to="/contact">Notify Me on Launch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

