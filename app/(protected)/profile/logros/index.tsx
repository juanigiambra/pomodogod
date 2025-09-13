// Pantalla de Logros - español (AR)
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { AchievementRarity } from '@/constants/achievements';
import { useAppTheme } from '@/hooks/useAppTheme';
import { syncAchievements } from '@/services/achievementsService';
import { useUserStore } from '@/store/userStore';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AchievementItem = any; // simplificado, se podría tipar con AchievementStatus

const rarityOrder: AchievementRarity[] = ['comun','poco-comun','raro','epico','legendario'];

const rarityLabels: Record<AchievementRarity,string> = {
  'comun':'Común',
  'poco-comun':'Poco Común',
  'raro':'Raro',
  'epico':'Épico',
  'legendario':'Legendario'
};

function rarityColor(r: AchievementRarity, colors: any) {
  switch(r){
    case 'comun': return colors.border;
    case 'poco-comun': return '#3fa75f';
    case 'raro': return '#3d6dd8';
    case 'epico': return '#8e44ad';
    case 'legendario': return '#d4af37';
    default: return colors.border;
  }
}

export default function LogrosScreen() {
  const { uid, profile } = useUserStore();
  const { colors } = useAppTheme();
  const [data, setData] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'desbloqueados' | 'bloqueados'>('todos');
  const [newly, setNewly] = useState<string[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);
  const insets = useSafeAreaInsets();

  const load = useCallback(async () => {
    if (!uid) { setData([]); return; }
    setLoading(true);
    try {
      // sincroniza por si hay nuevos
      const result: any = await syncAchievements(uid);
      const newOnes: string[] = result._newlyUnlocked || [];
  if (newOnes.length) { setNewly(newOnes); setConfettiKey(k => k + 1); }
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => { load(); }, [uid]);

  const filtered = data.filter(a => {
    if (filter === 'desbloqueados') return a.unlocked;
    if (filter === 'bloqueados') return !a.unlocked;
    return true;
  });
  const grouped = rarityOrder.map(r => ({
    rarity: r,
    items: filtered.filter(d => d.rarity === r)
  })).filter(g => g.items.length);

  const renderItem = ({ item }: { item: AchievementItem }) => {
    const unlocked = item.unlocked;
    const barColor = unlocked ? colors.primary : rarityColor(item.rarity, colors);
    const isNew = newly.includes(item.id);
    return (
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: barColor, opacity: unlocked ? 1 : 0.7 }]}> 
        <Text style={[styles.icon]}>{item.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.desc, { color: colors.textDim }]}>{item.description}</Text>
          <View style={styles.progressWrapper}>
            <View style={[styles.progressBg, { backgroundColor: colors.border }]}> 
              <View style={[styles.progressFill, { width: `${Math.min(100, Math.round(item.progress * 100))}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textDim }]}>{Math.min(item.currentValue, item.target)}/{item.target}</Text>
          </View>
        </View>
        <View style={styles.sideCol}>
          <Text style={[styles.xpBadge, { backgroundColor: barColor, color: '#fff' }]}>+{item.xpReward}xp</Text>
          <Text style={[styles.rarity, { color: rarityColor(item.rarity as AchievementRarity, colors) }]}>{rarityLabels[item.rarity as AchievementRarity]}</Text>
          <Text style={[styles.stateBadge, { color: unlocked ? (isNew ? 'gold' : colors.primary) : colors.textDim }]}>{unlocked ? (isNew ? 'NUEVO' : '✔') : `${Math.round(item.progress*100)}%`}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}> 
      <Text style={[styles.header, { color: colors.text }]}>Logros</Text>
      <View style={styles.filtersRow}>
        {(['todos','desbloqueados','bloqueados'] as const).map(f => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, { backgroundColor: filter === f ? colors.primary : colors.card, borderColor: colors.border }]}> 
            <Text style={{ color: filter === f ? colors.primaryText : colors.text, fontSize: 12, fontWeight: '600' }}>{f}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={grouped.flatMap(g => [{ header: true, rarity: g.rarity }, ...g.items])}
        keyExtractor={(i, idx) => i.header ? `h-${i.rarity}` : i.id}
        renderItem={({ item }) => item.header ? (
          <Text style={[styles.sectionHeader, { color: rarityColor(item.rarity as AchievementRarity, colors) }]}>{rarityLabels[item.rarity as AchievementRarity]}</Text>
        ) : renderItem({ item }) }
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
        ListEmptyComponent={<Text style={{ color: colors.textDim, textAlign: 'center', marginTop: 40 }}>{uid ? 'Sin logros todavía.' : 'Iniciá sesión.'}</Text>}
      />
      {newly.length > 0 && (
        <View pointerEvents="none" style={styles.confettiLayer}>
          <ConfettiBurst triggerKey={confettiKey} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 32, fontWeight: '800', paddingHorizontal: 20, marginBottom: 12, marginTop: 8 },
  list: { padding: 20, paddingBottom: 100, gap: 10 },
  sectionHeader: { fontSize: 18, fontWeight: '800', marginTop: 12, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 20, borderWidth: 1, gap: 14 },
  icon: { fontSize: 26 },
  title: { fontSize: 15, fontWeight: '700' },
  desc: { fontSize: 12, marginTop: 2 },
  progressWrapper: { marginTop: 8 },
  progressBg: { height: 6, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 4 },
  progressText: { fontSize: 10, marginTop: 4 },
  sideCol: { alignItems: 'flex-end', gap: 4 },
  xpBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  rarity: { fontSize: 10, fontWeight: '600' },
  stateBadge: { fontSize: 12, fontWeight: '700' },
  filtersRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 4 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  confettiLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
