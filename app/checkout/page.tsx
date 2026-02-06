'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nombreTitular: '',
    cedulaTitular: '',
    fechaNacimientoTitular: '',
    email: '',
    direccion: '',
    barrio: '',
    telefono1: '',
    telefono2: '',
    nombreFallecido: '',
    cedulaFallecido: '',
    fechaNacimientoFallecido: '',
    fechaFallecimiento: '',
    metodoPago: 'PSE'
  });

  const [files, setFiles] = useState<{
    cedulaTitularFile: File | null;
    cedulaFallecidoFile: File | null;
    registroDefuncionFile: File | null;
  }>({
    cedulaTitularFile: null,
    cedulaFallecidoFile: null,
    registroDefuncionFile: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFiles(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
        const data = new FormData();
        // Agregar datos de texto
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        
        // Agregar archivos
        if (files.cedulaTitularFile) data.append('cedulaTitularFile', files.cedulaTitularFile);
        if (files.cedulaFallecidoFile) data.append('cedulaFallecidoFile', files.cedulaFallecidoFile);
        if (files.registroDefuncionFile) data.append('registroDefuncionFile', files.registroDefuncionFile);

        // Agregar datos del carrito y totales
        data.append('cart', JSON.stringify(cart));
        data.append('total', cartTotal.toString());

        // Enviar al backend
        const response = await fetch('/api/checkout', {
            method: 'POST',
            body: data,
        });

        const result = await response.json();

        if (result.success) {
            // Limpiar el carrito antes de finalizar
            clearCart();

            if (formData.metodoPago === 'PSE') {

                 alert('Pedido recibido correctamente. Revisa tu correo electrónico para más detalles.');
                 // Opcional: Redirigir al inicio
                 window.location.href = '/';
            } else {
                alert('Pedido recibido. Revisa tu correo.');
                setIsProcessing(false);
            }
        } else {
            alert('Hubo un error al procesar el pedido: ' + result.message);
            setIsProcessing(false);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al enviar el pedido.');
        setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
        <Link href="/" className="text-[#59AB9B] hover:underline font-semibold">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#59AB9B] mb-8">Finalizar compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna Izquierda: Formulario */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Información del Cliente */}
              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#59AB9B] mb-4 border-b pb-2">Información del cliente</h2>
                <div className="space-y-4">


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de cédula *</label>
                    <input
                      type="number"
                      name="cedulaTitular"
                      value={formData.cedulaTitular}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="Cédula"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo titular *</label>
                    <input
                      type="text"
                      name="nombreTitular"
                      value={formData.nombreTitular}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento titular *</label>
                    <input
                      type="date"
                      name="fechaNacimientoTitular"
                      value={formData.fechaNacimientoTitular}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="ejemplo@email.com"
                    />
                  </div>
                </div>
              </section>

              {/* Detalles de Facturación / Contacto */}
              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#59AB9B] mb-4 border-b pb-2">Detalles de facturación y contacto</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de residencia *</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="Dirección completa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barrio *</label>
                    <input
                      type="text"
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="Barrio"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Celular 1 *</label>
                      <input
                        type="tel"
                        name="telefono1"
                        value={formData.telefono1}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                        placeholder="300 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Celular 2</label>
                      <input
                        type="tel"
                        name="telefono2"
                        value={formData.telefono2}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Información del Ser Querido */}
              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#59AB9B] mb-4 border-b pb-2">Información del ser querido</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de cédula del ser querido *</label>
                    <input
                      type="text"
                      name="cedulaFallecido"
                      value={formData.cedulaFallecido}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="Cédula"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo del ser querido *</label>
                    <input
                      type="text"
                      name="nombreFallecido"
                      value={formData.nombreFallecido}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento del ser querido *</label>
                    <input
                      type="date"
                      name="fechaNacimientoFallecido"
                      value={formData.fechaNacimientoFallecido}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fallecimiento *</label>
                    <input
                      type="date"
                      name="fechaFallecimiento"
                      value={formData.fechaFallecimiento}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#59AB9B] focus:border-[#59AB9B]"
                    />
                  </div>
                </div>
              </section>

              {/* Documentación */}
              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#59AB9B] mb-4 border-b pb-2">Documentación requerida</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotocopia cédula titular (PDF/Imagen) *</label>
                    <input
                      type="file"
                      name="cedulaTitularFile"
                      onChange={handleFileChange}
                      required
                      accept="image/*,.pdf"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#59AB9B] file:text-white hover:file:bg-[#4a9688]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotocopia cédula del ser querido (PDF/Imagen) *</label>
                    <input
                      type="file"
                      name="cedulaSerQueridoFile"
                      onChange={handleFileChange}
                      required
                      accept="image/*,.pdf"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#59AB9B] file:text-white hover:file:bg-[#4a9688]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registro civil de defunción (PDF/Imagen) *</label>
                    <input
                      type="file"
                      name="registroDefuncionFile"
                      onChange={handleFileChange}
                      required
                      accept="image/*,.pdf"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#59AB9B] file:text-white hover:file:bg-[#4a9688]"
                    />
                  </div>
                </div>
              </section>

              {/* Métodos de Pago */}
              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#59AB9B] mb-4 border-b pb-2">Método de pago</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded border-[#59AB9B] bg-teal-50">
                    <input
                      type="radio"
                      id="pse"
                      name="metodoPago"
                      value="PSE"
                      checked={formData.metodoPago === 'PSE'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#59AB9B] focus:ring-[#59AB9B]"
                    />
                    <label htmlFor="pse" className="font-medium text-gray-700 flex items-center">
                      <span className="mr-2">PSE (Pagos Seguros en Línea)</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded opacity-60">
                    <input
                      type="radio"
                      id="epayco"
                      name="metodoPago"
                      value="ePayco"
                      disabled
                      className="h-4 w-4 text-gray-400"
                    />
                    <label htmlFor="epayco" className="font-medium text-gray-500">ePayco (Próximamente)</label>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full bg-[#59AB9B] text-white font-bold py-4 rounded-lg shadow-lg hover:bg-[#4a9688] transition-colors text-lg uppercase tracking-wider ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'Enviando información...' : 'Realizar el pedido'}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-[#59AB9B] mb-6 border-b pb-2">Tu pedido</h2>

              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 py-4 border-b last:border-0 items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                      {item.selectedOptionName && (
                        <p className="text-xs text-gray-500 mt-1">Opción: {item.selectedOptionName}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500"> Cantidad: {item.quantity}</span>
                        <span className="font-bold text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#59AB9B] pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
