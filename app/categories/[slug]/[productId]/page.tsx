import { getProductById, getCategoryBySlug } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage(props: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const params = await props.params;
  const { slug, productId } = params;
  
  const category = getCategoryBySlug(slug);
  const product = getProductById(productId);

  if (!category || !product) {
    notFound();
  }

  return <ProductDetail product={product} category={category} />;
}
