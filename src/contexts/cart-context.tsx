import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, isValidCartItemArray } from '../components/cart/types';

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (id: number, data: CartItem['data'], quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  isInCart: (id: number) => boolean;
  getItemQuantity: (id: number) => number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);

        if (isValidCartItemArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      //
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  const addToCart = (id: number, data: CartItem['data'], quantity = 1) => {
    setCartItems((prev) => {
      const existingCartItem = prev.find((cartItem) => cartItem.id === id);
      if (existingCartItem) {
        return prev.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { id, quantity, data }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity } : cartItem))
    );
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalQuantity = () => cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  const getTotalPrice = () => cartItems.reduce((sum, cartItem) => {
    const price = cartItem.data.price || 0;
    return sum + (price * cartItem.quantity);
  }, 0);

  const isInCart = (id: number) => cartItems.some((cartItem) => cartItem.id === id);

  const getItemQuantity = (id: number) => {
    const cartItem = cartItems.find((item) => item.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const cartCount = cartItems.length;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalQuantity,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
