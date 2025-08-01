import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";

import HomeRedirect from "./HomeRedirect";
import HomeAdmin from "./pages/HomeAdmin";
import HomeUsuario from "./pages/HomeUsuario";

import Profile from "./pages/Profile";
import EditUser from "./pages/EditUser";
import Users from "./pages/Users";
import FundingPage from "./pages/FundingPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirección por defecto al login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Ruta intermedia que redirige según el rol */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        }
      />

      {/* Rutas específicas según rol */}
      <Route
        path="/home/admin"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <HomeAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/usuario"
        element={
          <ProtectedRoute allowedRoles={['usuario']}>
            <HomeUsuario />
          </ProtectedRoute>
        }
      />

      {/* Otras rutas protegidas */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-user/:rut"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <EditUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/funding"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <FundingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planilla"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <FundingPage />
          </ProtectedRoute>
        }
      />

      {/* Página no encontrada */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRouter;
