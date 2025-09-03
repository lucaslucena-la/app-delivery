import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react"; // Importar useState
import styles from './PainelLayout.module.css';

// import { FaBars, FaTachometerAlt, FaShoppingCart, FaUtensils, FaCog } from 'react-icons/fa';

export default function PainelLayout() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar a expansão

  // Função para verificar se o link está ativo
  const isLinkActive = (path: string) => location.pathname === path;

  // Handler para passar o mouse sobre o sidebar
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  // Handler para tirar o mouse do sidebar
  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Handler para clique no botão de toggle (opcional, se quiser um clique também)
  const handleToggleClick = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className={styles.layout}>
      {/* Adicionar onMouseEnter e onMouseLeave ao aside */}
      <aside 
        className={`${styles.sidebar} ${isExpanded ? styles.sidebarExpanded : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Botão de toggle para controle por clique (opcional) */}
        <button className={styles.menuToggle} onClick={handleToggleClick}>
          ☰ {/* Ícone de menu (pode ser substituído por <FaBars />) */}
        </button>

        {/* O título agora tem estilização condicional via CSS */
          isExpanded && <h2>Painel do Parceiro</h2>
        }

        <nav>
          <Link 
            to="/painel/dashboard" 
            className={`${styles.navLink} ${isLinkActive('/painel/dashboard') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>📊</span> {/* Ícone */}
            <span className={styles.navLinkText}>Visão Geral</span>
          </Link>

          <Link 
            to="/painel/pedidos" 
            className={`${styles.navLink} ${isLinkActive('/painel/pedidos') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🛒</span> {/* Ícone */}
            <span className={styles.navLinkText}>Gerenciar Pedidos</span>
          </Link>

          <Link 
            to="/painel/cardapio" 
            className={`${styles.navLink} ${isLinkActive('/painel/cardapio') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🍽️</span> {/* Ícone */}
            <span className={styles.navLinkText}>Gerenciar Cardápio</span>
          </Link>

          <Link 
            to="/painel/configuracoes" 
            className={`${styles.navLink} ${isLinkActive('/painel/configuracoes') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>⚙️</span> {/* Ícone */}
            <span className={styles.navLinkText}>Configurações</span>
          </Link>
          
          {/* TODO: Adicionar links para Avaliações e Financeiro */}
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}