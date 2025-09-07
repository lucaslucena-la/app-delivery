// Define um tipo para garantir que todos os objetos tenham o formato correto
export type Categoria = {
  id: number;
  slug: string; // O valor exato do seu ENUM
  nome: string; // Um nome mais amigável para exibição
};

// Exporta o array de categorias para ser usado em qualquer lugar do app
export const CATEGORIAS_PRATOS: Categoria[] = [
  { id: 1, slug: 'combos', nome: 'Combos' },
  { id: 2, slug: 'baratos', nome: 'Baratos' },
  { id: 3, slug: 'salgados', nome: 'Salgados' },
  { id: 4, slug: 'doces', nome: 'Doces' },
  { id: 5, slug: 'frios', nome: 'Frios' },
  { id: 6, slug: 'quentes', nome: 'Quentes' },
];