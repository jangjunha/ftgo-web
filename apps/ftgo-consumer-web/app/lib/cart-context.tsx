import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ 
  children, 
  restaurantId 
}: { 
  children: React.ReactNode;
  restaurantId: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  const getStorageKey = (userId: string, restId: string) => {
    return `ftgo_cart_${userId}_${restId}`;
  };

  const loadCartFromStorage = (userId: string, restId: string) => {
    const storageKey = getStorageKey(userId, restId);
    const storedCart = localStorage.getItem(storageKey);
    if (storedCart) {
      try {
        return JSON.parse(storedCart) as CartItem[];
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
    return [];
  };

  const saveCartToStorage = (userId: string, restId: string, cartItems: CartItem[]) => {
    const storageKey = getStorageKey(userId, restId);
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  };

  const clearCartFromStorage = (userId: string, restId: string) => {
    const storageKey = getStorageKey(userId, restId);
    localStorage.removeItem(storageKey);
  };

  const clearAllCartsFromStorage = (userId: string) => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`ftgo_cart_${userId}_`)) {
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoaded(true);
      return;
    }

    const savedItems = loadCartFromStorage(user.consumerId, restaurantId);
    setItems(savedItems);
    setIsLoaded(true);
  }, [user, restaurantId]);

  useEffect(() => {
    if (user && isLoaded) {
      saveCartToStorage(user.consumerId, restaurantId, items);
    }
  }, [items, user, restaurantId, isLoaded]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    if (!user) return;

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuItemId === newItem.menuItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.menuItemId === newItem.menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    if (!user) return;
    
    setItems(prevItems => prevItems.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (!user) return;
    
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    if (!user) return;
    
    setItems([]);
    clearCartFromStorage(user.consumerId, restaurantId);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoaded(false);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}