// Tipos globales - comentarios en español (AR)

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface AvatarData {
  hair?: string;
  outfit?: string;
  accessory?: string;
  background?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  level: number;
  xp: number;
  coins: number;
  avatar: AvatarData;
  streakDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id?: string;
  uid: string;
  startedAt: Date;
  endedAt: Date;
  durationSec: number;
  type: PomodoroMode;
  completed: boolean;
}

export interface InventoryItem {
  id?: string;
  uid: string;
  itemId: string;
  category: 'hair' | 'outfit' | 'accessory' | 'background';
  equipped: boolean;
}

export interface ShopItem {
  itemId: string;
  name: string;
  category: InventoryItem['category'];
  price: number;
  asset?: string;
}
