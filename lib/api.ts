const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Category {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcion2?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  nombre: string;
  slug: string;
  descripcion: string;
  descripcion2?: string;
  imageUrl?: string;
}

export const categoryService = {
  async findAll(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return res.json();
  },

  async create(data: CreateCategoryDto) {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al crear la categoría');
    }
    
    return res.json();
  },

  async findOne(slug: string) {
    const res = await fetch(`${API_URL}/categories/${slug}`);
    if (!res.ok) throw new Error('Error al obtener la categoría');
    return res.json();
  },

  async update(id: number, data: Partial<CreateCategoryDto>) {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría');
    }
    
    return res.json();
  },

  async remove(id: number) {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) throw new Error('Error al eliminar la categoría');
    return true; 
  }
};

export interface CreateProductDto {
  nombre: string;
  slug: string;
  descripcionPrincipal: string;
  descripcionCorta: string;
  descripcionLarga: string;
  precioBase: number;
  stock: number;
  sku: string;
  imagenPrincipal: string;
  categoryId: number;
  images?: { imageUrl: string; displayOrder: number }[];
  options?: { nombre: string; precio: number; stock: number }[];
}

export interface Product {
    id: number;
    nombre: string;
    slug: string;
    descripcionPrincipal: string;
    descripcionCorta: string;
    descripcionLarga: string;
    precioBase: number;
    stock: number;
    sku: string;
    imagenPrincipal: string;
    categoryId: number;
    images?: { id: number; imageUrl: string; displayOrder: number }[];
    options?: { id: number; nombre: string; precio: number; stock: number }[];
}

export const productService = {
  async findAll(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async findOne(id: number): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Error al obtener producto');
    return res.json();
  },

  async create(data: CreateProductDto) {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al crear el producto');
    }
    
    return res.json();
  },

  async findByCategory(categoryId: number): Promise<Product[]> {
      const res = await fetch(`${API_URL}/products?categoryId=${categoryId}`);
      if (!res.ok) throw new Error('Error al obtener productos de la categoría');
      return res.json();
  },

  async update(id: number, data: Partial<CreateProductDto>) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar el producto');
      }
      
    return res.json();
  }
};

