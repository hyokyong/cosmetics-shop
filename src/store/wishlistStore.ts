import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: number[];
  toggle: (productId: number) => void;
  isWished: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),

      isWished: (productId) => get().productIds.includes(productId),
    }),
    { name: 'wishlist-storage' },
  ),
);
