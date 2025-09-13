// Store de inventario - español (AR)
import { create } from 'zustand';
import { InventoryItem } from '@/types';
import { getInventory, equipItem } from '@/services/userService';
import { useUserStore } from './userStore';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  actions: {
    load(): Promise<void>;
    equip(item: InventoryItem): Promise<void>;
    isOwned(itemId: string): boolean;
    isEquipped(itemId: string): boolean;
    byCategory(cat: InventoryItem['category']): InventoryItem[];
  };
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  loading: false,
  actions: {
    async load() {
      const uid = useUserStore.getState().uid;
      if (!uid) { set({ items: [] }); return; }
      set({ loading: true });
      try {
        const inv = await getInventory(uid);
        set({ items: inv as InventoryItem[] });
      } finally {
        set({ loading: false });
      }
    },
    async equip(item) {
      const uid = useUserStore.getState().uid;
      if (!uid) return;
      await equipItem(uid, item.itemId, item.category);
      await get().actions.load();
    },
    isOwned(itemId) { return get().items.some(i => i.itemId === itemId); },
    isEquipped(itemId) { return get().items.some(i => i.itemId === itemId && i.equipped); },
    byCategory(cat) { return get().items.filter(i => i.category === cat); },
  },
}));
