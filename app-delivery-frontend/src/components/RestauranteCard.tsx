import { Link } from "react-router-dom";
import type { Restaurante } from "../services/restaurante";

import styles from "./RestauranteCard.module.css";


// Neste caso, ele espera um objeto chamado 'restaurante' do tipo 'Restaurante'.
type Props = {
  restaurante: Restaurante;
};

// Este componente tem uma única responsabilidade: exibir os dados de um restaurante.
export default function RestauranteCard({ restaurante }: Props) {
  return (

    <Link
          to={`/restaurantes/${restaurante.id_restaurante}`}
          className={styles.cardLink}
      >

      <h2 className={styles.title}>{restaurante.nome}</h2>
      <p className={styles.address}>{restaurante.endereco}</p>
    </Link>
  );
}

