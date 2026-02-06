import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const folder = data.get('folder') as string || 'uploads'; // 'categories' o 'products'

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear un nombre único para evitar colisiones
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    // Rutas
    const uploadDir = join(process.cwd(), 'public', 'images', folder);
    const filePath = join(uploadDir, filename);
    const publicUrl = `/images/${folder}/${filename}`;

    // Asegurar que la carpeta exista
    await mkdir(uploadDir, { recursive: true });

    // Escribir archivo en disco
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Error al subir el archivo' }, { status: 500 });
  }
}