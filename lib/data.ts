export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Cenizarios av40 y Parque',
    slug: 'cenizarios-av40-y-parque',
    description: '',
    image: '/cenizarioPortada.png'
  },
  {
    id: '2',
    name: 'Columbarios',
    slug: 'columbarios',
    description: '',
    image: '/columbarioPortada.png'
  },
  {
    id: '3',
    name: 'Mantenimiento de Lotes',
    slug: 'mantenimiento-de-lotes',
    description: '',
    image: '/mantenimientoPortada.png'
  }
];

export const products: Product[] = [
  // Cenizarios av40 y Parque
  { id: '101', categoryId: '1', name: 'Cementerio Parque Villavicencio', price: 599, description: 'Cenizario sencillo con lápida en mármol y posibilidad de convertirse en doble, con derecho de uso por diez años. Un espacio sereno para honrar la memoria de quienes amas.' },
  { id: '102', categoryId: '1', name: 'Cenizario av 40', price: 1299, description: 'Cenizarios de lujo personalizables, con lápida en vidrio y derecho de uso por 10 años. Un espacio sereno para honrar la memoria de quienes amas.' },
  /* { id: '103', categoryId: '1', name: 'Auriculares Bluetooth', price: 89, description: 'Sonido de alta definición.' }, */
 
  // Columbarios
  { id: '201', categoryId: '2', name: 'Camiseta de Algodón', price: 25, description: 'Suave y cómoda.' },
  { id: '202', categoryId: '2', name: 'Jeans Clásicos', price: 50, description: 'Duraderos y con estilo.' },
  { id: '203', categoryId: '2', name: 'Zapatillas Deportivas', price: 80, description: 'Para correr o caminar.' },
  
  // Mantenimiento de Lotes
  { id: '301', categoryId: '3', name: 'Juego de Sábanas', price: 40, description: 'Suavidad para un buen descanso.' },
  { id: '302', categoryId: '3', name: 'Lámpara de Escritorio', price: 35, description: 'Iluminación LED ajustable.' },
  { id: '303', categoryId: '3', name: 'Maceta de Cerámica', price: 15, description: 'Perfecta para tus plantas.' },

];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId);
}
