import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // <--- แยก import type ออกมาบรรทัดนี้ เพื่อแก้ Error

// กำหนดหน้าตาของข้อมูลสินค้าในตะกร้า
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  detail?: string; // ใส่เผื่อไว้ (Optional) กัน error หน้า Cart
}

// กำหนดหน้าตาของ Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ฟังก์ชันเพิ่มสินค้า
  const addToCart = (product: any, quantity: number) => {
    setCartItems(currItems => {
      const existingItem = currItems.find(item => item.id === product.id);
      if (existingItem) {
        return currItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...currItems, { ...product, quantity }];
    });
    alert(`เพิ่มลงตะกร้าแล้ว!`); 
  };

  // ฟังก์ชันลบสินค้า
  const removeFromCart = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // ฟังก์ชันอัพเดทจำนวน
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  // ล้างตะกร้า
  const clearCart = () => setCartItems([]);

  // คำนวณราคารวม
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // นับจำนวนชิ้นทั้งหมด
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};