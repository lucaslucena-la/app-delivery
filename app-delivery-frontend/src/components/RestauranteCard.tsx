import { Link } from "react-router-dom";
// Importamos o 'type' para que o componente saiba a "forma" dos dados que vai receber
import type { Restaurante } from "../services/restaurante";

// Definimos as propriedades (props) que o componente espera receber.
// Neste caso, ele espera um objeto chamado 'restaurante' do tipo 'Restaurante'.
type Props = {
  restaurante: Restaurante;
};

// Este componente tem uma única responsabilidade: exibir os dados de um restaurante.
export default function RestauranteCard({ restaurante }: Props) {
  return (
    // Usamos 'li' para manter a semântica de lista, mas estilizamos para parecer um card.
    <li style={{
      border: '1px solid #ddd',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '12px',
      listStyle: 'none', // Remove o ponto da lista
      transition: 'box-shadow 0.2s', // Efeito suave ao passar o mouse
    }}
    // Efeito de sombra ao passar o mouse por cima
    onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
    onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <Link 
        to={`/restaurantes/${restaurante.id_restaurante}`} 
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>{restaurante.nome}</h3>
        {/* Adicionamos o endereço para deixar o card mais informativo */}
        <p style={{ margin: '8px 0 0', color: '#555' }}>
          {restaurante.endereco}
        </p>
      </Link>
    </li>
  );
}

