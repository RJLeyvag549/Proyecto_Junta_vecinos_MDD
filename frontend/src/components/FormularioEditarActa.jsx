import { useState, useEffect } from "react";
import "../styles/meeting.css";

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
    <div className="modal-overlay">
      <div className="modal-acta">
        <h2 className="asistencia-titulo">Editar Acta</h2>
        <form onSubmit={handleSubmit} className="form-acta">
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

          <div className="form-acta-buttons">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" onClick={onCancelar} className="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEditarActa;
