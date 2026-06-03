'use client';

import { useMemo, useState } from 'react';

type OrderStatus = 'pendiente' | 'despachado' | 'entregado' | 'cancelado';

interface OrderItem {
  name: string;
  quantity: number;
}

interface AdminOrder {
  id: string;
  cliente: string;
  email: string;
  fecha: string;
  ciudad: string;
  estado: OrderStatus;
  total: number;
  items: OrderItem[];
}

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: 'PED-1024',
    cliente: 'Carlos Ramirez',
    email: 'carlos.ramirez@gmail.com',
    fecha: '2026-03-10 09:15',
    ciudad: 'Villavicencio',
    estado: 'pendiente',
    total: 2300000,
    items: [
      { name: 'Columbario Familiar', quantity: 1 },
      { name: 'Placa Conmemorativa', quantity: 1 },
    ],
  },
  {
    id: 'PED-1023',
    cliente: 'Laura Gomez',
    email: 'laura.gomez@gmail.com',
    fecha: '2026-03-09 14:30',
    ciudad: 'Villavicencio',
    estado: 'despachado',
    total: 1500000,
    items: [{ name: 'Columbario Parque Cementerio', quantity: 1 }],
  },
  {
    id: 'PED-1022',
    cliente: 'Jorge Martinez',
    email: 'jorge.martinez@gmail.com',
    fecha: '2026-03-08 11:45',
    ciudad: 'Villavicencio',
    estado: 'entregado',
    total: 3600000,
    items: [
      { name: 'Parque Cementerio Villavicencio', quantity: 1 },
      { name: 'Mantenimiento Premium', quantity: 1 },
    ],
  },
  {
    id: 'PED-1021',
    cliente: 'Andres Castro',
    email: 'andres.castro@gmail.com',
    fecha: '2026-03-07 16:20',
    ciudad: 'Villavicencio',
    estado: 'cancelado',
    total: 980000,
    items: [{ name: 'Cenizario Av40', quantity: 1 }],
  },
  {
    id: 'PED-1020',
    cliente: 'Paula Medina',
    email: 'paula.medina@gmail.com',
    fecha: '2026-03-06 10:05',
    ciudad: 'Villavicencio',
    estado: 'entregado',
    total: 1250000,
    items: [{ name: 'Columbario Individual', quantity: 1 }],
  },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  despachado: 'Despachado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente: 'bg-amber-100 text-amber-800',
  despachado: 'bg-blue-100 text-blue-800',
  entregado: 'bg-emerald-100 text-emerald-800',
  cancelado: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<'todos' | OrderStatus>('todos');

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'todos') return MOCK_ORDERS;
    return MOCK_ORDERS.filter((order) => order.estado === activeFilter);
  }, [activeFilter]);

  const stats = useMemo(() => {
    return {
      total: MOCK_ORDERS.length,
      pendientes: MOCK_ORDERS.filter((o) => o.estado === 'pendiente').length,
      despachados: MOCK_ORDERS.filter((o) => o.estado === 'despachado').length,
      entregados: MOCK_ORDERS.filter((o) => o.estado === 'entregado').length,
      cancelados: MOCK_ORDERS.filter((o) => o.estado === 'cancelado').length,
    };
  }, []);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Pedidos</h1>
        <p className="text-gray-600 mt-2">
          Estados de los pedidos.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <article className="bg-white rounded-xl shadow p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total pedidos</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </article>
        <article className="bg-amber-50 rounded-xl shadow p-4 border border-amber-100">
          <p className="text-sm text-amber-700">Pendientes</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{stats.pendientes}</p>
        </article>
        <article className="bg-blue-50 rounded-xl shadow p-4 border border-blue-100">
          <p className="text-sm text-blue-700">Despachados</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.despachados}</p>
        </article>
        <article className="bg-emerald-50 rounded-xl shadow p-4 border border-emerald-100">
          <p className="text-sm text-emerald-700">Entregados</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.entregados}</p>
        </article>
        <article className="bg-red-50 rounded-xl shadow p-4 border border-red-100">
          <p className="text-sm text-red-700">Cancelados</p>
          <p className="text-2xl font-bold text-red-800 mt-1">{stats.cancelados}</p>
        </article>
      </section>

      <section className="bg-white rounded-xl shadow border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {(['todos', 'pendiente', 'despachado', 'entregado', 'cancelado'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === status
                  ? 'bg-[#59AB9B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'todos' ? 'Todos' : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pedido</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Productos</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ciudad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-gray-800">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.fecha}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">{order.cliente}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.name}`}>
                          {item.quantity} x {item.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{order.ciudad}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.estado]}`}
                    >
                      {STATUS_LABELS[order.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">{formatPrice(order.total)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No hay pedidos para el estado seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}