import { Routes, Route, Navigate } from "react-router-dom";
import HomeRedirect from "./HomeRedirect";
import HomeAdmin from "./pages/HomeAdmin";
import HomeUsuario from "./pages/HomeUsuario";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
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

      {/* Rutas según el rol */}
      <Route
        path="/home/admin"
        element={
          <ProtectedRoute>
            <HomeAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home/usuario"
        element={
          <ProtectedRoute>
            <HomeUsuario />
          </ProtectedRoute>
        }
      />

      {/* Página no encontrada */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
