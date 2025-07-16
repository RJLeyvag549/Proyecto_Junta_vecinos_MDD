import path from "path";
import { AppDataSource } from "../config/configDb.js";
import jwt from "jsonwebtoken";
import User from "../entity/user.entity.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { HOST, PORT, SESSION_SECRET } from "../config/configEnv.js";
import { createUserService } from "../services/user.service.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO
export async function register(req, res) {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const userRepository = AppDataSource.getRepository(User);    

		//* Extraer datos del body
    const { firstName, lastName, rut, email, password, contact, homeAddress } = req.body;

    const docIdentityFile = req.files?.docIdentity?.[0];
    const docResidenceFile = req.files?.docResidence?.[0];

		if (!firstName || !lastName || !rut || !email || !password || !contact || !homeAddress || !docIdentityFile || !docResidenceFile) {
      return res.status(400).json({ message: "Faltan campos obligatorios o documentos :V" });
    }

		//* Validación para ver si está duplicado el email o rut
    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) return res.status(409).json({ message: "Correo ya registrado" });

    const existingRut = await userRepository.findOne({ where: { rut } });
    if (existingRut) return res.status(409).json({ message: "RUT ya registrado" });

		//* Esto es para construir las URL de los documentos 
    const baseUrl = `http://${HOST}:${PORT}/api/src/upload/`;  //* Ruta base
    const docIdentityUrl = baseUrl + path.basename(docIdentityFile.path);
    const docResidenceUrl = baseUrl + path.basename(docResidenceFile.path);

    const [newUser, error] = await createUserService({
      firstName,
      lastName,
      rut,
      email,
      password,
      contact,
      homeAddress,
      docIdentity: docIdentityUrl,
      docResidence: docResidenceUrl,
    });

    if (error) return res.status(500).json({ message: error });

			//devuelve como respuesta un objeto pero sin la contraseña
			const { password: _, ...safeUser } = newUser;

			return res.status(201).json({
      message: "Solicitud de registro enviada con éxito. En espera de aprobación!",
      user: safeUser
    });

    } catch (error) {
		console.error("Error en auth.controller.js -> register():", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA INICIAR SESIÓN
export async function login(req, res) {
  try {
    // Obtener el repositorio de usuarios y validar los datos de entrada
    const userRepository = AppDataSource.getRepository(User);
    //* Extrae email y contraseña del body
    const { email, password } = req.body;
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    //* busca al usuario en la DB por email
    const userFound = await userRepository.findOne({ where: { email } });
    if (!userFound)
      return res.status(404).json({ message: "El correo electrónico no está registrado" });

    //* Compara la contraseña ingresada con la almacenada en la DB (encriptada)
    const isMatch = await comparePassword(password, userFound.password);
    if (!isMatch)
      return res.status(401).json({ message: "La contraseña ingresada no es correcta" });

    //* Crea un token JWT con los datos del usuario
    const payload = {
      id: userFound.id,
     // username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    };
    const accessToken = jwt.sign(payload, SESSION_SECRET, { expiresIn: "1d" });

    //* Envía token como respuesta
    res.status(200).json({ message: "Inicio de sesión exitoso", accessToken });

    res.status(200).json({ 
      message: "Inicio de sesión exitoso", accessToken });

  } catch (error) {
    console.error("Error en auth.controller.js -> login(): ", error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN PARA CERRAR SESIÓN
export async function logout(req, res) {
  // Eliminar la cookie de sesión del cliente
  try {
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* FUNCIÓN QUE OBTIENE EL PERFIL DEL USUARIO AUTENTICADO 
export async function getProfile(req, res) {
  try {
    // Obtener el repositorio de usuarios y buscar el perfil del usuario autenticado
    const userRepository = AppDataSource.getRepository(User);
    const userEmail = req.user.email;
    const user = await userRepository.findOne({ where: { email: userEmail } });
    
    // Si no se encuentra el usuario, devolver un error 404
    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    // Formatear la respuesta excluyendo la contraseña
    const formattedUser = {
      id: user.id,
      username: user.firstName + " " + user.lastName,
      email: user.email,
      rut: user.rut,
      role: user.role
    };

    res.status(200).json({ message: "Perfil encontrado: ", data: formattedUser });
  } catch (error) {
    console.error("Error en user.controller -> getProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}
