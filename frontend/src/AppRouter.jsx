import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";

import HomeRedirect from "./HomeRedirect";
import HomeAdmin from "./pages/HomeAdmin";
import HomeUsuario from "./pages/HomeUsuario";

import Foro from "./pages/Foro";

import Profile from "./pages/Profile";
import EditUser from "./pages/EditUser";
import Users from "./pages/Users";

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta raíz: redirige según rol */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirección según rol */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        }
      />

      {/* Home administrador */}
      <Route
        path="/home/admin"
        element={
          <ProtectedRoute allowedRoles={["administrator"]}>
            <HomeAdmin />
          </ProtectedRoute>
        }
      />

      {/* Home usuario */}
      <Route
        path="/home/usuario"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <HomeUsuario />
          </ProtectedRoute>
        }
      />

      {/* Foro para todos los usuarios registrados */}
      <Route
        path="/foro"
        element={
          <ProtectedRoute allowedRoles={["user", "administrator"]}>
            <Foro />
          </ProtectedRoute>
        }
      />

      {/* Perfil */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Editar usuario */}
      <Route
        path="/edit-user/:rut"
        element={
          <ProtectedRoute allowedRoles={["administrator"]}>
            <EditUser />
          </ProtectedRoute>
        }
      />

      {/* Usuarios */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["administrator"]}>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/votaciones" 
        element={
          <ProtectedRoute>
            <Votacion />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/votacion/:id" 
        element={
          <ProtectedRoute>
            <Voto />
          </ProtectedRoute>
        }
      />

      {/* Error 404 */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRouter;
