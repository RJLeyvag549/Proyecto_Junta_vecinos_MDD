
import fs from 'fs';
import path from 'path';

export function deleteUploadedFiles(files) {
  if (!files) return;
  Object.values(files).flat().forEach(file => {
    fs.unlink(file.path, err => {
      if (err) console.error("Error al eliminar archivo:", file.path, err);
    });
  });
}
