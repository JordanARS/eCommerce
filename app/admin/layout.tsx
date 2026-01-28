import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">
          Admin E-Commerce
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/categories" 
            className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            Categorías
          </Link>
          <Link 
            href="/admin/products" 
            className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            Productos
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
