import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extraer datos textuales
    const rawData: any = {};
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        rawData[key] = value;
      }
    });

    // Añadir información del carrito (que viene como string JSON)
    const cartItems = JSON.parse(rawData.cart || '[]');

    // Extraer archivos para adjuntar
    const attachments = [];
    const fileKeys = ['cedulaTitularFile', 'cedulaFallecidoFile', 'registroDefuncionFile'];
    
    for (const key of fileKeys) {
      const file = formData.get(key) as File | null;
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buffer
        });
      }
    }
    // Configurar transporte de correo (SMTP)
    // NOTA: Reemplazar con credenciales reales o usar variables de entorno
    const transporter = nodemailer.createTransport({
      service: 'gmail', // O 'hotmail', o host personalizado
      auth: {
        user: process.env.EMAIL_USER, // Configurar en .env.local
        pass: process.env.EMAIL_PASS  // Configurar en .env.local (Contraseña de aplicación, NO la normal)
      }
    });

    // Construir el cuerpo del correo en HTML
    const htmlContent = `
      <h1>Nuevo Pedido Recibido</h1>
      <h2>Información del Titular</h2>
      <ul>
        <li><strong>Nombre:</strong> ${rawData.nombreTitular}</li>
        <li><strong>Cédula:</strong> ${rawData.cedulaTitular}</li>
        <li><strong>Fecha Nacimiento:</strong> ${rawData.fechaNacimientoTitular}</li>
        <li><strong>Email:</strong> ${rawData.email}</li>
        <li><strong>Teléfono 1:</strong> ${rawData.telefono1}</li>
        <li><strong>Teléfono 2:</strong> ${rawData.telefono2 || 'N/A'}</li>
        <li><strong>Dirección:</strong> ${rawData.direccion}</li>
        <li><strong>Barrio:</strong> ${rawData.barrio}</li>
      </ul>

      <h2>Información del Ser Querido</h2>
      <ul>
        <li><strong>Nombre:</strong> ${rawData.nombreFallecido}</li>
        <li><strong>Cédula:</strong> ${rawData.cedulaFallecido}</li>
        <li><strong>Fecha Nacimiento:</strong> ${rawData.fechaNacimientoFallecido}</li>
        <li><strong>Fecha Fallecimiento:</strong> ${rawData.fechaFallecimiento}</li>
      </ul>

      <h2>Detalle del Pedido</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Opción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${cartItems.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.selectedOptionName || '-'}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toLocaleString()}</td>
              <td>$${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3>Total a Pagar: $${Number(rawData.total).toLocaleString()}</h3>
      <p><strong>Método de Pago Seleccionado:</strong> ${rawData.metodoPago}</p>
    `;

    // 1. Correo al Administrador/Vendedor
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO_ADMIN, 
      subject: `Nuevo Pedido - Titular: ${rawData.nombreTitular}`,
      html: htmlContent,
      attachments: attachments
    });

    // 2. Correo de confirmación al Cliente
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: rawData.email,
      subject: 'Confirmación de Pedido - Parque Cementerio',
      html: `
        <p>Hola ${rawData.nombreTitular},</p>
        <p>Hemos recibido tu solicitud de pedido. A continuación encontrarás los detalles que registraste.</p>
        <p>Un asesor validará la información y documentación adjunta.</p>
        <hr>
        ${htmlContent}
      `
    });

    return NextResponse.json({ success: true, message: 'Correos enviados correctamente' });

  } catch (error) {
    console.error('Error enviando correos:', error);
    return NextResponse.json({ success: false, message: 'Error al enviar correos' }, { status: 500 });
  }
}
