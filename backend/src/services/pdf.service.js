//* DEPENDENCIA PDF KIT: $ npm i pdfkit

"use strict";

//* PDFDocument: biblioteca para generar archivos pdf de forma programática
import PDFDocument from 'pdfkit';

//* fs: módulo de Node.js para interactuar con archivo y carpetas del sistema
import fs from 'fs';

//* path: módulo de Node.js para manejar rutas de archivos
import path from 'path';

import { AppDataSource } from '../config/configDb.js';
import User from '../entity/user.entity.js';

export async function PDFResidenceCertificate(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    //const user = await userRepository.findOneBy({ id: req.user.id });

    if (!user) return [null, "Usuario no encontrado."];

    const { firstName, lastName, rut, homeAddress } = user;

    // Obtener fecha actual formateada
    const date = new Date();
    const months = [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];
    const formattedDate = `Concepción, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;

    // Crear documento PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Configurar buffer
    const pdfBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Título
      doc.font('Times-Roman')
        .fontSize(16)
        .text('CERTIFICADO RESIDENCIA', { align: 'center', underline: true });

      doc.moveDown(2);

      // Cuerpo del certificado
      doc.fontSize(12).text(
        'La Junta de Vecinos “junta vecinal pro”, Rut 65.062.063-1, Personalidad Jurídica N°618. De la comuna de Concepción,'
      );

      doc.moveDown(1);

      doc.text('Certifica que:');
      doc.moveDown(1);

      doc.text(`Señor(a) ${firstName} ${lastName}, RUT ${rut}, mantiene domicilio vigente en ${homeAddress}, Villa putos, comuna de Concepción.`);

      doc.moveDown(1);
      doc.text(
        'Se extiende el presente certificado a solicitud del interesado(a), con el propósito de acreditar su domicilio, para los fines que estime convenientes.'
      );

      doc.moveDown(1);
      doc.text('La validez de este certificado es de tres meses a contar de la fecha de su emisión.');

      doc.moveDown(2);
      doc.text(formattedDate);

      doc.moveDown(4);

      // Firma (debes tener la imagen en /src/assets/firma.png)
      const firmaPath = path.resolve('src/assets/firma.png');
      if (fs.existsSync(firmaPath)) {
        doc.image(firmaPath, {
          fit: [150, 50],
          align: 'center'
        });
      } else {
        doc.text('_______________________\nFirma', { align: 'center' });
      }

      doc.end();
    });

    return [pdfBuffer, null];
  } catch (error) {
    console.error("Error en PDFResidenceCertificate:", error);
    return [null, "Error al generar el certificado"];
  }
}