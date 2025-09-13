import React, { createContext, useState, useContext, type ReactNode } from 'react';
import type { Prato } from '../services/restaurante';

// Adicionamos o campo de observação
interface CartItem {
  prato: Prato;
  quantidade: number;
  observacao?: string; 
}

// Adicionamos a nova função para atualizar a observação
interface CarrinhoContextData {
  items: CartItem[];
  total: number;
  addToCart: (prato: Prato) => void;
  updateQuantity: (id_prato: number, quantidade: number) => void;
  updateObservacao: (id_prato: number, observacao: string) => void;
  removeFromCart: (id_prato: number) => void;
  clearCart: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (prato: Prato) => {
    setItems(currentItems => {
      const itemExists = currentItems.find(item => item.prato.id_prato === prato.id_prato);
      if (itemExists) {
        return currentItems.map(item =>
          item.prato.id_prato === prato.id_prato
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...currentItems, { prato, quantidade: 1, observacao: '' }]; // Inicia com observação vazia
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

  // Função para atualizar a observação de um item
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
    <CarrinhoContext.Provider value={{ items, total, addToCart, updateQuantity, updateObservacao, removeFromCart, clearCart }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  return context;
}

