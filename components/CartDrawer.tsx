'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleCart}
        />
      )}
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">Tu Carrito ({cart.length})</h2>
            <button 
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p>Tu carrito está vacío</p>
                <button 
                    onClick={toggleCart}
                    className="text-[#59AB9B] font-semibold hover:underline"
                >
                    Continuar comprando
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                      {item.selectedOptionName && (
                        <p className="text-xs text-cool-gray-500 mt-1">Opción: {item.selectedOptionName}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="font-bold text-[#59AB9B] text-sm">{formatPrice(item.price)}</span>
                       <div className="flex items-center border bg-white rounded">
                          <button 
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-xs w-6 text-center">{item.quantity}</span>
                          <button 
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          >
                            +
                          </button>
                       </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-400 hover:text-red-500 self-start p-1"
                  >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(cartTotal)}</span>
               </div>
               <Link href="/checkout" onClick={toggleCart}>
                 <button className="w-full bg-[#59AB9B] text-white font-bold py-3 rounded-lg shadow hover:bg-[#4a9688] transition-colors uppercase tracking-wider">
                    Finalizar Compra
                 </button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
