'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryService, productService, Category, Product } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await categoryService.findAll();
        setCategories(cats);

        const counts: Record<number, number> = {};
        await Promise.all(cats.map(async (cat) => {
          try {
            const products = await productService.findByCategory(cat.id);
            counts[cat.id] = products.length;
          } catch (error) {
            console.error(`Error fetching products for category ${cat.id}`, error);
            counts[cat.id] = 0;
          }
        }));
        
        setCategoryCounts(counts);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProductCount = (categoryId: number) => {
    const count = categoryCounts[categoryId] || 0;
    return count === 1 ? '1 PRODUCTO' : `${count} PRODUCTOS`;
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <p className="text-xl text-gray-600 dark:text-gray-300">Cargando categorías...</p>
     </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-zinc-900 dark:to-black font-sans">
      {/* Hero Section */}
      <div className="relative bg-[#EEEEEE] text-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-5xl text-[#59AB9B] font-extrabold tracking-tight mb-4 drop-shadow-md">
            Nuestros Servicios
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-black drop-shadow-sm">
            Encuentre el homenaje perfecto. Explore nuestras categorías diseñadas para brindar tranquilidad y respeto.
          </p>
        </div>
      </div>
      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.slug}`}
              className="group relative block h-[28rem]"
            >
              <div className="h-full w-full bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col border border-gray-100 dark:border-zinc-700">
                
                {/* Image Section */}
                <div className="relative h-3/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img 
                     src={category.imageUrl || '/placeholder.png'} 
                     alt={category.nombre} 
                     className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                   />
                </div>
                {/* Content Section */}
                <div className="flex flex-col justify-between flex-grow relative z-20 bg-white dark:bg-zinc-800">
                  <div className="p-6 flex items-center justify-center flex-grow">
                    <h2 className="text-2xl text-center font-bold text-[#59AB9B] dark:text-white group-hover:text-[#F6AA28] dark:group-hover:text-blue-400 transition-colors drop-shadow-md">
                      {category.nombre}
                    </h2>
                  </div>
                  
                  <div className="w-full bg-[#59AB9B] py-3 text-center text-white font-bold tracking-wider text-md group-hover:bg-[#F6AA28] transition-colors">
                    {getProductCount(category.id)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
