import path from "path";
import { AppDataSource } from "../config/configDb.js";
import jwt from "jsonwebtoken";
import User from "../entity/user.entity.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { HOST, PORT, SESSION_SECRET } from "../config/configEnv.js";
import { createUserService } from "../services/user.service.js";
import { registerValidation, validateUploadedFiles, loginValidation} from "../validations/auth.validation.js";
import { groupErrorsByField } from "../helpers/errorFormatter.helper.js"
import { deleteUploadedFiles } from '../helpers/fileCleanup.helper.js';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO
export async function register(req, res) {
  try {
    
    const fileError = validateUploadedFiles(req.files);
    if (fileError) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({ message: fileError });
    }

    const { error } = registerValidation.validate(req.body, { abortEarly: false }); 
    if (error) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Hay errores en los datos enviados",
        errors: groupErrorsByField(error.details)
});
    }

    const userRepository = AppDataSource.getRepository(User);

    const { fullName, rut, email, password, contact, homeAddress } = req.body;

    const docIdentityFile = req.files?.docIdentity?.[0];
    const docResidenceFile = req.files?.docResidence?.[0];

    if (!fullName || !rut || !email || !password || !contact || !homeAddress || !docIdentityFile || !docResidenceFile) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({ message: "Faltan campos obligatorios o documentos" });
    }

    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) {
      deleteUploadedFiles(req.files);
      return res.status(409).json({ message: "Correo ya registrado" });
    }

    const existingRut = await userRepository.findOne({ where: { rut } });
    if (existingRut) {
      deleteUploadedFiles(req.files);
      return res.status(409).json({ message: "RUT ya registrado" });
    }

    const baseUrl = `http://${HOST}:${PORT}/api/src/upload/`;  
    const docIdentityUrl = baseUrl + path.basename(docIdentityFile.path);
    const docResidenceUrl = baseUrl + path.basename(docResidenceFile.path);

    const [newUser, creationError] = await createUserService({
      fullName,
      rut,
      email,
      password,
      contact,
      homeAddress,
      docIdentity: docIdentityUrl,
      docResidence: docResidenceUrl,
    });

    if (creationError) {
      deleteUploadedFiles(req.files);
      return res.status(500).json({ message: creationError });
    }

    const { password: _, ...safeUser } = newUser;

    return res.status(201).json({
      message: "Solicitud de registro enviada con éxito. En espera de aprobación!",
      user: safeUser
    });

  } catch (error) {
    console.error("Error en auth.controller.js -> register():", error);
    deleteUploadedFiles(req.files);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA INICIAR SESIÓN
export async function login(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body;

    const { error } = loginValidation.validate(req.body, { abortEarly: false });
    if (error) {
      const formattedErrors = groupErrorsByField(error.details);
      return res.status(400).json({
        message: 'Error al iniciar sesión',
        details: formattedErrors,
      });
    }

    const userFound = await userRepository.findOne({ where: { email } });

    if (!userFound) {
      return res.status(400).json({
        message: 'Error al iniciar sesión',
        details: {
          email: ['El correo electrónico debe ser válido.'],
        },
      });
    }

    if (userFound.requestStatus !== 'aprobado') {
      return res.status(403).json({
        message: 'Tu cuenta aún no ha sido aprobada por el administrador.',
      });
    }

    const isMatch = await comparePassword(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Error al iniciar sesión',
        details: {
          password: ['Contraseña inválida.'],
        },
      });
    }

    const payload = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };
    const accessToken = jwt.sign(payload, SESSION_SECRET, { expiresIn: '1d' });

    const { password: _, ...safeUser } = userFound;

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: accessToken,
      user: safeUser,
    });
  } catch (error) {
    console.error('Error en auth.controller.js -> login(): ', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN QUE OBTIENE USUARIO AUTENTICADO
export async function getCurrentUser(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userEmail = req.user.email;
    const user = await userRepository.findOne({ where: { email: userEmail } });
    
    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    const formattedUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      rut: user.rut,
      role: user.role,
      homeAddress: user.homeAddress,
    };

    res.status(200).json({ message: "Perfil encontrado: ", data: formattedUser });
  } catch (error) {
    console.error("Error en user.controller -> getProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}





