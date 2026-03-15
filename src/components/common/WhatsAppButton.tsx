import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = '918688575044';
  const message = 'Hello SK Mobiles, I want to order custom case for my mobile';
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Show button after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-all duration-500 transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group relative"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="w-9 h-9" />
        
        {/* Waving Hand Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center gap-2 font-medium">
          <span>Order from whatsapp</span>
          <span className="animate-bounce origin-bottom-right inline-block text-xl">
            👋
          </span>
          {/* Tooltip Arrow */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white transform rotate-45"></div>
        </div>

        {/* Ping Animation Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      </a>
    </div>
  );
}
