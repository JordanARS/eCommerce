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
    } catch (error) {
      setStatus('error');
      setMessage('No se pudo conectar con el Backend. Asegúrese de que NestJS esté corriendo.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h1>
      
      {/* Connection Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          Estado del Sistema
        </h2>          
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">
              API Endpoint: <code className="bg-gray-200 px-2 py-1 rounded text-sm">{process.env.NEXT_PUBLIC_API_URL}</code>
            </p>
            <p className="text-sm text-gray-500">
              Verifica la conexión con el servicio backend.
            </p>
          </div>          
          <button
            onClick={checkConnection}
            disabled={status === 'cargando...'}
            className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${
              status === 'cargando...' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#59AB9B] hover:bg-[#4a8f82]'
            }`}
          >
            {status === 'cargando...' ? 'Verificando...' : 'Comprobar Conexión'}
          </button>
        </div>

        {/* Status Display */}
        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-lg flex items-center ${
            status === 'success' ? 'bg-green-100 text-green-800' : 
            status === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            <div className={`w-3 h-3 rounded-full mr-3 ${
              status === 'success' ? 'bg-green-500' : 
              status === 'error' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
            }`}></div>
            <span className="font-medium">{message}</span>
          </div>
        )}
      </div>

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
      </div>
    </div>
  );
}
