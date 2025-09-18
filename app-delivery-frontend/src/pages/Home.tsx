import { Link } from "react-router-dom";
import { getUser, clearUser } from "../store/auth";
import { useState } from "react";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";

export default function Home() {
  const [user, setUser] = useState(getUser());

  const handleLogout = () => {
    clearUser();
    setUser(null);
    window.location.reload(); // Força a atualização da página
  };

  // Configurações do carrossel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
  };

  // Lista de imagens para o carrossel (substitua pelos caminhos reais)
  const images = [
    { src: "../../public/images/Imagen (1).jpeg", alt: "Prato de comida 1" },
    { src: "../../public/images/Imagen (2).jpeg", alt: "Prato de comida 2" },
    { src: "../../public/images/Imagen (3).jpeg", alt: "Prato de comida 3" },
    { src: "../../public/images/Imagen (4).jpeg", alt: "Prato de comida 4" },
    { src: "../../public/images/Imagen (5).jpeg", alt: "Prato de comida 5" },
    
  ];

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
            <Navbar.Brand as={Link} to="/">FlashFood</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {user ? (
                  <>
                    <Nav.Item className="me-3 d-flex align-items-center">
                      Olá, {user.username}
                    </Nav.Item>
                    <Button variant="dark" size="sm" onClick={handleLogout}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/restaurantes">Restaurantes</Nav.Link>
                    <Nav.Link as={Link} to="/cadastro">Cadastro Cliente</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        {/* ====== LAYOUT DO HERO: ESQUERDA (PAINEL) | DIREITA (CONTEÚDO) ====== */}
        <div className={styles.heroGrid}>
          <aside className={styles.leftPanel}>
            <Slider {...sliderSettings}>
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={styles.carouselImage}
                  />
                </div>
              ))}
            </Slider>
          </aside>
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
                Venha para o FlashFood
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}