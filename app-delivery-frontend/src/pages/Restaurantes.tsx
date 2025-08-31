import { useEffect, useState } from "react";
import { listarRestaurantes } from "../services/restaurante";
import type { Restaurante } from "../services/restaurante"; // <- tipo
import { Link } from "react-router-dom";

export default function Restaurantes() {
  const [data, setData] = useState<Restaurante[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarRestaurantes().then(setData).catch(err => {
      setError(err?.response?.data?.message || "Erro ao listar restaurantes");
    });
  }, []);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!data.length) return <p style={{ padding: 24 }}>Carregando...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 16 }}>
      <h2>Restaurantes</h2>
      <ul>
        {data.map(r => (
          <li key={r.id_restaurante} style={{ marginBottom: 8 }}>
            <Link to={`/restaurantes/${r.id_restaurante}`}>{r.nome}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
