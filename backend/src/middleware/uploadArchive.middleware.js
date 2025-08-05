//* ESTE ARCHIVO ES PARA SUBIR LO DE CÉDULA Y RESIDENCIA EN REGISTER

import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/upload/');
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF, JPG o PNG'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const uploadDocuments = upload.fields([
  { name: 'docIdentity', maxCount: 1 },
  { name: 'docResidence', maxCount: 1 },
]);

const handleFileSizeLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: 'El archivo excede el límite de 5MB' });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

export { uploadDocuments, handleFileSizeLimit };
