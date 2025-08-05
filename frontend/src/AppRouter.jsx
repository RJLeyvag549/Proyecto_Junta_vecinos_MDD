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
import UserList from "./pages/UserList"; 
import Requests from "./pages/Requests";
import ResidenceCertificate from "./pages/ResidenceCertificate"

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta raíz: redirige según rol */}
      <Route
        path='/'
        element={<HomeRedirect />}
      />
      {/* Rutas públicas */}
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/register'
        element={<Register />}
      />
      {/* Redirección según rol */}
      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        }
      />
      {/* Home administrador */}
      <Route
        path='/home/admin'
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <HomeAdmin />
          </ProtectedRoute>
        }
      />
      {/* Home usuario */}
      <Route
        path='/home/usuario'
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <HomeUsuario />
          </ProtectedRoute>
        }
      />
      {/* Foro para todos los usuarios registrados */}
      <Route
        path='/foro'
        element={
          <ProtectedRoute allowedRoles={['user', 'administrator']}>
            <Foro />
          </ProtectedRoute>
        }
      />
      {/* Perfil */}
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* Lista de usuarios admin */}
      <Route
        path='/user-list'
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <UserList />
          </ProtectedRoute>
        }
      />
      {/* solicitudes pendientes */}
      <Route
        path='/requests'
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <Requests />
          </ProtectedRoute>
        }
      />
      {/* certificado residencia */}
      <Route
        path='/certificate'
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <ResidenceCertificate />
          </ProtectedRoute>
        }
      />
      ;{/* Error 404 */}
      <Route
        path='*'
        element={<Error404 />}
      />
    </Routes>
  );
};



export default AppRouter;
