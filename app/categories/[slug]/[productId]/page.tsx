import { productService, categoryService } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage(props: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const params = await props.params;
  const { slug, productId } = params;
  
  try {
    const category = await categoryService.findOne(slug);
    const product = await productService.findOne(Number(productId));

    if (!category || !product) {
      notFound();
    }

    return <ProductDetail product={product} category={category} />;
  } catch (error) {
    notFound();
  }
} 