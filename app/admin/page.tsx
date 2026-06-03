'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [status, setStatus] = useState<'idle' | 'cargando...' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const checkConnection = async () => {
    setStatus('cargando...');
    setMessage('Conectando con el Backend...');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setStatus('success');
        setMessage('¡Conexión Exitosa! Base de Datos Operativa.');
      } else {
        setStatus('error');
        setMessage(`Error del Servidor: ${res.status} ${res.statusText}`);
      }
    } catch {
      setStatus('error');
      setMessage('No se pudo conectar con el Backend. Asegúrese de que NestJS esté corriendo.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/categories" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-[#59AB9B]">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#59AB9B] mb-2">Gestionar Categorías</h3>
            <p className="text-gray-600">Crear y editar categorías de productos.</p>
          </div>
        </Link>
        <Link href="/admin/products" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-[#59AB9B]">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#59AB9B] mb-2">Gestionar Productos</h3>
            <p className="text-gray-600">Agregar nuevos productos al inventario.</p>
          </div>
        </Link>
        <Link href="/admin/orders" className="block group md:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent hover:border-[#59AB9B]">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#59AB9B] mb-2">Panel de Pedidos</h3>
            <p className="text-gray-600">Visualiza pedidos pendientes, en despacho, entregados y cancelados.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
