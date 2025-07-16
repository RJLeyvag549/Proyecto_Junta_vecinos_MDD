import multer from "multer";

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/upload/");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, fileName);
  },
});

// Filtro para aceptar solo PDF o imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF, JPG o PNG"), false);
  }
};

// Middleware de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB de límite de tamaño de archivo
  },
  fileFilter: fileFilter,
});

// Este middleware acepta múltiples campos
const uploadDocuments = upload.fields([
  { name: "docIdentity", maxCount: 1 },
  { name: "docResidence", maxCount: 1 },
]);

// Manejo de errores de límite de tamaño de archiv
const handleFileSizeLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "El archivo excede el límite de 5MB" });
  } else if (err) {
		// Manejar errores de validación de tipo de archivo
    return res.status(400).json({ message: err.message });
  }
  next();
};

export { uploadDocuments, handleFileSizeLimit };