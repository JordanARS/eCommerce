export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  description2?: string;
  image?: string;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface ProductOption {
  id: string;
  name: string;
  priceModifier?: number; // Precio adicional o específico
  price?: number; // Precio total si se selecciona esta opción
  addons?: ProductAddon[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  cardDescription?: string;
  description2?: string;
  image?: string;
  images?: string[]; // Para la galería
  hasOptions?: boolean;
  options?: ProductOption[];
  longDescription?: string;
  sku?: string;
  stock?: number;
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

  //Parque Cementerio Villavicencio
  { id: '101', 
    categoryId: '1', 
    name: 'Cementerio Parque Villavicencio',
    price: 3600000,
    description: 'Cenizario sencillo con lápida en mármol y posibilidad de convertirse en doble, con derecho de uso por diez años. Un espacio sereno para honrar la memoria de quienes amas.',
    longDescription: 'Cenizario sencillo con lápida en mármol y opción de convertirse en doble, diseñado para ofrecer un lugar de descanso digno y permanente para la memoria de sus seres amados, con derecho de uso del espacio por un periodo de diez años. Este servicio busca brindar un entorno de respeto, serenidad y homenaje, acompañando a las familias en el proceso de preservar y honrar el legado de quienes han partido.',
    image: '/parqueCementerio/main.png',
    images: [
      '/parqueCementerio/main.png',
      '/parqueCementerio/lateral.png',
      '/parqueCementerio/interior.png',
      '/parqueCementerio/sala.png'
    ],
    hasOptions: true,
    options: [
      { 
        id: 'op1', 
        name: 'Cenizario filas 3 a 5', 
        price: 3600000,
        addons: [
          { id: 'addon1', name: '2do Espacio Excedente', price: 1800000 },
        ]
      },
    ],
    sku: 'N/D',
    stock: 50
  },
  //Cenizario Av 40
  {
    id: '102', 
    categoryId: '1', 
    name: 'Cenizarios av 40', 
    price: 3000000, 
    description: 'Cenizarios de lujo personalizables, con lápida en vidrio y derecho de uso por 10 años (Para 1 solo fallecido).',
    cardDescription: 'El precio varía según la fila seleccionada.',
    longDescription: 'Nuestros cenizarios de lujo son personalizables, permitiendo elegir detalles y elementos que se adapten a las preferencias de cada familia. Cuentan con una elegante lápida en vidrio que aporta solemnidad y belleza al espacio. Incluyen derecho de uso por 10 años, garantizando tranquilidad, orden y un homenaje duradero.',
    image: '/cenizariosAv40/main.png',
    images: [
      '/cenizariosAv40/main.png',
      '/cenizariosAv40/lateral.png',
      '/cenizariosAv40/interior.png',
      '/cenizariosAv40/sala.png'
    ],
    hasOptions: true,
    options: [
      { id: 'op1', name: 'Cenizario filas 1 - 2', price: 3000000 },
      { id: 'op2', name: 'Cenizario filas 3 - 4 - 5', price: 4150000 },
      { id: 'op3', name: 'Cenizario filas 6 - 7', price: 3250000 }
    ],
    sku: 'N/D',
    stock: 50
  },
  // Columbarios
  { id: '201', 
    categoryId: '2', 
    name: 'Columbarios', 
    price: 1500000, 
    description: 'Espacio digno y sereno donde las cenizas de su ser querido se resguardan en una cápsula identificada con su nombre, fecha de nacimiento y fecha de fallecimiento. Se deposita en un espacio designado con una planta conmemorativa, y en un panel informativo se indica columna, fila y posición. Un lugar de paz rodeado de naturaleza para honrar su memoria. Este columbario puede adquirirse con derecho de uso a veinte (20) años o a perpetuidad.',
    longDescription: 'Espacio digno y sereno que resguarda las cenizas de su ser querido en una cápsula identificada con su nombre, fecha de nacimiento y de fallecimiento. El depósito se realiza en uno de los espacios designados, acompañado de una planta conmemorativa. En el área informativa se muestran la columna, fila, posición y los datos del ser querido. Este proyecto busca ofrecer un lugar de paz, rodeado de naturaleza, donde la memoria de quienes partieron permanezca honrada y resguardada con profundo respeto. Este columbario puede adquirirse con derecho de uso a veinte (20) años o a perpetuidad.',
    image: '/columbarios/main.png',
    images: [
      '/columbarios/main.png',
      '/columbarios/lateral.png',
      '/columbarios/sala.png'
    ],
    hasOptions: true,
    options: [
      { id: 'op1', name: '20 años', price: 1500000 },
      { id: 'op2', name: 'Perpetuidad', price: 2500000 },
    ],
    sku: 'N/D',
    stock: 100
  },
  
  // Mantenimiento de Lotes
  { id: '301', 
    categoryId: '3', 
    name: 'Anual Lote', 
    price: 300000, 
    description: 'Servicio completo garantizando el cuidado de su lote durante todo el año.',
    cardDescription: 'El precio varía según si es con o sin grama.',
    image: '/mantenimientos/main1.png',
    images: [
      '/mantenimientos/main1.png',
      '/mantenimientos/lateral.png',
      '/mantenimientos/sala.png'
    ],
    hasOptions: true,
    options: [
      { id: 'op1', name: 'Sin grama', price: 300000 },
      { id: 'op2', name: 'Con grama', price: 450000 },
    ],
    sku: 'N/D',
    stock: 100
  },

  { id: '302', 
    categoryId: '3', 
    name: 'Bianual Lote', 
    price: 550000, 
    description: 'El precio varía según si es con o sin grama.',
    cardDescription: 'El precio varía según si es con o sin grama.',
    image: '/mantenimientos/main2.png',
    images: [
      '/mantenimientos/main2.png',
      '/mantenimientos/lateral.png',
      '/mantenimientos/sala.png'
    ],
    hasOptions: true,
    options: [
      { id: 'op1', name: 'Sin grama', price: 550000 },
      { id: 'op2', name: 'Con grama', price: 700000 },
    ],
    sku: 'N/D',
    stock: 100
  },

  { id: '303', 
    categoryId: '3', 
    name: 'Trienio (A tres años)', 
    price: 800000, 
    description: 'Ahorro y confianza extendida por tres años.',
    cardDescription: 'El precio varía según si es con o sin grama.',
    image: '/mantenimientos/main3.png',
    images: [
      '/mantenimientos/main3.png',
      '/mantenimientos/lateral.png',
      '/mantenimientos/sala.png'
    ],
    hasOptions: true,
    options: [
      { id: 'op1', name: 'Sin grama', price: 800000 },
      { id: 'op2', name: 'Con grama', price: 1000000 },
    ],
    sku: 'N/D',
    stock: 100 
  },

  { id: '304', 
    categoryId: '3', 
    name: 'Cuatrienio (A cuatro años)', 
    price: 950000, 
    description: 'La opción de mayor duración para asegurar el bienestar de su lote.',
    cardDescription: 'El precio varía según si es con o sin grama.',
    image: '/mantenimientos/main4.png',
    images: [
      '/mantenimientos/main4.png',
      '/mantenimientos/lateral.png',
      '/mantenimientos/sala.png'
    ],
    hasOptions: true,
    options: [
      { id: 'op1', name: 'Sin grama', price: 950000 },
      { id: 'op2', name: 'Con grama', price: 1150000 },
    ],
    sku: 'N/D',
    stock: 100
  },


];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId);
}
