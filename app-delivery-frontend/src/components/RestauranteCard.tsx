import { Link } from "react-router-dom";
import type { Restaurante } from "../services/restaurante.ts";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import StatusFuncionamento from "./StatusFuncionamento.tsx"; // 1. Importa o componente de status

type Props = {
  restaurante: Restaurante;
};

export default function RestauranteCard({ restaurante }: Props) {
  return (
    <Link to={`/restaurantes/${restaurante.id_restaurante}`} style={{ textDecoration: "none" }}>
      <Card style={{ width: "18rem", cursor: "pointer" }} className="mb-3 shadow-sm">
        <Card.Img style={{ objectFit: "cover", height: "12rem" }} variant="top" src={`/images/card.png`} />
        <Card.Body>
          {/* 2. Adiciona um container para o título e o status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Card.Title style={{ marginBottom: 0 }}>{restaurante.nome}</Card.Title>
            {/* 3. Renderiza o componente de status */}
            <StatusFuncionamento horarios={restaurante.horarios} />
          </div>
          <Card.Text>{restaurante.endereco}</Card.Text>
          <Button style={{ backgroundColor: "#060000ff", borderColor: "#0c0101ff" }}>Ver cardápio</Button>
        </Card.Body>
      </Card>
    </Link>
  );
}

