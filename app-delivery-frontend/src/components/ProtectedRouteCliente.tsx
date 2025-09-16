import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../store/auth.ts";

export default function ProtectedRouteCliente() {
  const user = getUser();

  // A condição é: o usuário existe E ele NÃO é um restaurante?
  const isCliente = user && !user.is_restaurante;

  // Se for um cliente, permite o acesso à página.
  // Se não, redireciona para a página de login.
  return isCliente ? <Outlet /> : <Navigate to="/login" />;
}

