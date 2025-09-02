import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../store/auth";

// Este componente verifica se o usuário é um restaurante
// Se for, renderiza o conteúdo (Outlet). Se não, redireciona para o login.
export default function ProtectedRoute() {
  const user = getUser();

  // A condição de proteção: o usuário deve existir E ser um restaurante.
  if (user && user.is_restaurante) {
    // Outlet é o espaço onde a página do painel será renderizada (ex: PainelLayout)
    return <Outlet />;
  }

  // Se não atender à condição, volta para a página de login
  return <Navigate to="/login" />;
}
