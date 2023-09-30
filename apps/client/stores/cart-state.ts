import { CartItem } from '@client/types';
import { create } from 'zustand';

export type CartState = {
  cart: {
    id: string;
    createdAt: Date;
    userId: string | null;
    updatedAt: Date;
    cartItems: CartItem[];
  } | null;
  setCart: (cart: CartState['cart']) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  setCart: (cart) => set(() => ({ cart })),
}));
