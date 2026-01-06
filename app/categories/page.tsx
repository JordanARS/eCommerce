
import Link from 'next/link';
import { categories } from '@/lib/data';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Categorías de Productos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="block group"
          >
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 border border-gray-200 dark:border-zinc-700">
              <div className="h-48 w-full bg-gray-200 dark:bg-zinc-700 relative">
                 <img 
                   src={category.image} 
                   alt={category.name} 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {category.description}
                </p>
                <div className="mt-4 text-blue-500 dark:text-blue-400 font-medium text-sm text-right">
                  Ver Productos &rarr;
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12">
        <Link href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white underline">
          &larr; Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
