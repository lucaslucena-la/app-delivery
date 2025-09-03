
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";


type FetchOptions = RequestInit & { json?: any };


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
        ...options,                       
        headers,                          
        body: options.json ? JSON.stringify(options.json) : options.body,
        credentials: "include",
    });

    let data: any = null;
    const text = await res.text(); // lê como texto primeiro
    try { 
        // tenta converter em JSON
        data = text ? JSON.parse(text) : null; 
    } catch { 
        // se falhar, mantém como texto simples
        data = text; 
    }

    if (!res.ok) {
        const msg = (data && data.message) || `Erro HTTP ${res.status}`;
        throw new Error(msg); // lança um erro que pode ser capturado no frontend
    }

    return data as T;
}

// Exporta a constante API_BASE caso precise usar em outro lugar
export { API_BASE };
