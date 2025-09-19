import { useEffect, useState } from "react";
import { listarRestaurantes } from "../services/restaurante";
import type { Restaurante } from "../services/restaurante"; 
import RestauranteCard from "../components/RestauranteCard";
import styles from "./Restaurantes.module.css"; 

export default function Restaurantes() {
  const [data, setData] = useState<Restaurante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const restaurantes = await listarRestaurantes();
        setData(restaurantes);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Erro ao listar restaurantes");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Restaurantes Disponíveis</h2>

      {data.length > 0 ? (
        <div className={styles.row}>
          {data.map((r) => (
            <div key={r.id_restaurante} className={styles.card}>
              <RestauranteCard restaurante={r} />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>Nenhum restaurante encontrado no momento.</p>
      )}
    </div>
  );
}