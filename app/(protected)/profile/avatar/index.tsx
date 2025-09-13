// Avatar nested under profile
import { AvatarPreview } from '@/components/AvatarPreview';
import InventoryGridItem from '@/components/InventoryGridItem';
import { useAppTheme } from '@/hooks/useAppTheme';
// Servicios ahora gestionados vía inventoryStore
import { equipItem, getInventory } from '@/services/userService';
import { useInventoryStore } from '@/store/inventoryStore';
import { useUserStore } from '@/store/userStore';
import { InventoryItem } from '@/types';
import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AvatarScreen() {
	const { uid, profile } = useUserStore();
	const { colors } = useAppTheme();
	const { items: inventory, loading, actions: invActions } = useInventoryStore();
  const insets = useSafeAreaInsets();

  useEffect(() => { invActions.load(); }, [uid]);

	async function handleEquip(item: InventoryItem) {
		if (!uid) { Alert.alert('Login requerido', 'Iniciá sesión para equipar.'); return; }
		try { await invActions.equip(item); } catch (e: any) { Alert.alert('Error', e.message); }
	}

	const equippedMap: Record<string, InventoryItem | undefined> = {};
	inventory.forEach(i => { if (i.equipped) equippedMap[i.category] = i; });

	const numColumns = 2; // simple responsive; could compute by width
	const w = Dimensions.get('window').width;
	const cardSize = (w - 24 * 2 - 16) / numColumns; // padding *2 - gaps

	const renderItem = ({ item }: { item: InventoryItem }) => (
		<InventoryGridItem item={item} cardSize={cardSize} onEquip={handleEquip} />
	);

	return (
		<View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}> 
			<LinearGradient colors={[colors.primary, '#ff8a5c']} style={styles.header}> 
				<Text style={[styles.headerTitle, { color: colors.primaryText }]}>Avatar</Text>
				<View style={styles.previewBox}><AvatarPreview avatar={profile?.avatar} /></View>
			</LinearGradient>
			<View style={styles.equippedRow}>
				{['hair', 'outfit', 'accessory', 'background'].map(c => (
					<View key={c} style={styles.equipBadge}> 
						<Text style={[styles.equipBadgeCat, { color: colors.textDim }]}>{c}</Text>
						<Text style={[styles.equipBadgeItem, { color: colors.text }]} numberOfLines={1}>{equippedMap[c]?.itemId || '—'}</Text>
					</View>
				))}
			</View>
			<FlatList
				data={inventory}
				keyExtractor={i => i.id!}
				refreshing={loading}
				onRefresh={invActions.load}
				renderItem={renderItem}
				numColumns={numColumns}
				columnWrapperStyle={{ gap: 16 }}
				contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 16, paddingTop: 8 }}
				ListEmptyComponent={<Text style={[styles.info, { color: colors.textDim }]}>{uid ? 'Sin ítems todavía.' : 'Iniciá sesión.'}</Text>}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: { padding: 24, paddingTop: 48, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
	headerTitle: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
	previewBox: { alignItems: 'center' },
	equippedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24, marginTop: 16 },
	equipBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: 'transparent' },
	equipBadgeCat: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
	equipBadgeItem: { fontSize: 12, fontWeight: '600', marginTop: 2, maxWidth: 72 },
	gridItemWrap: { },
	item: { padding: 14, borderWidth: 2, borderRadius: 20, justifyContent: 'center', alignItems: 'flex-start', gap: 4, minHeight: 90 },
	itemText: { fontWeight: '600', fontSize: 14 },
	itemCat: { fontSize: 11 },
	equippedTag: { position: 'absolute', right: 10, top: 10, fontWeight: '700', fontSize: 10 },
	info: { marginTop: 32, textAlign: 'center' },
});