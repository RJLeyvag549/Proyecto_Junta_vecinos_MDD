import { useEffect, useState } from "react";
import useGetMeetingsWithActs from "../hooks/meeting/useGetMeetingsWithActs";
import useCreateActa from "../hooks/meeting/useCreateAct";
import useUpdateActa from "../hooks/meeting/useUpdateAct";
import useSignActa from "../hooks/meeting/useSignAct";
import Navbar from "../components/Navbar";
import SidebarAdmin from "../components/SidebarAdmin";
import TablaActas from "../components/TablaActas";
import FormularioEditarActa from "../components/FormularioEditarActa";
import "../styles/acta.css";
import "../styles/meeting.css";
import '../styles/SidebarAdmin.css';

const initialForm = {
  titulo: "",
  contenido: "",
};

const ActPage = () => {
  const { meetingsWithActs, fetchMeetingsWithActs } = useGetMeetingsWithActs();
  const { createActa } = useCreateActa();
  const { updateActa } = useUpdateActa();
  const { signActa } = useSignActa();

  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [actaSeleccionada, setActaSeleccionada] = useState(null);

  useEffect(() => {
    fetchMeetingsWithActs();
  }, [fetchMeetingsWithActs]);

  const resetForm = () => {
    setForm(initialForm);
    setEditing(false);
    setShowForm(false);
    setSelectedMeetingId(null);
    setMensaje("");
    setError("");
  };

  const handleCrear = (meetingId) => {
    resetForm();
    setSelectedMeetingId(meetingId);
    setShowForm(true);
  };

  const handleEditar = (acta, meetingId) => {
    if (!acta) return;
    setForm({
      titulo: acta.titulo ?? "",
      contenido: acta.contenido ?? "",
    });
    setSelectedMeetingId(meetingId);
    setEditing(true);
    setShowForm(true);
  };

  const handleVer = (acta) => {
    if (!acta) return;
    setActaSeleccionada(acta);
    setShowViewModal(true);
  };

  const handleFirmar = async (meetingId) => {
    try {
      await signActa(meetingId);
      setMensaje("Acta firmada correctamente");
      fetchMeetingsWithActs();
    } catch (err) {
      setError("Error al firmar el acta");
    }
  };

  const handleGuardarActa = async (actaEditada) => {
    if (!selectedMeetingId) {
      setError("Debes seleccionar una reunión.");
      return;
    }

    try {
      if (editing) {
        await updateActa(selectedMeetingId, actaEditada);
        setMensaje("Acta actualizada exitosamente");
      } else {
        await createActa(selectedMeetingId, actaEditada);
        setMensaje("Acta creada exitosamente");
      }
      fetchMeetingsWithActs();
      resetForm();
    } catch (err) {
      setError("Error al guardar el acta");
    }
  };

  const actas = Array.isArray(meetingsWithActs)
    ? meetingsWithActs
        .filter((m) => m?.data?.id && m.reunion?.id)
        .map((m) => ({
          ...m.data,
          meetingId: m.reunion.id,
        }))
    : [];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <SidebarAdmin />
        <div className="page-content">
          <div className="reuniones-container">
            <div className="reuniones-header">
              <h2 className="reuniones-title">Gestión de Actas</h2>
            </div>

            {mensaje && <div className="mensaje-exito">{mensaje}</div>}
            {error && <div className="mensaje-error">{error}</div>}

            <TablaActas
              actas={actas}
              onCrear={handleCrear}
              onEditar={handleEditar}
              onVer={handleVer}
              onFirmar={handleFirmar}
            />

            {showForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <FormularioEditarActa
                    acta={form}
                    onGuardar={handleGuardarActa}
                    onCancelar={resetForm}
                  />
                </div>
              </div>
            )}

            {showViewModal && actaSeleccionada && (
              <div className="modal-overlay">
                <div className="modal-content acta-modal">
                  <div className="acta-modal-header">
                    <h2>Acta de la Junta Vecinal</h2>
                    <hr />
                    <h3>{actaSeleccionada.titulo}</h3>
                  </div>
                  <div className="acta-modal-body">
                    <p>{actaSeleccionada.contenido}</p>
                  </div>
                  <div className="acta-modal-firma">
                    <label>Firma de la Junta Vecinal:</label>
                    <div className="acta-firma-espacio">
                      {actaSeleccionada.firma && (
                        <img
                          src="/firma-ejemplo.png"
                          alt="Firma de la Junta Vecinal"
                          className="acta-firma-imagen"
                        />
                      )}
                    </div>
                  </div>
                  <button
                    className="meeting-button meeting-create-btn acta-modal-cerrar"
                    onClick={() => setShowViewModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActPage;