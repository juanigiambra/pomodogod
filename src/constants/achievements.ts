// Definición de logros - español (AR)
// Cada logro tiene un id estable para guardarlo como desbloqueado.
// condition: función que recibe contexto y devuelve boolean.

export type AchievementRarity = 'comun' | 'raro' | 'epico' | 'legendario' | 'poco-comun';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string; // simple emoji por ahora
  category: 'sesiones' | 'objetos' | 'racha' | 'nivel' | 'monedas';
  rarity: AchievementRarity;
  metric: keyof AchievementContext; // cuál campo medir
  target: number; // valor necesario
  xpReward: number; // XP otorgada al desbloquear
  points?: number; // reservado para otra economía
}

export interface AchievementContext {
  sessionsCount: number;
  totalWorkMinutes: number;
  longestStreak: number;
  level: number;
  coins: number;
  ownedItems: number;
  equippedCount: number;
  firstPurchase: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Sesiones
  { id: 'first_session', title: 'Primer Paso', description: 'Completa tu primera sesión.', icon: '🚶', category: 'sesiones', rarity: 'comun', metric: 'sessionsCount', target: 1, xpReward: 20 },
  { id: 'five_sessions', title: 'Rutina Inicial', description: 'Completa 5 sesiones.', icon: '🎯', category: 'sesiones', rarity: 'comun', metric: 'sessionsCount', target: 5, xpReward: 30 },
  { id: 'ten_sessions', title: 'Ritmo Tomado', description: 'Completa 10 sesiones.', icon: '🏃', category: 'sesiones', rarity: 'poco-comun', metric: 'sessionsCount', target: 10, xpReward: 50 },
  { id: 'twenty_five_sessions', title: 'Productivo', description: 'Completa 25 sesiones.', icon: '🔥', category: 'sesiones', rarity: 'poco-comun', metric: 'sessionsCount', target: 25, xpReward: 80 },
  { id: 'fifty_sessions', title: 'Constancia Fuerte', description: 'Completa 50 sesiones.', icon: '💪', category: 'sesiones', rarity: 'raro', metric: 'sessionsCount', target: 50, xpReward: 120 },
  { id: 'hundred_sessions', title: 'Centurión del Focus', description: 'Completa 100 sesiones.', icon: '🛡️', category: 'sesiones', rarity: 'raro', metric: 'sessionsCount', target: 100, xpReward: 180 },
  { id: 'two_hundred_sessions', title: 'Doble Centuria', description: 'Completa 200 sesiones.', icon: '⚔️', category: 'sesiones', rarity: 'epico', metric: 'sessionsCount', target: 200, xpReward: 260 },
  { id: 'five_hundred_sessions', title: 'Maestro del Enfoque', description: 'Completa 500 sesiones.', icon: '🧙', category: 'sesiones', rarity: 'epico', metric: 'sessionsCount', target: 500, xpReward: 400 },
  { id: 'thousand_sessions', title: 'Leyenda del Tiempo', description: 'Completa 1000 sesiones.', icon: '🏆', category: 'sesiones', rarity: 'legendario', metric: 'sessionsCount', target: 1000, xpReward: 700 },
  // Objetos
  { id: 'first_item', title: 'Comprador', description: 'Compra tu primer objeto.', icon: '🛒', category: 'objetos', rarity: 'comun', metric: 'ownedItems', target: 1, xpReward: 20 },
  { id: 'five_items', title: 'Coleccionista', description: 'Posee 5 objetos.', icon: '📦', category: 'objetos', rarity: 'poco-comun', metric: 'ownedItems', target: 5, xpReward: 40 },
  { id: 'ten_items', title: 'Acumulador', description: 'Posee 10 objetos.', icon: '🎁', category: 'objetos', rarity: 'raro', metric: 'ownedItems', target: 10, xpReward: 70 },
  { id: 'twenty_items', title: 'Arsenal Estético', description: 'Posee 20 objetos.', icon: '🗂️', category: 'objetos', rarity: 'epico', metric: 'ownedItems', target: 20, xpReward: 120 },
  { id: 'first_equip', title: 'Mostrando Estilo', description: 'Equipa tu primer objeto.', icon: '✨', category: 'objetos', rarity: 'comun', metric: 'equippedCount', target: 1, xpReward: 20 },
  { id: 'four_equipped', title: 'Full Set', description: 'Equipá algo en cada categoría.', icon: '🧩', category: 'objetos', rarity: 'raro', metric: 'equippedCount', target: 4, xpReward: 90 },
  // Nivel
  { id: 'level_2', title: 'Subiendo', description: 'Alcanza nivel 2.', icon: '⬆️', category: 'nivel', rarity: 'comun', metric: 'level', target: 2, xpReward: 15 },
  { id: 'level_5', title: 'Crecimiento', description: 'Alcanza nivel 5.', icon: '🌱', category: 'nivel', rarity: 'poco-comun', metric: 'level', target: 5, xpReward: 40 },
  { id: 'level_10', title: 'Progresión', description: 'Alcanza nivel 10.', icon: '🚀', category: 'nivel', rarity: 'raro', metric: 'level', target: 10, xpReward: 90 },
  { id: 'level_15', title: 'Veterano', description: 'Alcanza nivel 15.', icon: '🛡️', category: 'nivel', rarity: 'epico', metric: 'level', target: 15, xpReward: 140 },
  { id: 'level_20', title: 'Experto', description: 'Alcanza nivel 20.', icon: '⭐', category: 'nivel', rarity: 'legendario', metric: 'level', target: 20, xpReward: 220 },
  // Monedas
  { id: 'coins_100', title: 'Ahorrista', description: 'Acumula 100 monedas.', icon: '💰', category: 'monedas', rarity: 'comun', metric: 'coins', target: 100, xpReward: 20 },
  { id: 'coins_250', title: 'Buen Bolsillo', description: 'Acumula 250 monedas.', icon: '🪙', category: 'monedas', rarity: 'poco-comun', metric: 'coins', target: 250, xpReward: 45 },
  { id: 'coins_500', title: 'Fondo Sólido', description: 'Acumula 500 monedas.', icon: '🏦', category: 'monedas', rarity: 'raro', metric: 'coins', target: 500, xpReward: 90 },
  { id: 'coins_1000', title: 'Banco Personal', description: 'Acumula 1000 monedas.', icon: '💎', category: 'monedas', rarity: 'epico', metric: 'coins', target: 1000, xpReward: 160 },
  // Rachas
  { id: 'streak_2', title: 'Calentando Racha', description: 'Racha de 2 días.', icon: '📅', category: 'racha', rarity: 'comun', metric: 'longestStreak', target: 2, xpReward: 15 },
  { id: 'streak_5', title: 'Racha Sólida', description: 'Racha de 5 días.', icon: '🔥', category: 'racha', rarity: 'poco-comun', metric: 'longestStreak', target: 5, xpReward: 40 },
  { id: 'streak_10', title: 'Racha en Fuego', description: 'Racha de 10 días.', icon: '⚡', category: 'racha', rarity: 'raro', metric: 'longestStreak', target: 10, xpReward: 85 },
  { id: 'streak_20', title: 'Hábito Cementado', description: 'Racha de 20 días.', icon: '🏔️', category: 'racha', rarity: 'epico', metric: 'longestStreak', target: 20, xpReward: 140 },
  { id: 'streak_30', title: 'Imparable', description: 'Racha de 30 días.', icon: '🔥', category: 'racha', rarity: 'legendario', metric: 'longestStreak', target: 30, xpReward: 220 },
  // Tiempo trabajo
  { id: 'work_250', title: 'Horas Acumuladas I', description: 'Acumula 250 min. de trabajo.', icon: '⏱️', category: 'sesiones', rarity: 'poco-comun', metric: 'totalWorkMinutes', target: 250, xpReward: 70 },
  { id: 'work_1000', title: 'Horas Acumuladas II', description: 'Acumula 1000 min. de trabajo.', icon: '⏲️', category: 'sesiones', rarity: 'raro', metric: 'totalWorkMinutes', target: 1000, xpReward: 180 },
  { id: 'work_5000', title: 'Horas Acumuladas III', description: 'Acumula 5000 min. de trabajo.', icon: '🕰️', category: 'sesiones', rarity: 'legendario', metric: 'totalWorkMinutes', target: 5000, xpReward: 500 },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));
