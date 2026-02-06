# Documentación del Backend - Checkout y Correos

Este proyecto utiliza **Next.js API Routes** para manejar la lógica del servidor. El módulo de Checkout (`/api/checkout`) se encarga de recibir la orden de compra y enviar las notificaciones por correo electrónico.

## 1. Requisitos Previos
Para que el envío de correos funcione, se debe instalar la librería `nodemailer` en el servidor:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## 2. Configuración de Variables de Entorno
El sistema de correos **no funcionará** hasta que se configuren las credenciales en el archivo `.env.local` (o en las variables de entorno del servidor de producción como Vercel/AWS).

Agregue las siguientes variables:

```properties
# .env.local

# Correo desde el cual saldrán las notificaciones (ej: Gmail)
EMAIL_USER=tu_correo_corporativo@gmail.com

# Contraseña de Aplicación (NO es la contraseña normal de tu correo)
# Ver sección "Cómo obtener contraseña" abajo
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Dirección que aparecerá como remitente
EMAIL_FROM=tu_correo_corporativo@gmail.com

# Correo del ADMINISTRADOR/VENDEDOR que recibirá los pedidos completos con adjuntos
EMAIL_TO_ADMIN=ventas@parquecementerio.com
```

### 🔐 Cómo obtener la "Contraseña de Aplicación" (para Gmail)
Por seguridad, Google no permite usar tu contraseña normal. Debes generar una específica:
1. Ve a tu cuenta de Google > Seguridad.
2. Activa la "Verificación en 2 pasos".
3. Busca la opción **"Contraseñas de aplicaciones"**.
4. Crea una nueva (ponle de nombre "Sitio Web") y copia el código de 16 letras que te da. Esa es tu `EMAIL_PASS`.

## 3. Funcionamiento del Endpoint (`/api/checkout`)
El endpoint recibe una petición `POST` con `FormData`.

### Datos Recibidos:
- **Datos del Cliente:** `nombreTitular`, `cedulaTitular`, `email`, `direccion`, etc.
- **Datos del Fallecido:** `nombreFallecido`, `cedulaFallecido`, `fechas`, etc.
- **Carrito de Compras:** Un JSON string en el campo `cart`.
- **Archivos Adjuntos:**
  - `cedulaTitularFile` (Imagen/PDF)
  - `cedulaFallecidoFile` (Imagen/PDF)
  - `registroDefuncionFile` (Imagen/PDF)

### Flujo de Ejecución:
1. El backend recibe los archivos y los convierte a Buffer en memoria.
2. Se conecta al servidor SMTP (Gmail u otro configurado).
3. Envía **Correo 1 (Admin):** Con todos los datos + Los 3 archivos adjuntos.
4. Envía **Correo 2 (Cliente):** Solo confirmación de texto y resumen del pedido (sin adjuntos).
5. Retorna `success: true` al Frontend para que este redirija a la pasarela de pagos.

## 4. Personalización del Transporte (Opcional)
Actualmente está configurado para **Gmail**. Si usas un correo corporativo (ej: Outlook, Zoho, cPanel), edita el archivo `app/api/checkout/route.ts`:

```typescript
// app/api/checkout/route.ts
const transporter = nodemailer.createTransport({
  host: "mail.tuempresa.com", // Servidor SMTP de tu empresa
  port: 465, // o 587
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```
