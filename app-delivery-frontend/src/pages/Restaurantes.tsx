import { useEffect, useState } from "react";
import { listarRestaurantes } from "../services/restaurante";
import type { Restaurante } from "../services/restaurante"; 
import RestauranteCard from "../components/RestauranteCard";
import { Container, Row, Col } from "react-bootstrap";



export default function Restaurantes() {
  const [data, setData] = useState<Restaurante[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 2. Estado de loading explícito

  useEffect(() => {
    // 3. Usando async/await
    async function fetchData() {
      try {
        setLoading(true); // Garante que o loading seja exibido no início
        const restaurantes = await listarRestaurantes();
        setData(restaurantes);
      } catch (err: any) { // Tipagem do erro para melhor acesso
        setError(err?.response?.data?.message || "Erro ao listar restaurantes");
      } finally {
        setLoading(false); // 4. Garante que o loading termine, com ou sem erro
      }
    }

    fetchData();
  }, []); // O array vazio garante que a busca ocorra apenas uma vez

  // 5. Renderização baseada nos estados
  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <Container className="mt-4">
      <h2>Restaurantes Disponíveis</h2>

      {data.length > 0 ? (
        <Row className="g-4 mt-3">
          {data.map((r) => (
            <Col key={r.id_restaurante} xs={12} sm={6} md={4} lg={3}>
              <RestauranteCard restaurante={r} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>Nenhum restaurante encontrado no momento.</p>
      )}
    </Container>
  );
}