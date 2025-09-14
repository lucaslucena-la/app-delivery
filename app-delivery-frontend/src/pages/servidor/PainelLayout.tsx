import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./PainelLayout.module.css";
import { clearUser } from "../../store/auth"; // Importa a função de logout

import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  Menu,
  LogOut, // 1. Importa o ícone de Sair
} from "lucide-react";

export default function PainelLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // 2. Hook para navegação

  function handleLogout() {
    clearUser();    
    navigate("/");  
    window.location.reload(); 

  }

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${isExpanded ? styles.sidebarExpanded : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div> {/* Agrupador para a parte superior */}
          <button
            className={styles.menuToggle}
            onClick={() => setIsExpanded((v) => !v)}
            aria-label="Alternar menu"
          >
            <Menu size={18} />
          </button>
          
          {isExpanded && <h2 className={styles.brand}>Painel do Parceiro</h2>}

          <nav className={styles.nav}>
            <NavLink
              to="/painel/dashboard"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              title={!isExpanded ? "Visão Geral" : undefined}
            >
              <LayoutDashboard size={20} className={styles.navIcon} />
              <span className={styles.navLinkText}>Visão Geral</span>
            </NavLink>

            <NavLink
              to="/painel/pedidos"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              title={!isExpanded ? "Gerenciar Pedidos" : undefined}
            >
              <ClipboardList size={20} className={styles.navIcon} />
              <span className={styles.navLinkText}>Gerenciar Pedidos</span>
            </NavLink>

            <NavLink
              to="/painel/cardapio"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              title={!isExpanded ? "Gerenciar Cardápio" : undefined}
            >
              <UtensilsCrossed size={20} className={styles.navIcon} />
              <span className={styles.navLinkText}>Gerenciar Cardápio</span>
            </NavLink>

            <NavLink
              to="/painel/configuracoes"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              title={!isExpanded ? "Configurações" : undefined}
            >
              <Settings size={20} className={styles.navIcon} />
              <span className={styles.navLinkText}>Configurações</span>
            </NavLink>
          </nav>
        </div>
        
        <button 
          onClick={handleLogout} 
          className={`${styles.navLink} ${styles.logoutButton}`}
          title={!isExpanded ? "Sair" : undefined}
        >
          <LogOut size={20} className={styles.navIcon} />
          <span className={styles.navLinkText}>Sair</span>
        </button>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
