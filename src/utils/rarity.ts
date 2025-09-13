import { AchievementRarity } from '@/constants/achievements';

// Dev note: centralizamos colores por si luego queremos themear o cambiar esquema.
export function rarityColor(r: AchievementRarity): string {
  switch (r) {
    case 'comun': return '#7a7a7a';
    case 'poco-comun': return '#3fa75f';
    case 'raro': return '#3d6dd8';
    case 'epico': return '#8e44ad';
    case 'legendario': return '#d4af37';
    default: return '#888';
  }
}

export const rarityOrder: AchievementRarity[] = ['comun','poco-comun','raro','epico','legendario'];
