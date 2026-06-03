'use client';

import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function FloatingCartButton() {
  const { toggleCart, cartCount, isAuthenticated } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  if (!isAuthenticated) return null;

  return (
    <button 
      onClick={toggleCart}
      className="fixed top-6 right-6 z-50 p-3 bg-white text-[#59AB9B] rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-gray-100 group cursor-pointer"
      aria-label="Ver carrito"
    >
      <div className="relative">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#F6AA28] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-bounce">
            {cartCount}
            </span>
        )}
      </div>
    </button>
  );
}