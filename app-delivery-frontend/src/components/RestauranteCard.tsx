import { Link } from "react-router-dom";
import type { Restaurante } from "../services/restaurante";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

type Props = {
  restaurante: Restaurante;
};

export default function RestauranteCard({ restaurante }: Props) {
  return (
    <Link to={`/restaurantes/${restaurante.id_restaurante}`} style={{ textDecoration: "none" }}>
      <Card style={{ width: "18rem", cursor: "pointer" }} className="mb-3 shadow-sm">
      <Card.Img style={{ objectFit: "cover", height: "12rem" }} variant="top" src={`/images/card.png`} />
      <Card.Body>
        <Card.Title>{restaurante.nome}</Card.Title>
        <Card.Text>{restaurante.endereco}</Card.Text>
        <Button style={{ backgroundColor: "#060000ff", borderColor: "#0c0101ff" }}>Ver cardápio</Button>
      </Card.Body>
      </Card>
    </Link>
  );
}
