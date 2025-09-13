// Lógica de recompensas y compras - español (AR)
import { InventoryItem, ShopItem } from '@/types';
import { COINS_PER_POMODORO, xpForSession } from '@/utils/xp';
import {
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
    writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
    equipItem,
    getInventory,
    inventoryCol,
    userDoc
} from './userService';

export async function awardForCompletedPomodoro(uid: string, streakDays: number) {
  const xp = xpForSession(streakDays);
  const coins = COINS_PER_POMODORO;
  return { xp, coins };
}

export async function purchaseItem(uid: string, shopItem: ShopItem) {
  if (!uid) throw new Error('No autenticado');
  const userRef = userDoc(uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('Perfil no encontrado');

  const profile = userSnap.data();
  if (profile.coins < shopItem.price) throw new Error('Monedas insuficientes');

  const q = query(
    inventoryCol,
    where('uid', '==', uid),
    where('itemId', '==', shopItem.itemId),
  );
  const snap = await getDocs(q);
  if (!snap.empty) throw new Error('Ya comprado');

  const batch = writeBatch(db);
  batch.update(userRef, {
    coins: profile.coins - shopItem.price,
    updatedAt: serverTimestamp(),
  });
  const invRef = doc(inventoryCol);
  const inventoryItem: InventoryItem = {
    uid,
    itemId: shopItem.itemId,
    category: shopItem.category,
    equipped: false,
  };
  batch.set(invRef, inventoryItem);
  await batch.commit();
  return inventoryItem;
}

export async function equipOwnedItem(
  uid: string,
  itemId: string,
  category: InventoryItem['category'],
) {
  if (!uid) throw new Error('No autenticado');
  await equipItem(uid, itemId, category);
  return getInventory(uid);
}
