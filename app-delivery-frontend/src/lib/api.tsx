// 📌 Define a URL base da API
// Primeiro tenta pegar do .env (VITE_API_BASE), 
// se não encontrar usa http://localhost:3001 por padrão.
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

// 📌 Define um tipo personalizado para as opções do fetch.
// Ele estende o tipo padrão RequestInit e adiciona a chave opcional "json".
type FetchOptions = RequestInit & { json?: any };

// 📌 Função utilitária para fazer requisições à API
// - path: caminho relativo (ex.: "/login/login")
// - options: configurações da requisição (método, headers, body, etc.)
export async function apiFetch<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
    // Monta a URL completa (base + path)
    const url = `${API_BASE}${path}`;

    // Define os headers padrão (JSON), mesclando com qualquer header extra passado
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    // Executa a requisição com fetch
    const res = await fetch(url, {
        ...options,                       // espalha todas as opções passadas
        headers,                          // garante os headers definidos acima
        body: options.json ? JSON.stringify(options.json) : options.body,
        // se options.json existir → converte em string JSON
        // senão usa options.body normal (ex.: FormData)
        credentials: "include", // permite enviar cookies/credenciais (preciso pq seu CORS = true)
    });

    // 📌 Processa a resposta da API
    let data: any = null;
    const text = await res.text(); // lê como texto primeiro
    try { 
        // tenta converter em JSON
        data = text ? JSON.parse(text) : null; 
    } catch { 
        // se falhar, mantém como texto simples
        data = text; 
    }

    // 📌 Tratamento de erro: se a resposta não for ok (status 200–299)
    if (!res.ok) {
        const msg = (data && data.message) || `Erro HTTP ${res.status}`;
        throw new Error(msg); // lança um erro que pode ser capturado no frontend
    }

    // 📌 Retorna os dados tipados (T genérico)
    return data as T;
}

// Exporta a constante API_BASE caso precise usar em outro lugar
export { API_BASE };
