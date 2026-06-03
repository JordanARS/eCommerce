const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface FetchWithAuthOptions extends RequestInit {
  redirectOnUnauthorized?: boolean;
}

// Helper para fetch con credenciales (cookies)
async function fetchWithAuth(url: string, options: FetchWithAuthOptions = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const { redirectOnUnauthorized = true, ...requestOptions } = options;

  const config = {
    ...requestOptions,
    headers: {
      ...defaultHeaders,
      ...requestOptions.headers,
    },
    credentials: 'include' as RequestCredentials, // Para enviar/recibir las cookies
  };

  const res = await fetch(`${API_URL}${url}`, config);
  
  // Si la respuesta es 401 (No autorizado), podríamos redirigir al login aquí o manejarlo en la UI
  if (
    redirectOnUnauthorized &&
    res.status === 401 &&
    typeof window !== 'undefined' &&
    !window.location.pathname.includes('/auth/login')
  ) {
     window.location.href = '/auth/login';
  }

  return res;
}

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
    const res = await fetchWithAuth('/categories');
    if (!res.ok) throw new Error('Error al obtener categorías');
    return res.json();
  },

  async create(data: CreateCategoryDto) {
    const res = await fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al crear la categoría');
    }
    
    return res.json();
  },

  async findOne(slug: string) {
    const res = await fetchWithAuth(`/categories/${slug}`);
    if (!res.ok) throw new Error('Error al obtener la categoría');
    return res.json();
  },

  async update(id: number, data: Partial<CreateCategoryDto>) {
    const res = await fetchWithAuth(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría');
    }
    
    return res.json();
  },

  async remove(id: number) {
    const res = await fetchWithAuth(`/categories/${id}`, {
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
    const res = await fetchWithAuth('/products');
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async findOne(id: number): Promise<Product> {
    const res = await fetchWithAuth(`/products/${id}`);
    if (!res.ok) throw new Error('Error al obtener producto');
    return res.json();
  },

  async create(data: CreateProductDto) {
    const res = await fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al crear el producto');
    }
    
    return res.json();
  },

  async findByCategory(categoryId: number): Promise<Product[]> {
    const res = await fetchWithAuth(`/products?categoryId=${categoryId}`);
    if (!res.ok) throw new Error('Error al obtener productos de la categoría');
    return res.json();
  },

  async update(id: number, data: Partial<CreateProductDto>) {
    const res = await fetchWithAuth(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar el producto');
    }
    return res.json();
  },

  async remove(id: number) {
    const res = await fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) throw new Error('Error al eliminar el producto');
    return true; 
  }
};

export const authService = {
  async register(data: { nombres: string; apellidos: string; email: string; telefono: string; password: string }) {
    const res = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Registro fallido';
      try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Login fallido';
      try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }
    return res.json();
  },

  async logout() {
    await fetchWithAuth('/auth/logout', { method: 'POST' });
  },

  async checkAuth() {
    try {      const res = await fetchWithAuth('/auth/profile', { redirectOnUnauthorized: false });      return res.ok;
    } catch {
      return false;
    }
  },

  async getProfile(): Promise<Record<string, unknown> | null> {
    try {
      const res = await fetchWithAuth('/auth/profile', { redirectOnUnauthorized: false });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
};

export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  roleId: number; 
  rol?: { id: number; nombre: string };
  estado: boolean;
}

export const userService = {
  async findAll(): Promise<User[]> {
    const res = await fetchWithAuth('/users');
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return res.json();
  },

  async update(userId: number, data: Partial<User>) {
    const res = await fetchWithAuth(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar el usuario');
    }
    
    return res.json();
  }
};

