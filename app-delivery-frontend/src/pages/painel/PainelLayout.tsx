import { Link, Outlet, useLocation } from "react-router-dom";

// Estilos para o layout (pode ser movido para um .module.css depois)
const layoutStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh'
};

const sidebarStyle: React.CSSProperties = {
  width: '250px',
  backgroundColor: '#1f2937', // Um cinza escuro
  color: 'white',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const mainContentStyle: React.CSSProperties = {
  flex: 1,
  padding: '2rem',
  backgroundColor: '#f9fafb' // Fundo claro para o conteúdo
};

const navLinkStyle: React.CSSProperties = {
  color: '#d1d5db', // Cinza claro
  textDecoration: 'none',
  padding: '10px 15px',
  borderRadius: '8px',
  transition: 'background-color 0.2s, color 0.2s'
};

const activeLinkStyle: React.CSSProperties = {
  ...navLinkStyle,
  backgroundColor: '#4f46e5', // Cor primária para o link ativo
  color: 'white',
  fontWeight: 'bold'
};

export default function PainelLayout() {
  const location = useLocation();

  // Função para verificar se o link está ativo
  const isLinkActive = (path: string) => location.pathname === path;

  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Painel do Parceiro</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/painel/dashboard" style={isLinkActive('/painel/dashboard') ? activeLinkStyle : navLinkStyle}>Visão Geral</Link>
          <Link to="/painel/pedidos" style={isLinkActive('/painel/pedidos') ? activeLinkStyle : navLinkStyle}>Gerenciar Pedidos</Link>
          <Link to="/painel/cardapio" style={isLinkActive('/painel/cardapio') ? activeLinkStyle : navLinkStyle}>Gerenciar Cardápio</Link>
          <Link to="/painel/configuracoes" style={isLinkActive('/painel/configuracoes') ? activeLinkStyle : navLinkStyle}>Configurações</Link>
          {/* TODO: Adicionar links para Avaliações e Financeiro */}
        </nav>
      </aside>
      <main style={mainContentStyle}>
        {/* O Outlet renderiza o componente da rota filha (Dashboard, Pedidos, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}
