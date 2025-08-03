import { useNavigate } from "react-router-dom";
import "../styles/Error404.css";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <main className="error_404 test-border">

      <div className="overlay"></div>
      <div className="card">
        <h1>404</h1>
        <h3>~ Página no encontrada ~</h3>
        <h4>Lo sentimos, la página que estás buscando no existe :(</h4>
        <button className="volver-btn" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
};

export default Error404;
