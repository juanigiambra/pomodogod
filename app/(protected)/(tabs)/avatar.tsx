// Pantalla Avatar protegida - español (AR)
import { AvatarPreview } from '@/components/AvatarPreview';
import { equipItem, getInventory } from '@/services/userService';
import { useUserStore } from '@/store/userStore';
import { InventoryItem } from '@/types';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AvatarScreen() {
	const { uid, profile } = useUserStore();
	const [inventory, setInventory] = useState<InventoryItem[]>([]);
	const [loading, setLoading] = useState(false);

	const load = async () => {
		if (!uid) return;
		setLoading(true);
		try { setInventory(await getInventory(uid)); } finally { setLoading(false); }
	};

	useEffect(() => { load(); }, [uid]);

	async function handleEquip(item: InventoryItem) {
		if (!uid) { Alert.alert('Login requerido', 'Iniciá sesión para equipar.'); return; }
		try { await equipItem(uid, item.itemId, item.category); await load(); } catch (e: any) { Alert.alert('Error', e.message); }
	}

	const equippedMap: Record<string, InventoryItem | undefined> = {};
	inventory.forEach(i => { if (i.equipped) equippedMap[i.category] = i; });

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Avatar</Text>
			<AvatarPreview avatar={profile?.avatar} />
			<Text style={styles.subtitle}>Equipados:</Text>
			{['hair', 'outfit', 'accessory', 'background'].map(c => (
				<Text key={c} style={styles.equipped}>{c}: {equippedMap[c]?.itemId || '—'}</Text>
			))}
			<Text style={styles.subtitle}>Inventario:</Text>
			<FlatList
				data={inventory}
				keyExtractor={i => i.id!}
				refreshing={loading}
				onRefresh={load}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleEquip(item)} style={[styles.item, item.equipped && { borderColor: '#ff5a5f' }] }>
						<Text style={styles.itemText}>{item.itemId}</Text>
						<Text style={styles.itemCat}>{item.category}</Text>
						{item.equipped && <Text style={styles.equippedTag}>Equipado</Text>}
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={styles.info}>{uid ? 'Sin ítems todavía.' : 'Iniciá sesión.'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
	subtitle: { marginTop: 16, fontWeight: '600' },
	equipped: { color: '#666' },
	info: { color: '#666', marginTop: 8 },
	item: { padding: 12, borderWidth: 2, borderColor: '#ddd', borderRadius: 8, marginVertical: 6 },
	itemText: { fontWeight: '600' },
	itemCat: { color: '#666' },
	equippedTag: { position: 'absolute', right: 8, top: 8, color: '#ff5a5f', fontWeight: '700' },
});
