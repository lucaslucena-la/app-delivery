import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import styles from "./PainelLayout.module.css";

import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  Menu,
} from "lucide-react";

export default function PainelLayout() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${isExpanded ? styles.sidebarExpanded : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Toggle por clique (opcional) */}
        <button
          className={styles.menuToggle}
          onClick={() => setIsExpanded((v) => !v)}
          aria-label="Alternar menu"
        >
          <Menu size={18} />
        </button>

        {/* Título só aparece expandido */}
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
      </aside>

      {/* Conteúdo principal desloca conforme a largura atual do aside */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
