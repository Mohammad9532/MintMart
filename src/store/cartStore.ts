import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // product id
    name: string;
    price: number;
    image: string;
    quantity: number;
    shopId: string;
    shopName: string;
}

interface CartState {
    items: CartItem[];
    shopId: string | null;
    shopName: string | null;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    addItem: (item: Omit<CartItem, 'quantity'>) => { success: boolean; message?: string };
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            shopId: null,
            shopName: null,
            isDrawerOpen: false,

            openDrawer: () => set({ isDrawerOpen: true }),
            closeDrawer: () => set({ isDrawerOpen: false }),

            addItem: (item) => {
                const currentShopId = get().shopId;

                // Block adding items from different shops
                if (currentShopId && currentShopId !== item.shopId) {
                    return {
                        success: false,
                        message: `Your cart contains items from ${get().shopName}. Please clear your cart to order from ${item.shopName}.`
                    };
                }

                set((state) => {
                    const existingItem = state.items.find(i => i.id === item.id);
                    if (existingItem) {
                        return {
                            items: state.items.map(i =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            )
                        };
                    }
                    return {
                        shopId: item.shopId,
                        shopName: item.shopName,
                        items: [...state.items, { ...item, quantity: 1 }]
                    };
                });

                return { success: true };
            },

            removeItem: (id) => {
                set((state) => {
                    const newItems = state.items.filter(i => i.id !== id);
                    return {
                        items: newItems,
                        shopId: newItems.length === 0 ? null : state.shopId,
                        shopName: newItems.length === 0 ? null : state.shopName
                    };
                });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set((state) => ({
                    items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
                }));
            },

            clearCart: () => set({ items: [], shopId: null, shopName: null }),

            getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
        }),
        {
            name: 'mintmart-cart', // Persist cart to localStorage so it survives refreshes
            partialize: (state) => ({
                items: state.items,
                shopId: state.shopId,
                shopName: state.shopName
            }), // Exclude UI state from local storage!
        }
    )
);
