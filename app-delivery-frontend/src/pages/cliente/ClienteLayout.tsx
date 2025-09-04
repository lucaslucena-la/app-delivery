import { Link, Outlet } from 'react-router-dom';
import styles from './ClienteLayout.module.css';
// Ícones (ex: usando react-icons, instale com 'npm install react-icons')
import { FaShoppingCart, FaUser, FaClipboardList } from 'react-icons/fa'; 

export default function ClienteLayout() {
  // Lógica para pegar a quantidade de itens no carrinho (virá do Contexto depois)
  const cartItemCount = 0; 

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/restaurantes" className={styles.logo}>
            FoodDelivery
          </Link>
          <nav className={styles.nav}>
            <Link to="/meus-pedidos" className={styles.navLink}>
              <FaClipboardList />
              <span>Meus Pedidos</span>
            </Link>
            <Link to="/minha-conta" className={styles.navLink}>
              <FaUser />
              <span>Minha Conta</span>
            </Link>
            <Link to="/carrinho" className={`${styles.navLink} ${styles.cartLink}`}>
              <FaShoppingCart />
              {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* As páginas (Restaurantes, Cardapio, etc.) serão renderizadas aqui */}
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}