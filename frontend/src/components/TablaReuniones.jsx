import { useEffect, useRef } from "react";
import DataTable from "datatables.net";
import "../styles/meeting.css";

const TablaReuniones = ({ reuniones = [], actas = [], onEliminar, onEditar, onAsistencia, onCrearActa }) => {
  console.log("Reuniones:", reuniones);
  console.log("Actas:", actas);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const tableElement = tableRef.current;
    if (!tableElement) return;

    // Destruir DataTable anterior si existe
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    // Prepara los datos para la tabla
    const data = reuniones.map((reunion) => {
      const existeActa = actas.some(acta => acta.reunion.id === reunion.id);
      return [
        reunion.id,
        new Date(reunion.fecha).toLocaleDateString(),
        reunion.hora,
        reunion.lugar,
        reunion.modalidad,
        existeActa, // columna extra para saber si existe acta
        reunion // objeto reunion para usar en render
      ];
    });

    if (reuniones.length > 0) {
      dataTableRef.current = new DataTable(tableElement, {
        data,
        columns: [
          { title: "ID" },
          { title: "Fecha" },
          { title: "Hora" },
          { title: "Lugar" },
          { title: "Modalidad" },
          {
            title: "Acciones",
            orderable: false,
            searchable: false,
            render: function (data, type, row) {
              const id = row[0];
              const existeActa = row[5];
              // row[6] es el objeto reunion
              return `
                <div class="flex gap-2">
                  <button class="meeting-button meeting-edit-btn" data-id="${id}">Editar</button>
                  <button class="meeting-button meeting-delete-btn" data-id="${id}">Eliminar</button>
                  <button class="meeting-button meeting-asistencia-btn" data-id="${id}">Asistencia</button>
                  ${
                    !existeActa
                      ? `<button class="meeting-button meeting-acta-btn" data-id="${id}">Crear Acta</button>`
                      : `<span class="text-green-700 font-bold">Acta Creada</span>`
                  }
                </div>
              `;
            }
          }
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        },
        pageLength: 5,
        lengthChange: false,
        destroy: true,
      });
    }

    // Delegación de eventos para botones
    const handleClick = (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      const id = parseInt(btn.getAttribute("data-id"));
      if (!id) return;
      const reunion = reuniones.find((r) => r.id === id);
      if (!reunion) return;

      if (btn.classList.contains("meeting-asistencia-btn")) {
        onAsistencia(id);
      } else if (btn.classList.contains("meeting-edit-btn")) {
        onEditar(reunion);
      } else if (btn.classList.contains("meeting-delete-btn")) {
        if (window.confirm("¿Estás seguro de eliminar esta reunión?")) {
          onEliminar(id);
        }
      } else if (btn.classList.contains("meeting-acta-btn")) {
        onCrearActa(reunion);
      }
    };

    tableElement.addEventListener("click", handleClick);

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
      tableElement.removeEventListener("click", handleClick);
    };
  }, [reuniones, actas, onAsistencia, onEditar, onEliminar, onCrearActa]);

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="display w-full text-sm text-left"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Lugar</th>
              <th>Modalidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Deja vacío, DataTable lo llenará */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaReuniones;
