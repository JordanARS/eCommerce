'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService, categoryService, Category, Product } from '@/lib/api';

interface ProductOption {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface ProductImage {
  id?: number;
  imageUrl: string;
  displayOrder: number;
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  
  // Estado para modo Edición
  const [editingId, setEditingId] = useState<number | null>(null);

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
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  }, []);

  const resetForm = () => {
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
      setEditingId(null);
  };

  const handleEditClick = async (product: Product) => {
    // Marcamos que estamos editando este ID
    setEditingId(product.id);
    
    // 1. Seteamos datos PRELIMINARES que ya tenemos en la lista (para feedback rápido)
    setProductData({
        nombre: product.nombre || '',
        categoryId: product.categoryId ? product.categoryId.toString() : (categories.length > 0 ? categories[0].id.toString() : ''),
        precioBase: Number(product.precioBase),
        stock: Number(product.stock),
        sku: product.sku || '',
        descripcionPrincipal: product.descripcionPrincipal || '',
        descripcionCorta: product.descripcionCorta || '',
        descripcionLarga: product.descripcionLarga || '',
        imagenPrincipal: product.imagenPrincipal || ''
    });

    // Limpiamos estados complejos mientras carga lo real
    setGalleryImages([]);
    setOptions([]);
    
    // Scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Traemos la DATA COMPLETA del servidor
    try {
        const fullProduct = await productService.findOne(product.id);
        
        let foundCategoryId = fullProduct.categoryId ? fullProduct.categoryId.toString() : '';
      
        // FIX: Si el backend no devuelve categoryId, buscamos manualmente en qué categoría está el producto
        if (!foundCategoryId && categories.length > 0) {
           // Creamos una promesa por cada categoría para buscar el producto
           const results = await Promise.all(
             categories.map(async (cat) => {
               try {
                 const prods = await productService.findByCategory(cat.id);
                 return prods.some(p => p.id === fullProduct.id) ? cat.id.toString() : null;
               } catch (e) {
                 return null;
               }
             })
           );
           // Tomamos el primer resultado no nulo
           foundCategoryId = results.find(r => r !== null) || foundCategoryId;
        }
      
        // Actualizamos con la data fresca y la categoría encontrada
        setProductData(prev => ({
            ...prev,
            nombre: fullProduct.nombre || prev.nombre,
            categoryId: foundCategoryId || prev.categoryId,
            precioBase: Number(fullProduct.precioBase),
            stock: Number(fullProduct.stock),
            sku: fullProduct.sku || prev.sku,
            descripcionPrincipal: fullProduct.descripcionPrincipal || prev.descripcionPrincipal,
            descripcionCorta: fullProduct.descripcionCorta || prev.descripcionCorta,
            descripcionLarga: fullProduct.descripcionLarga || prev.descripcionLarga,
            imagenPrincipal: fullProduct.imagenPrincipal || prev.imagenPrincipal
        }));

        // Mapear imágenes si existen desde el detalle completo
        if (fullProduct.images && fullProduct.images.length > 0) {
            setGalleryImages(fullProduct.images);
        }

        // Mapear opciones si existen desde el detalle completo
        if (fullProduct.options && fullProduct.options.length > 0) {
            // Aseguramos conversión de tipos
            const mappedOptions = fullProduct.options.map(opt => ({
                id: opt.id,
                nombre: opt.nombre,
                precio: Number(opt.precio),
                stock: Number(opt.stock)
            }));
            setOptions(mappedOptions);
        }

    } catch (error) {
        console.error("Error cargando detalles del producto:", error);
        alert("No se pudieron cargar los detalles completos (opciones/imagenes).");
    }
  };

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
        if (data.length > 0 && !editingId) {
            setProductData(prev => ({ ...prev, categoryId: data[0].id.toString() }));
        }
      })
      .catch(err => console.error('Error cargando categorías', err));
  }, [loadProducts, editingId]);

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

      if (editingId) {
        await productService.update(editingId, payload);
        alert('Producto actualizado con éxito');
      } else {
        await productService.create(payload);
        alert('Producto creado con éxito');
      }
      
      loadProducts();
      resetForm();

    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className="space-y-12">
      {/* Formulario de Producto */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex justify-between items-center">
            {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
             {editingId && (
                <button 
                    onClick={resetForm}
                    className="text-sm text-gray-500 hover:text-red-500 underline"
                >
                    Cancelar Edición
                </button>
            )}
        </h2>
        <form onSubmit={handleProductSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={productData.nombre}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoryId"
                value={productData.categoryId}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base</label>
              <input
                type="number"
                name="precioBase"
                value={productData.precioBase}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                required
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#59AB9B] file:text-white
                    hover:file:bg-[#4a9688]"
                />
                {uploading && <span className="text-sm text-gray-500">Subiendo...</span>}
              </div>
              {productData.imagenPrincipal && (
                 // eslint-disable-next-line @next/next/no-img-element
                <img src={productData.imagenPrincipal} alt="Preview" className="h-32 mt-4 object-cover rounded-md border" />
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Galería de Imágenes Adicionales</label>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                   className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#59AB9B] file:text-white
                    hover:file:bg-[#4a9688]"
                />
                {galleryUploading && <span className="text-sm text-gray-500">Subiendo...</span>}
              </div>
              
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-2">
                    {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative group border rounded-md overflow-hidden">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.imageUrl} alt={`Gallery ${idx}`} className="w-full h-24 object-cover" />
                            <button
                                type="button" 
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Principal</label>
              <textarea
                name="descripcionPrincipal"
                value={productData.descripcionPrincipal}
                onChange={handleProductChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
              />
            </div>
            
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
              <textarea
                name="descripcionCorta"
                value={productData.descripcionCorta}
                onChange={handleProductChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
              />
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Larga</label>
              <textarea
                name="descripcionLarga"
                value={productData.descripcionLarga}
                onChange={handleProductChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#59AB9B] focus:border-[#59AB9B]"
              />
            </div>
          </div>

          {/* Sección de Opciones / Variantes */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Variantes del Producto (Opcional)</h3>
            
            <div className="flex gap-4 items-end mb-4 bg-gray-50 p-4 rounded-md">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Opción</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Cenizario filas 6-7"
                        value={newOption.nombre}
                        onChange={(e) => setNewOption({...newOption, nombre: e.target.value})}
                        className="p-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Precio</label>
                    <input 
                        type="number" 
                        placeholder="0"
                        value={newOption.precio}
                        onChange={(e) => setNewOption({...newOption, precio: Number(e.target.value)})}
                        className="p-2 border border-gray-300 rounded-md text-sm w-32"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                    <input 
                        type="number" 
                        placeholder="0"
                        value={newOption.stock}
                        onChange={(e) => setNewOption({...newOption, stock: Number(e.target.value)})}
                        className="p-2 border border-gray-300 rounded-md text-sm w-24"
                    />
                </div>
                <button 
                    type="button"
                    onClick={addOption}
                    className="bg-[#59AB9B] text-white px-4 py-2 rounded-md hover:bg-[#4a9688] text-sm font-bold"
                >
                    Agregar Opción
                </button>
            </div>

            {options.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {options.map((opt, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opt.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${opt.precio}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opt.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            type="button" 
                                            onClick={() => removeOption(idx)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#59AB9B] text-white font-bold py-3 px-4 rounded-md hover:bg-[#4a9688] transition-colors shadow-lg"
          >
            {editingId ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </form>
      </section>

      {/* Lista de Productos */}
      <section className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b border-gray-200 text-gray-800">Inventario Actual</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.imagenPrincipal || '/placeholder.png'} alt={product.nombre} className="h-10 w-10 rounded-full object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${product.precioBase} 
                    {product.options && product.options.length > 0 && <span className="text-xs text-blue-500 ml-1">({product.options.length} vars)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                        onClick={() => handleEditClick(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                        Editar
                    </button>
                    {/* Placeholder para Delete si se implementa despues */}
                    {/* <button className="text-red-600 hover:text-red-900">Eliminar</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
