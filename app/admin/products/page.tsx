'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService, categoryService, Category, Product } from '@/lib/api';

interface ProductOption {
  nombre: string;
  precio: number;
  stock: number;
}

interface ProductImage {
  imageUrl: string;
  displayOrder: number;
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  
  // Estado básico
  const [productData, setProductData] = useState({
    nombre: '',
    categoryId: '',
    precioBase: 0,
    stock: 0,
    sku: '',
    descripcionPrincipal: '',
    descripcionCorta: '',
    descripcionLarga: '',
    imagenPrincipal: ''
  });

  // Novos estados para Opciones y Galería
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([]);

  // Estado temporal para agregar una nueva opción
  const [newOption, setNewOption] = useState<ProductOption>({ nombre: '', precio: 0, stock: 0 });

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.findAll();
      console.log('Productos cargados:', data); 
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setProductData(prev => ({ ...prev, imagenPrincipal: data.url }));
      } else {
        alert('Error al subir imagen: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setGalleryUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products/gallery');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (data.success) {
        setGalleryImages(prev => [
            ...prev, 
            { imageUrl: data.url, displayOrder: prev.length + 1 }
        ]);
      } else {
        alert('Error al subir imagen de galería: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const addOption = () => {
    if (!newOption.nombre) {
        alert("El nombre de la opción es obligatorio");
        return;
    }
    setOptions(prev => [...prev, newOption]);
    setNewOption({ nombre: '', precio: 0, stock: 0 });
  };

  const removeOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    loadProducts();
    // Cargar categorías para el selector
    categoryService.findAll()
      .then(data => {
        setCategories(data);
        if (data.length > 0) {
            setProductData(prev => ({ ...prev, categoryId: data[0].id.toString() }));
        }
      })
      .catch(err => console.error('Error cargando categorías', err));
  }, [loadProducts]);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'precioBase' || name === 'stock' ? Number(value) : value
    }));
  };

  const generateSlug = (text: string) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productData,
        slug: generateSlug(productData.nombre),
        categoryId: Number(productData.categoryId),
        images: galleryImages, // Enviamos las imágenes de galería
        options: options       // Enviamos las opciones
      };

      console.log('Enviando payload:', payload);

      await productService.create(payload);
      alert('Producto creado con éxito');
      loadProducts();
      // Reset forms
      setProductData({
        nombre: '',
        categoryId: categories.length > 0 ? categories[0].id.toString() : '',
        precioBase: 0,
        stock: 0,
        sku: '',
        descripcionPrincipal: '',
        descripcionCorta: '',
        descripcionLarga: '',
        imagenPrincipal: ''
      });
      setOptions([]);
      setGalleryImages([]);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Productos</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">Crear Nuevo Producto</h2>
        
        <form onSubmit={handleProductSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
              <input 
                type="text" 
                name="nombre" 
                value={productData.nombre}
                onChange={handleProductChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border" 
                placeholder="Ej: Cenizario..."
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select 
                name="categoryId" 
                value={productData.categoryId}
                onChange={handleProductChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border bg-white"
              >
                {categories.length === 0 && <option value="">Cargando categorías...</option>}
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base ($)</label>
              <input 
                type="number" 
                name="precioBase"
                value={productData.precioBase}
                onChange={handleProductChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border" 
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Inicial</label>
              <input 
                type="number" 
                name="stock"
                value={productData.stock}
                onChange={handleProductChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border" 
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU (Código)</label>
              <input 
                type="text" 
                name="sku"
                value={productData.sku}
                onChange={handleProductChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Principal</label>
              
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#59AB9B] file:text-white
                  hover:file:bg-[#4a8f82]
                "
              />
              
              {uploading && <p className="text-sm text-blue-500 mt-2">Subiendo imagen...</p>}

              {productData.imagenPrincipal && (
                 <div className="mt-4">
                   <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img 
                     src={productData.imagenPrincipal} 
                     alt="Preview" 
                     className="h-32 object-contain rounded border border-gray-200" 
                   />
                   <input type="hidden" name="imagenPrincipal" value={productData.imagenPrincipal} />
                 </div>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Corta (Card)</label>
              <textarea 
                name="descripcionCorta" 
                value={productData.descripcionCorta}
                onChange={handleProductChange}
                rows={2}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border"
                placeholder="Breve descripción..."
              ></textarea>
             </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Principal</label>
              <textarea 
                name="descripcionPrincipal" 
                value={productData.descripcionPrincipal}
                onChange={handleProductChange}
                rows={3}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border"
                placeholder="Descripción general..."
              ></textarea>
             </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Larga (Detalle)</label>
              <textarea 
                name="descripcionLarga" 
                value={productData.descripcionLarga}
                onChange={handleProductChange}
                rows={5}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] focus:border-[#59AB9B] px-4 py-2 border"
                placeholder="Texto extenso..."
              ></textarea>
             </div>
          </div>

          {/* GALERÍA DE IMÁGENES */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Galería de Imágenes</h3>
            <div className="space-y-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F6AA28] file:text-white hover:file:bg-orange-400"
                />
                {galleryUploading && <p className="text-sm text-blue-500">Subiendo a galería...</p>}
                
                <div className="flex flex-wrap gap-4 mt-4">
                    {galleryImages.map((img, index) => (
                        <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.imageUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-1 text-xs"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {galleryImages.length === 0 && <p className="text-gray-400 text-sm italic">Sin imágenes adicionales</p>}
                </div>
            </div>
          </div>

          {/* OPCIONES DEL PRODUCTO */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Opciones / Variantes</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <input 
                        type="text" 
                        placeholder="Nombre Opción (Ej: Filas 1-2)" 
                        className="border p-2 rounded"
                        value={newOption.nombre}
                        onChange={(e) => setNewOption({ ...newOption, nombre: e.target.value })}
                    />
                    <input 
                        type="number" 
                        placeholder="Precio" 
                        className="border p-2 rounded"
                        value={newOption.precio}
                        onChange={(e) => setNewOption({ ...newOption, precio: Number(e.target.value) })}
                    />
                    <input 
                        type="number" 
                        placeholder="Stock" 
                        className="border p-2 rounded"
                        value={newOption.stock}
                        onChange={(e) => setNewOption({ ...newOption, stock: Number(e.target.value) })}
                    />
                </div>
                <button 
                    type="button" 
                    onClick={addOption}
                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                >
                    + Agregar Opción
                </button>
            </div>

            <div className="space-y-2">
                {options.map((opt, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 border rounded shadow-sm">
                        <div>
                            <span className="font-bold text-gray-700 block">{opt.nombre}</span>
                            <span className="text-sm text-gray-500">Precio: ${opt.precio} | Stock: {opt.stock}</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
                {options.length === 0 && <p className="text-gray-400 text-sm italic">Sin opciones asignadas</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-[#59AB9B] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#4a8f82] transition-colors shadow-lg"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Productos Existentes */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">Productos Existentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={prod.imagenPrincipal || '/placeholder.svg'} 
                        alt={prod.nombre} 
                        className="h-10 w-10 rounded-full object-cover" 
                        onError={(e) => { 
                          const target = e.currentTarget;
                          if (target.src.includes('/placeholder.svg')) return;
                          target.src = '/placeholder.svg'; 
                        }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.precioBase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {/* El backend actualmente no devuelve options en la lista simple, 
                         habría que adaptar findAll si quisiéramos verlo aquí. 
                         Por ahora mostramos si tiene stock base. */}
                     {prod.stock} (Stock Base)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.sku}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
