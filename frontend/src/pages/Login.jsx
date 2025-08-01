import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service.js';
import Form from '../components/Formulario.jsx';
import LoginIcon from "../components/LoginIcon.jsx";

const Login = () => {
    const navigate = useNavigate();

    const loginSubmit = async (data) => {
        try {
            await login(data);
            navigate('/home');
        } catch (error) {
            const mensaje = error?.response?.data?.message || error.message || '';

            if (
                mensaje.toLowerCase().includes('credenciales') ||
                mensaje.toLowerCase().includes('contraseña') ||
                mensaje.toLowerCase().includes('email') ||
                error?.response?.status === 401
            ) {
                alert(mensaje); // Muestra el mensaje real del backend
            } else {
                alert('Error del servidor. Intenta más tarde.');
            }
        }
    };



    return (
        <main className="container">
            <LoginIcon />
            <Form
             title={
    <h1>
      JUNTA VECINAL<br />
      PARQUE ECUADOR
    </h1>
  }
                
                fields={[
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.com",
                        type: "email",
                        required: true,
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        type: "password",
                        required: true,
                    },
                ]}
                buttonText="Iniciar sesión"
                onSubmit={loginSubmit}
                footerContent={
                    <p>
                        ¿No tienes cuenta?, <a href="/register">Regístrate aquí!</a>
                    </p>
                }
            />
        </main>
    );
};

export default Login;
