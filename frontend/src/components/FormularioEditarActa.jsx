import { useState, useEffect } from "react";
import "../styles/acta.css";

const FormularioEditarActa = ({ acta, onGuardar, onCancelar }) => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    if (acta) {
      setTitulo(acta.titulo);
      setContenido(acta.contenido);
    }
  }, [acta]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({ ...acta, titulo, contenido });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Acta</h2>
        <form onSubmit={handleSubmit} className="formulario-acta">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <label htmlFor="contenido">Contenido</label>
          <textarea
            id="contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />

          <div className="form-actions">
            <button type="submit" className="boton-guardar">Guardar</button>
            <button type="button" onClick={onCancelar} className="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarActa;
