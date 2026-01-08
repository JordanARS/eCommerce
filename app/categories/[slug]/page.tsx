
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CategoryProductsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.id);

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-6xl w-full">
        <Link href="/categories" className="text-blue-500 mb-8 inline-block dark:text-blue-400">
          Volver a Categorías
        </Link>
        
        <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">{category.name}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{category.description}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-zinc-700">
                 <div className="h-56 w-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-400">
                    <span className="text-lg">Imagen del Producto</span>
                 </div>
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                        <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            ${product.price}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 h-12 overflow-hidden"> 
                        {product.description}
                    </p>
                    <div className="mt-auto">
                        {product.hasOptions ? (
                             <Link 
                                href={`/categories/${category.slug}/${product.id}`}
                                className="w-full bg-[#59AB9B] hover:bg-[#F6AA28] text-white font-bold py-2 px-4 rounded transition-colors block text-center uppercase"
                            >
                                Seleccionar Opciones
                            </Link>
                        ) : (
                            <button className="w-full bg-[#59AB9B] hover:bg-[#F6AA28] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer uppercase">
                                Agregar al Carrito
                            </button>
                        )}
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500 text-xl">
                No hay productos en esta categoría actualmente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
