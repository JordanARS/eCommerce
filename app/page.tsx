import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-6">
      <h1 className="text-4xl font-bold text-black dark:text-white">Welcome to Our E-Commerce Store</h1>
      <Link 
        href="/categories" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Ver Categorías
      </Link>
    </div>
  );
}
