'use client';

import { useState, useEffect } from 'react';
import { categoryService, CreateCategoryDto, Category } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<CreateCategoryDto>({
    nombre: '',
    slug: '',
    descripcion: '',
    descripcion2: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  // Función para manejar la subida de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'categories'); // Carpeta destino

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setCategoryData(prev => ({ ...prev, imageUrl: data.url }));
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

  const loadCategories = async () => {
    try {
      const data = await categoryService.findAll();
      setCategories(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.create(categoryData);
      alert('Categoría creada con éxito');
      setCategoryData({ nombre: '', slug: '', descripcion: '', descripcion2: '', imageUrl: '' });
      loadCategories(); // Recargar la lista
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Categorías</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">Nueva Categoría</h2>
        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input 
                type="text" 
                name="nombre" 
                value={categoryData.nombre}
                onChange={handleCategoryChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] px-4 py-2 border" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
              <input 
                type="text" 
                name="slug" 
                value={categoryData.slug}
                onChange={handleCategoryChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] px-4 py-2 border" 
                required 
              />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
               
               {/* Input de Archivo */}
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
               
               {uploading && <p className="text-sm text-blue-500 mt-2">Subiendo imagen, por favor espera...</p>}

               {/* Previsualización */}
               {categoryData.imageUrl && (
                 <div className="mt-4">
                   <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img 
                     src={categoryData.imageUrl} 
                     alt="Preview" 
                     className="h-32 object-contain rounded border border-gray-200" 
                   />
                   {/* Campo oculto para enviar la URL al backend */}
                   <input type="hidden" name="imageUrl" value={categoryData.imageUrl} />
                 </div>
               )}
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Corta</label>
               <textarea 
                 name="descripcion" 
                 value={categoryData.descripcion}
                 onChange={handleCategoryChange}
                 rows={2}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] px-4 py-2 border"
               />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Adicional (Opcional)</label>
               <textarea 
                 name="descripcion2" 
                 value={categoryData.descripcion2}
                 onChange={handleCategoryChange}
                 rows={2}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#59AB9B] px-4 py-2 border"
               />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-[#59AB9B] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#4a8f82] transition-colors shadow-lg">
              Guardar Categoría
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Categorías Existentes */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">Categorías Existentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{cat.imageUrl || '-'}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No hay categorías registradas en el Backend.
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
