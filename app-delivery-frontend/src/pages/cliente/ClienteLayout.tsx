import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaClipboardList, FaBars } from 'react-icons/fa';
import { useCarrinho } from '../../context/CarrinhoContext';
import { clearUser, getUser } from '../../store/auth';
import styles from './ClienteLayout.module.css';

function useClickOutside(ref: React.RefObject<HTMLDivElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function ClienteLayout() {
  const { items } = useCarrinho();
  const navigate = useNavigate();
  const user = getUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsMenuOpen(false));

  const cartItemCount = items.reduce((total, item) => total + item.quantidade, 0);

  const handleLogout = () => {
    clearUser();
    navigate('/');
    window.location.reload();
  };

  const logoLinkDestination = user && !user.is_restaurante ? "/restaurantes" : "/";

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to={logoLinkDestination} className={styles.logo}>
            FlashFood
          </Link>
          <button
            className={styles.navToggle}
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Toggle navigation"
          >
            <FaBars />
          </button>
          <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
            {user && !user.is_restaurante ? (
              <>
                <Link to="/meus-pedidos" className={styles.navLink}>
                  <FaClipboardList />
                  <span>Meus Pedidos</span>
                </Link>
                <div className={styles.dropdownContainer} ref={dropdownRef}>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.navLink}>
                    <FaUser />
                    <span>{user.username}</span>
                  </button>
                  {isMenuOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link to="/minha-conta/perfil" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                        Meu Perfil
                      </Link>
                      <Link to="/minha-conta/enderecos" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                        Meus Endereços
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`${styles.dropdownItem} ${styles.logoutButton}`}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>
                  Entrar
                </Link>
                <Link to="/cadastro" className={`${styles.navLink} ${styles.ctaButton}`}>
                  Criar Conta
                </Link>
              </>
            )}
            <Link to="/carrinho" className={`${styles.navLink} ${styles.cartLink}`}>
              <FaShoppingCart />
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
    </div>
  );
}