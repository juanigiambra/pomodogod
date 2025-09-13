// Pantalla Shop protegida - español (AR)
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { useAppTheme } from '@/hooks/useAppTheme';
import { syncAchievements } from '@/services/achievementsService';
import { purchaseItem } from '@/services/rewardsService';
import { useInventoryStore } from '@/store/inventoryStore';
import { useUserStore } from '@/store/userStore';
import { SHOP_ITEMS } from '@/utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ShopScreen() {
	const { uid, profile, actions } = useUserStore();
	const { colors } = useAppTheme();
	const { items, actions: invActions } = useInventoryStore();
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [confettiKey, setConfettiKey] = useState(0);
	const insets = useSafeAreaInsets();

	useEffect(() => { invActions.load(); }, [uid]);

	const onRefresh = useCallback(async () => {
		if (!uid) return;
		setRefreshing(true);
		await invActions.load();
		setRefreshing(false);
	}, [uid, invActions]);

	async function buy(itemId: string) {
			if (!uid) { Alert.alert('Iniciar sesión', 'Necesitás iniciar sesión para comprar.'); return; }
			const item = SHOP_ITEMS.find(i => i.itemId === itemId)!;
			setLoadingId(itemId);
			try { 
				await purchaseItem(uid, item); 
				await Promise.all([actions.refreshProfile(), invActions.load()]);
				await syncAchievements(uid);
				setConfettiKey(k => k + 1);
				Alert.alert('Compra', '¡Item comprado!'); 
			}
			catch (e: any) { Alert.alert('Error', e.message); }
			finally { setLoadingId(null); }
		}

	const Header = () => (
			<LinearGradient colors={[colors.primary, '#ff8a5c']} style={styles.headerGrad}>
				<Text style={[styles.headerTitle, { color: colors.primaryText }]}>Shop</Text>
				<View style={[styles.coinBadge, { backgroundColor: colors.primaryText + '22' }]}> 
					<Text style={[styles.coinText, { color: colors.primaryText }]}>{profile ? profile.coins : 0}🪙</Text>
				</View>
			</LinearGradient>
		);

		// Componente separado para garantizar reglas de hooks y mejorar memoization
	const ShopItemCard = React.memo(({ item }: { item: typeof SHOP_ITEMS[0] }) => {
			const scale = useSharedValue(1);
			const owned = invActions.isOwned(item.itemId);
			const equipped = invActions.isEquipped(item.itemId);
			const disabled = loadingId === item.itemId || owned;
			const onPress = useCallback(() => { if (!owned) buy(item.itemId); }, [item.itemId, owned]);
			const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
			return (
				<Animated.View style={[styles.cardShadow, animStyle]}>
					<Pressable
						disabled={disabled}
						onPress={onPress}
						onPressIn={() => { scale.value = withSpring(0.94); }}
						onPressOut={() => { scale.value = withSpring(1); }}
						style={[styles.item, { backgroundColor: colors.card, borderColor: owned ? colors.primary : colors.border, opacity: owned ? 0.75 : 1 }]}
					>
						<View style={styles.itemRow}>
							<View style={{ flex: 1 }}>
								<Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
								<Text style={[styles.itemCat, { color: colors.textDim }]}>{item.category}</Text>
							</View>
							{owned ? (
								<View style={[styles.ownedPill, { backgroundColor: equipped ? colors.primary : colors.primary + '44' }]}> 
									<Text style={[styles.ownedText, { color: equipped ? colors.primaryText : colors.primary }]}>{equipped ? 'Equipado' : 'Comprado'}</Text>
								</View>
							) : (
								<View style={[styles.pricePill, { backgroundColor: colors.primary + '22' }]}> 
									<Text style={[styles.priceText, { color: colors.primary }]}>{item.price}🪙</Text>
								</View>
							)}
						</View>
						{!owned && loadingId === item.itemId && <Text style={[styles.loading, { color: colors.textDim }]}>Comprando...</Text>}
						{owned && !equipped && <Pressable style={[styles.equipBtn, { backgroundColor: colors.primary + '22' }]} onPress={() => invActions.equip(items.find(i => i.itemId === item.itemId)!)}>
							<Text style={[styles.equipText, { color: colors.primary }]}>Equipar</Text>
						</Pressable>}
					</Pressable>
				</Animated.View>
			);
		});

	const sortedItems = [...SHOP_ITEMS].sort((a,b) => {
		const ao = invActions.isOwned(a.itemId); const bo = invActions.isOwned(b.itemId);
		if (ao === bo) return a.price - b.price; // cheaper first inside group
		return ao ? 1 : -1; // unowned first
	});

	const renderItem = ({ item }: { item: typeof SHOP_ITEMS[0] }) => (
		<ShopItemCard item={item} />
	);

	return (
		<View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }] }>
			<View style={styles.confettiLayer} pointerEvents="none">
				<ConfettiBurst triggerKey={confettiKey} />
			</View>
				<FlatList
					data={sortedItems}
					keyExtractor={i => i.itemId}
					renderItem={renderItem}
					ListHeaderComponent={Header}
					contentContainerStyle={styles.listContent}
					ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
					showsVerticalScrollIndicator={false}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
				/>
				<Text style={[styles.hint, { color: colors.textDim }]}>{uid ? 'Tocá un ítem para comprarlo.' : 'Iniciá sesión para comprar.'}</Text>
			</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	listContent: { padding: 20, paddingBottom: 80 },
	headerGrad: { padding: 20, borderRadius: 24, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
	headerTitle: { fontSize: 32, fontWeight: '800', flex: 1 },
	coinBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 40 },
	coinText: { fontSize: 16, fontWeight: '700' },
	item: { padding: 16, borderRadius: 20, borderWidth: 1 },
	itemRow: { flexDirection: 'row', alignItems: 'center' },
	itemName: { fontSize: 16, fontWeight: '600' },
	itemCat: { fontSize: 12, marginTop: 2 },
	pricePill: { borderRadius: 30, paddingHorizontal: 14, paddingVertical: 6 },
	priceText: { fontSize: 14, fontWeight: '700' },
	loading: { marginTop: 8, fontSize: 12 },
	ownedPill: { borderRadius: 30, paddingHorizontal: 14, paddingVertical: 6 },
	ownedText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
	ownedHint: { marginTop: 8, fontSize: 11, fontWeight: '600' },
	equipBtn: { marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
	equipText: { fontSize: 12, fontWeight: '700' },
	hint: { position: 'absolute', bottom: 8, alignSelf: 'center', fontSize: 11 },
	cardShadow: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
	confettiLayer: { position: 'absolute', top: 0, left: 0, right: 0, height: 160, alignItems: 'center', justifyContent: 'center' },
});
