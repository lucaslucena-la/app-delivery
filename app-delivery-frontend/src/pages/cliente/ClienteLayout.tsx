import { Link, Outlet } from 'react-router-dom';
import styles from './ClienteLayout.module.css';
// Ícones
import { FaShoppingCart, FaUser, FaClipboardList } from 'react-icons/fa'; 
// --- 1. Importa o hook do nosso contexto do carrinho ---
import { useCarrinho } from '../../context/CarrinhoContext.tsx';

export default function ClienteLayout() {
  // --- 2. Usa o hook para acessar os itens do carrinho ---
  const { items } = useCarrinho();

  // --- 3. Calcula a quantidade total de itens no carrinho ---
  // Usamos 'reduce' para somar a quantidade de cada item, não apenas contar os produtos diferentes.
  const cartItemCount = items.reduce((total, item) => total + item.quantidade, 0);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/restaurantes" className={styles.logo}>
            FlashFood
          </Link>
          <nav className={styles.nav}>
            <Link to="/meus-pedidos" className={styles.navLink}>
              <FaClipboardList />
              <span>Meus Pedidos</span>
            </Link>
            {/* O link para Minha Conta continua aqui, para quando a página for criada */}
            <Link to="/minha-conta" className={styles.navLink}>
              <FaUser />
              <span>Minha Conta</span>
            </Link>
            <Link to="/carrinho" className={`${styles.navLink} ${styles.cartLink}`}>
              <FaShoppingCart />
              {/* Agora, o contador é dinâmico e só aparece se houver itens */}
              {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}

