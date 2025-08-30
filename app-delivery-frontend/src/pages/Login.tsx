import { useState } from "react";
import { apiFetch } from "../lib/api"; // função utilitária para chamadas à API
import { useNavigate } from "react-router-dom"; // hook para redirecionamento
import "./Login.css"; // importa o css

//Componente Login
export default function Login(){
    const navigate = useNavigate(); 

    // Estados para guardar os inputs do formulário
    const [username, setUsername] = useState("");   // campo usuário
    const [password, setPassword] = useState("");   // campo senha

    // Estado para controle visual
    const [loading, setLoading] = useState(false);  // mostra "Entrando..."
    const [error, setError] = useState<string | null>(null); // mensagem de erro

    //Função chamada ao enviar o formulário
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();        // previne reload da página
        setLoading(true);          // ativa estado de carregamento
        setError(null);            // limpa erro anterior

        try {
            // Chamada para o backend (rota POST /login/login)
            const data = await apiFetch<{
                message: string;
                user: { id: number; username: string; is_restaurante: boolean }
            }>(
                "/login/login", // endpoint
                {
                    method: "POST",
                    json: { username, password }, // body da requisição
                }
            );

            //Se o login for bem-sucedido:
            // Guarda o usuário no localStorage (simples; em app real seria JWT)
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redireciona para a Home
            navigate("/"); 
        } catch (err: any) {
            //Se a API retornar erro (401 ou 500, por exemplo)
            setError(err.message || "Erro ao Fazer Login");
        } finally {
            setLoading(false); // encerra estado de carregamento
        }
    }

    // JSX do formulário de login
    return (
        <div className="login-container">
            <form className="login-form"
              onSubmit={handleSubmit}
            >
                <h1>Login</h1>

                {/* Campo de usuário */}
                <label >
                    <span>Usuário</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Digite seu usuário"
                        required
                    />
                </label>

                {/* Campo de senha */}
                <label>
                    <span>Senha</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                    />
                </label>

                {/* Botão de envio */}
                <button type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                {/* Mensagem de erro, caso exista */}
                {error && <p style={{ color: "crimson" }}>{error}</p>}

                {/* Dica para testar com usuário do seed */}
                <p style={{ fontSize: 12, opacity: 0.75 }}>
                    Dica (seed): <code>username: ana789</code> &nbsp;
                    <code>password: senha789</code>
                </p>
            </form>
        </div>
    );
}
