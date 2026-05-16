import fs from 'fs';
import path from 'path';

/** 
 * Elimina un archivo físico de la carpeta uploads basado en su URL 
 * @param imageUrl URL completa de la imagen (ej: http://localhost:3000/uploads/foto.jpg)
 */
export const deleteLocalFile = (imageUrl: string | undefined | null): void => {
  if (!imageUrl || !imageUrl.includes('/uploads/')) return;

  try {
    const fileName = imageUrl.split('/uploads/')[1];
    if (fileName) {
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('[file.utils] Error al eliminar archivo:', error);
  }
};
