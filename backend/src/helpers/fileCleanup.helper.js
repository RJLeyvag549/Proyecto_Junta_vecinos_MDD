//* ESTE ARCHIVO ELIMINA LOS DOCUMENTOS CÉDULA Y RESIDENCIA CUANDO HAY ERRORES EN LA SOLICITUD

import fs from 'fs';

export function deleteUploadedFiles(files) {
  if (!files) return;
  Object.values(files).flat().forEach(file => {
    fs.unlink(file.path, err => {
      if (err) console.error("Error al eliminar archivo:", file.path, err);
    });
  });
}
