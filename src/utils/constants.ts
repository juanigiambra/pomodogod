// Constantes y ítems de la tienda - español (AR)
import { ShopItem } from '@/types';

export const POMODORO_DEFAULTS = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  roundsUntilLongBreak: 4,
};

export const SHOP_ITEMS: ShopItem[] = [
  { itemId: 'hair_basic', name: 'Pelo Básico', category: 'hair', price: 20 },
  { itemId: 'hair_rojo', name: 'Pelo Rojo', category: 'hair', price: 50 },
  { itemId: 'outfit_camisa', name: 'Camisa', category: 'outfit', price: 30 },
  { itemId: 'outfit_saco', name: 'Saco Elegante', category: 'outfit', price: 80 },
  { itemId: 'accessory_lentes', name: 'Lentes', category: 'accessory', price: 40 },
  { itemId: 'background_bosque', name: 'Bosque', category: 'background', price: 60 },
];
