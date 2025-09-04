import { Link } from "react-router-dom";
import { getUser, clearUser } from "../store/auth";
import { useState } from "react";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import styles from "./Home.module.css";

export default function Home() {
  const [user, setUser] = useState(getUser());

  const handleLogout = () => {
    clearUser();
    setUser(null);
  };

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.overlay} />

        <Navbar 
          expand="lg" 
          data-bs-theme="dark" 
          className={styles.floatingNavbar}
        >
          <Container>
            <Navbar.Brand as={Link} to="/">DeliveryApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {user ? (
                  <>
                    <Nav.Item className="me-3 d-flex align-items-center">
                      Olá, {user.username}
                    </Nav.Item>
                    <Button variant="outline-light" size="sm" onClick={handleLogout}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/cadastro">Cadastro Cliente</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
      
      {/* ====== LAYOUT DO HERO: ESQUERDA (PAINEL) | DIREITA (CONTEÚDO) ====== */}
        <div className={styles.heroGrid}>
          <aside className={styles.leftPanel} />
          <div className={styles.rightContent}>
            <h1 className={styles.title}>Pedir comida<br/>nunca foi tão fácil</h1>
            {/*<p className={styles.subtitle}>Descubra restaurantes perto de você</p>

            <form className={styles.search}>
              <div className={styles.select}>
                <input type="text" placeholder="Bairro ou cidade" />
                <span className={styles.chevron}>▾</span>
              </div>
              <button type="button" className={styles.primaryBtn}>buscar restaurante</button>
            </form>*/}

            <p className={styles.partner}>
              Possui um restaurante?{" "}
              <Link to="/cadastro-restaurante" className={styles.partnerLink}>
                Venha para o DeliveryApp
              </Link>
            </p>
          </div>
        </div>
        
      </section>
      
    </>
  );
}