import { useEffect, useState } from "react";
import useGetMeetings from "../hooks/meeting/useGetMeetings";
import useDeleteMeeting from "../hooks/meeting/useDeleteMeeting";
import useCreateMeeting from "../hooks/meeting/useCreateMeeting";
import useUpdateMeeting from "../hooks/meeting/useUpdateMeeting";
import FormularioCrearActa from "../components/FormularioCrearActa";
import useCreateAct from "../hooks/meeting/useCreateAct";
import SidebarAdmin from "../components/SidebarAdmin";
import TablaReuniones from "../components/TablaReuniones";
import ModalAsistencia from "../components/ModalAsistencia";
import useGetMeetingsWithActs from "../hooks/meeting/useGetMeetingsWithActs";
import "../styles/meeting.css";
import "../styles/SidebarAdmin.css";
import Navbar from "../components/Navbar.jsx";

const initialForm = {
  lugar: "",
  fecha: "",
  hora: "",
  modalidad: ""
};

function MeetingPage() {
  const { meetings, fetchMeetings } = useGetMeetings();
  const { createActa } = useCreateAct();
  const { deleteMeeting } = useDeleteMeeting();
  const { createMeeting } = useCreateMeeting();
  const { updateMeeting } = useUpdateMeeting();
  const { meetingsWithActs, fetchMeetingsWithActs } = useGetMeetingsWithActs();

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [showAsistenciaModal, setShowAsistenciaModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const [showCreateActaForm, setShowCreateActaForm] = useState(false);
  const [actaCreatingMeetingId, setActaCreatingMeetingId] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    fetchMeetingsWithActs();
  }, [fetchMeetingsWithActs]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setMensaje("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      if (editingId) {
        await updateMeeting(editingId, form);
        setMensaje("Reunión actualizada exitosamente");
      } else {
        await createMeeting(form);
        setMensaje("Reunión creada exitosamente");
      }
      resetForm();
      fetchMeetings();
    } catch (err) {
      setError("Error al guardar la reunión");
    }
  };

  const handleEditar = (reunion) => {
    setForm({
      lugar: reunion.lugar,
      fecha: reunion.fecha.split("T")[0],
      hora: reunion.hora?.slice(0, 5),
      modalidad: reunion.modalidad
    });
    setEditingId(reunion.id);
    setShowForm(true);
    setMensaje("");
    setError("");
  };

  const handleEliminar = async (id) => {
    setMensaje("");
    setError("");
    try {
      await deleteMeeting(id);
      setMensaje("Reunión eliminada exitosamente");
      fetchMeetings();
    } catch (err) {
      setError("Error al eliminar la reunión");
    }
  };

  const handleVerAsistencia = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setShowAsistenciaModal(true);
  };

  const openCreateActaForm = (reunion) => {
    setActaCreatingMeetingId(reunion.id);
    setShowCreateActaForm(true);
  };

  const closeCreateActaForm = () => {
    setShowCreateActaForm(false);
    setActaCreatingMeetingId(null);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <SidebarAdmin />
        <div className="page-content">
            <div className="reuniones-header">
              <h2 className="reuniones-title">Gestión de Reuniones</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="meeting-button meeting-create-btn"
                >
                  Crear Reunión
                </button>
              )}
            </div>

            {mensaje && <div className="mensaje-exito">{mensaje}</div>}
            {error && <div className="mensaje-error">{error}</div>}

            {showForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2 className="titulo-formulario-reunion">
                    {editingId ? "Editar Reunión" : "Crear Reunión"}
                  </h2>
                  <form className="formulario-reunion" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="lugar"
                      placeholder="Lugar"
                      value={form.lugar}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="date"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="time"
                      name="hora"
                      value={form.hora}
                      onChange={handleChange}
                      required
                    />
                    <select
                      name="modalidad"
                      value={form.modalidad}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione modalidad</option>
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                    </select>
                    <div className="botonera">
                      <button
                        className="btn-guardar"
                        type="submit"
                      >
                        {editingId ? "Actualizar" : "Crear"}
                      </button>
                      <button
                        className="btn-cancelar"
                        type="button"
                        onClick={resetForm}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <TablaReuniones
              reuniones={meetings}
              actas={meetingsWithActs}
              onEliminar={handleEliminar}
              onEditar={handleEditar}
              onAsistencia={handleVerAsistencia}
              onCrearActa={openCreateActaForm}
            />

            {showCreateActaForm && actaCreatingMeetingId !== null && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <FormularioCrearActa
                    meetingId={actaCreatingMeetingId}
                    onGuardar={async (nuevaActa) => {
                      try {
                        await createActa(actaCreatingMeetingId, nuevaActa);
                        alert("Acta creada exitosamente");
                        fetchMeetings();
                        closeCreateActaForm();
                      } catch (error) {
                        alert("Error al crear el acta");
                      }
                    }}
                    onCancelar={closeCreateActaForm}
                  />
                </div>
              </div>
            )}

            {showAsistenciaModal && selectedMeetingId !== null && (
              <ModalAsistencia
                meetingId={selectedMeetingId}
                isOpen={showAsistenciaModal}
                onClose={() => setShowAsistenciaModal(false)}
              />
            )}
        </div>
      </div>
    </div>
  );
}

export default MeetingPage;
