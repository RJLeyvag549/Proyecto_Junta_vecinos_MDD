import { useEffect } from "react";
import useGetAttendance from "../hooks/meeting/useGetAttendanceByMeetingId";
import useToggleAttendance from "../hooks/meeting/useToggleAttendance";
import "../styles/meeting.css";

const ModalAsistencia = ({ meetingId, isOpen, onClose }) => {
  const { attendanceList, fetchAttendance } = useGetAttendance();
  const { toggleAttendance } = useToggleAttendance();

  useEffect(() => {
    if (isOpen) {
      fetchAttendance(meetingId);
    }
  }, [isOpen, meetingId, fetchAttendance]);

  const handleToggle = async (userId, currentFirma) => {
    try {
      await toggleAttendance(meetingId, userId, !currentFirma);
      fetchAttendance(meetingId);
    } catch (err) {
      console.error("❌ Error al actualizar asistencia:", err);
      alert("Hubo un error al actualizar la asistencia.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-asistencia">
        <h2 className="asistencia-titulo">Lista de Asistencia</h2>

        {attendanceList.length === 0 ? (
          <p>No hay usuarios registrados en esta reunión.</p>
        ) : (
          <table className="asistencia-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Firmó</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((item, index) => (
                <tr key={item.usuario.id}>
                  <td>{index + 1}</td>
                  <td>{item.usuario.fullName}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.firma}
                      onChange={() => handleToggle(item.usuario.id, item.firma)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={onClose}
          className="meeting-button meeting-create-btn mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalAsistencia;
