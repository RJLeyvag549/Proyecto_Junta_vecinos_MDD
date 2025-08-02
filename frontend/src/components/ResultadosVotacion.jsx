/*import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const ResultadosVotacion = ({ idVotacion }) => {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/votos/${idVotacion}`);
        const datos = res.data.resultados.map(r => ({
          opcion: r.opcion,
          cantidad: parseInt(r.cantidad)
        }));
        setResultados(datos);
      } catch (error) {
        console.error("Error al obtener resultados:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchResultados();
  }, [idVotacion]);

  if (cargando) return <p>Cargando resultados...</p>;
  if (resultados.length === 0) return <p>No hay votos aún.</p>;

  return (
    <div className="mt-3">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={resultados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="opcion" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultadosVotacion;
*/