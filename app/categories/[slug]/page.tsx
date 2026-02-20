import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoryService, productService, Product } from '@/lib/api';

export default async function CategoryProductsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  
  // 1. Obtener Categoría por Slug (desde API)
  let category;
  try {
    category = await categoryService.findOne(slug);
  } catch (error) {
    console.error('Error fetching category:', error);
    notFound();
  }

  // 2. Obtener productos de la categoría específica
  let products: Product[] = [];
  try {
    // Primero obtenemos la lista básica (que no trae opciones)
    const basicProducts = await productService.findByCategory(category.id);
    
    // Luego cargamos el detalle completo de cada producto para obtener sus opciones
    if (basicProducts.length > 0) {
        products = await Promise.all(
            basicProducts.map(async (p) => {
                try {
                    return await productService.findOne(p.id);
                } catch (error) {
                    console.error(`Error loading details for product ${p.id}`, error);
                    return p; // Devuelve el básico si falla el detalle
                }
            })
        );
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-6xl w-full">
        <Link href="/categories" className="inline-flex items-center text-gray-600 hover:text-[#59AB9B] transition-colors mb-8 group font-medium">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Categorías
        </Link>
        
        <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">{category.nombre}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{category.descripcion}</p>
        </header>

        <div className="flex flex-wrap justify-center gap-8">
          {products.length > 0 ? (
            products.map((product) => {
              const hasOptions = product.options && product.options.length > 0;
              
              const minPrice = hasOptions
                ? Math.min(...product.options!.map(o => o.precio || 0))
                : product.precioBase;
                
              const maxPrice = hasOptions
                ? Math.max(...product.options!.map(o => o.precio || 0))
                : product.precioBase;

              const formatPrice = (price: number) => 
                new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

              const priceDisplay = minPrice !== maxPrice 
                ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                : formatPrice(minPrice);

              return (
              <div key={product.id} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-zinc-700">
                 <div className="h-56 w-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-400 overflow-hidden">
                    <Image 
                        src={product.imagenPrincipal || '/placeholder.svg'} 
                        alt={product.nombre} 
                        width={354} 
                        height={354}
                        className="object-cover w-full h-full"
                    />
                 </div>
                 <div className="p-6">
                    <div className="flex flex-col items-center mb-2">
                        <h3 className="text-[1.2rem] text-center font-bold text-gray-900 dark:text-white">{product.nombre}</h3>
                        <span className="text-green-800 text-[1.4rem] font-semibold px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 mt-4 mb-3">
                            {priceDisplay}
                        </span>
                    </div>
                    
                    {product.descripcionCorta && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2 h-10 overflow-hidden text-center text-sm px-4"> 
                            {product.descripcionCorta}
                        </p>
                    )}

                    <div className="mt-auto">
                        {hasOptions ? (
                             <Link 
                                href={`/categories/${category.slug}/${product.id}`}
                                className="w-full bg-[#59AB9B] hover:bg-[#F6AA28] text-white font-bold py-2 px-4 rounded-3xl transition-colors block text-center uppercase"
                            >
                                Seleccionar Opciones
                            </Link>
                        ) : (
                            <button className="w-full bg-[#59AB9B] hover:bg-[#F6AA28] text-white font-bold py-2 px-4 rounded-3xl transition-colors cursor-pointer uppercase">
                                Agregar al Carrito
                            </button>
                        )}
                    </div>
                 </div>
              </div>
            );
          })
          ) : (
            <div className="w-full text-center py-10 text-gray-500 text-xl">
                No hay productos en esta categoría actualmente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
