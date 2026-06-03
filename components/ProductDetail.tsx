'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Category, Product } from '@/lib/api';
import MetodosPago from './metodosPago';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductDetailProps {
  product: Product;
  category: Category;
}

type ProductOption = NonNullable<Product['options']>[number];

export default function ProductDetail({ product, category }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.imagenPrincipal || (product.images && product.images.length > 0 ? product.images[0].imageUrl : '/placeholder.svg')
  );
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');

  // Map backend images to string array for gallery
  const galleryImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.imageUrl) 
    : [product.imagenPrincipal];
  
  // Calculate price range
  const hasOptions = product.options && product.options.length > 0;

  const minPrice = hasOptions
    ? Math.min(...product.options!.map(o => o.precio || 0))
    : product.precioBase;
  const maxPrice = hasOptions
    ? Math.max(...product.options!.map(o => o.precio || 0))
    : product.precioBase;

  const currentPrice = selectedOption 
    ? selectedOption.precio
    : minPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const optId = Number(e.target.value);
    if (!optId) {
      setSelectedOption(null);
      return;
    }
    const option = product.options?.find(o => o.id === optId);
    setSelectedOption(option || null);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.nombre,
      price: currentPrice,
      quantity: quantity,
      image: selectedImage,
      selectedOptionId: selectedOption?.id,
      selectedOptionName: selectedOption?.nombre
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
         {/* Breadcrumb */}

         <nav className="text-sm mb-8 text-gray-500">
           <Link href="/" className="hover:text-[#59AB9B]">Inicio</Link> 
           <span className="mx-2">/</span>
           <Link href={`/categories/${category.slug}`} className="hover:text-[#59AB9B] uppercase">{category.nombre}</Link>
           <span className="mx-2">/</span>
           <span className="text-gray-800 font-semibold">{product.nombre}</span>
         </nav>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column: Gallery */}
            <div className="space-y-4">
               <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    width={600}
                    height={600} 
                    src={selectedImage} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
                     <ZoomInIcon className="w-6 h-6 text-gray-600" />
                  </div>
               </div>
               
               <div className="grid grid-cols-4 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${selectedImage === img ? 'border-[#59AB9B]' : 'border-transparent hover:border-gray-300'}`}
                      onClick={() => setSelectedImage(img)}
                    >
                       <Image src={img} alt={`Vista ${idx + 1}`} width={150} height={150} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Column: Info */}
            <div>
               <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{category.nombre}</p>
               <h1 className="text-4xl font-bold text-[#59AB9B] mb-4">{product.nombre}</h1>
               
               <div className="text-2xl font-bold text-gray-800 mb-4">
                  {hasOptions && !selectedOption 
                    ? `${formatPrice(minPrice!)} – ${formatPrice(maxPrice!)}` 
                    : formatPrice(currentPrice!)
                  }
               </div>

               <p className="text-gray-600 mb-6 leading-relaxed">
                 {product.descripcionPrincipal}
               </p>

               {/* Options Selector */}
               {hasOptions && product.options && (
                 <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="mb-4">
                       <label htmlFor="options" className="block text-sm font-bold text-gray-700 mb-2">
                         Opciones Disponibles
                       </label>
                       <div className="flex gap-2 items-center">
                         <select 
                            id="options"
                            onChange={handleOptionChange}
                            value={selectedOption?.id || ''}
                            className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-[#59AB9B] focus:border-[#59AB9B] sm:text-sm rounded-md shadow-sm bg-white"
                         >
                            <option value="">Selecciona una opción</option>
                            {product.options.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.nombre}
                              </option>
                            ))}
                         </select>
                       </div>
                    </div>
                    
                    {selectedOption && (
                       <div className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in">
                          {formatPrice(currentPrice!)}
                       </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-[#7ad03a] font-semibold mb-4">
                       <span className={`w-2 h-2 rounded-full ${(product.stock ?? 0) > 0 ? 'bg-[#7ad03a]' : 'bg-red-500'}`}></span>
                       <span>{(product.stock ?? 0) > 0 ? <span className='text-[#7ad03a]'>{`${product.stock} disponibles`}</span> : <span className='text-red-500'>Agotado</span>}</span>
                    </div>

                    <div className="flex gap-4">
                       {/* Quantity */}
                       <div className="flex items-center border border-gray-300 rounded-md bg-white">
                          <button 
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <input 
                            type="text" 
                            className="w-12 text-center border-none focus:ring-0 text-gray-800 font-medium" 
                            value={quantity} 
                            readOnly 
                          />
                          <button 
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setQuantity(quantity + 1 )}
                          >
                            +
                          </button>
                       </div>

                       {/* Add Cart*/}
                       <button 
                         className={`flex-grow bg-[#59AB9B] text-white font-bold py-3 px-8 rounded-md shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-wider ${!selectedOption && hasOptions ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4a9688]'}`}
                         disabled={hasOptions && !selectedOption}
                         onClick={handleAddToCart}
                       >
                         Añadir al Carrito
                       </button>
                    </div>
                 </div>
               )}

               <div className="text-sm text-gray-500 space-y-1 mb-8">
                  <p>SKU: <span className="text-gray-700">{product.sku || 'N/D'}</span></p>
                  <p>Categoría: <Link href={`/categories/${category.slug}`} className="text-[#59AB9B] hover:underline">{category.nombre}</Link></p>
               </div>
               {/* Payment Logos Placeholder */}
               <MetodosPago />
            </div>
         </div>

         {/* Tabs Section */}
         <div className="border-t border-gray-200 pt-10">
            <div className="flex gap-8 mb-6 border-b border-gray-200">
               <button 
                 className={`pb-4 text-lg font-bold transition-colors cursor-pointer border-b-2 ${activeTab === 'description' ? 'border-[#59AB9B] text-[#59AB9B]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                 onClick={() => setActiveTab('description')}
               >
                 Descripción
               </button>
               <button 
                 className={`pb-4 text-lg font-bold transition-colors cursor-pointer border-b-2 ${activeTab === 'additional' ? 'border-[#59AB9B] text-[#59AB9B]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                 onClick={() => setActiveTab('additional')}
               >
                 Información adicional
               </button>
            </div>
            
            <div className="text-gray-600 leading-relaxed max-w-4xl">
               {activeTab === 'description' && (
                 <div className="animate-fade-in">
                    <p>{product.descripcionLarga || product.descripcionPrincipal}</p>
                 </div>
               )}
               {activeTab === 'additional' && (
                 <div className="animate-fade-in">
                    <table className="min-w-full md:w-1/2 text-sm text-left">
                       <tbody>
                          <tr className="border-b border-gray-100">
                             <th className="py-2 text-gray-800 font-medium">Peso</th>
                             <td className="py-2">N/D</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                             <th className="py-2 text-gray-800 font-medium">Dimensiones</th>
                             <td className="py-2">N/D</td>
                          </tr>
                          {hasOptions && (
                             <tr className="border-b border-gray-100">
                                <th className="py-2 text-gray-800 font-medium">Variantes</th>
                                <td className="py-2">{product.options?.length} opciones disponibles</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
