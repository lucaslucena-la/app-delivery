import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import type { Prato } from '../services/restaurante';

// A interface do item do carrinho não muda
interface CartItem {
  prato: Prato;
  quantidade: number;
  observacao?: string;
}

// --- ALTERADO: Adicionamos o ID do restaurante e a função de adicionar item ---
interface CarrinhoContextData {
  items: CartItem[];
  restauranteId: number | null; // Rastreia o ID do restaurante atual no carrinho
  total: number;
  adicionarItem: (prato: Prato) => void; // A função de adicionar foi renomeada para clareza
  updateQuantity: (id_prato: number, quantidade: number) => void;
  updateObservacao: (id_prato: number, observacao: string) => void;
  removeFromCart: (id_prato: number) => void;
  clearCart: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restauranteId, setRestauranteId] = useState<number | null>(null);

  // Efeito para atualizar o ID do restaurante se os itens mudarem
  useEffect(() => {
    if (items.length > 0) {
      setRestauranteId(items[0].prato.id_restaurante);
    } else {
      setRestauranteId(null);
    }
  }, [items]);

  const adicionarItem = (prato: Prato) => {
    setItems(currentItems => {
      const itemExists = currentItems.find(item => item.prato.id_prato === prato.id_prato);
      if (itemExists) {
        return currentItems.map(item =>
          item.prato.id_prato === prato.id_prato
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...currentItems, { prato, quantidade: 1, observacao: '' }];
    });
  };

  const updateQuantity = (id_prato: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(id_prato);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.prato.id_prato === id_prato ? { ...item, quantidade } : item
      )
    );
  };

  const updateObservacao = (id_prato: number, observacao: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.prato.id_prato === id_prato ? { ...item, observacao } : item
      )
    );
  };

  const removeFromCart = (id_prato: number) => {
    setItems(currentItems => currentItems.filter(item => item.prato.id_prato !== id_prato));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + item.prato.valor * item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{ items, restauranteId, total, adicionarItem, updateQuantity, updateObservacao, removeFromCart, clearCart }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  return context;
}

