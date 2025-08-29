import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // importa o css

// 📌 Componente Home
// Essa é a tela inicial que aparece depois do login bem-sucedido.
export default function Home() {
    // Hook do React Router para navegar programaticamente
    const navigate = useNavigate();

    // Estado para guardar o nome do usuário logado
    const [username, setUsername] = useState<string | null>(null);

    // 📌 useEffect roda assim que o componente monta
    // Verifica se existe um usuário salvo no localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user"); // tenta pegar usuário do localStorage
        if (userData) {
            // Se existir, faz parse do JSON e pega o username
            setUsername(JSON.parse(userData).username);
        } else {
            // Se não existir, redireciona para a página de login
            navigate("/login");
        }
    }, [navigate]); 
    // ⚠️ "navigate" entra no array de dependências para evitar warning do React

    //Botão de logout
    return (
        <div className="home-container">
            <h1>Bem-vindo{username ? ", " : ""}{username ?? ""}!</h1>
            <p>Frontend conectado ao backend 🚀</p>
            <button onClick={() => { 
                localStorage.removeItem("user"); // remove usuário salvo
                navigate("/login"); // redireciona para login
            }}>Sair
            </button>
        </div>
    );
}