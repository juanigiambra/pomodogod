// Pantalla Stats (protegida) con theming
import { useAppTheme } from '@/hooks/useAppTheme';
import { fetchRecentSessions } from '@/services/userService';
import { useUserStore } from '@/store/userStore';
import { Session } from '@/types';
import { formatDuration } from '@/utils/time';
import { xpProgress } from '@/utils/xp';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

export default function StatsScreen() {
	const { profile, uid } = useUserStore();
	const { colors } = useAppTheme();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(false);

	async function load() {
		if (!uid) return;
		setLoading(true);
		try { setSessions(await fetchRecentSessions(uid, 10)); }
		finally { setLoading(false); }
	}

	useEffect(() => { load(); }, [uid]);

	const progress = profile && xpProgress(profile.xp);
	const totalTime = sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.durationSec, 0);

	// Mini chart: agrupar sesiones work por día (simple último 7)
	const days: { label: string; total: number; }[] = [];
	const now = new Date();
	for (let i = 6; i >= 0; i--) {
		const d = new Date(now); d.setDate(now.getDate() - i);
		const label = d.toLocaleDateString('es-AR', { weekday: 'short' }).slice(0, 2);
		const dayTotal = sessions.filter(s => s.type === 'work' && new Date(s.startedAt).getDate() === d.getDate()).reduce((a, s) => a + s.durationSec, 0);
		days.push({ label, total: dayTotal });
	}
	const maxDay = Math.max(1, ...days.map(d => d.total));

	// Animaciones de barras
	const barHeights = days.map(d => useSharedValue(0));
	useEffect(() => {
		days.forEach((d, idx) => {
			const target = d.total / maxDay;
			barHeights[idx].value = withTiming(target, { duration: 700, easing: Easing.out(Easing.cubic) });
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessions]);

	const Bar = ({ index, color }: { index: number; color: string }) => {
		const sv = barHeights[index];
		const aStyle = useAnimatedStyle(() => ({ height: `${sv.value * 100}%` }));
		return <Animated.View style={[styles.chartBarFill, { backgroundColor: color }, aStyle]} />;
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}> 
			<LinearGradient colors={[colors.primary, '#ff8a5c']} style={styles.header}> 
				<Text style={[styles.headerTitle, { color: colors.primaryText }]}>Stats</Text>
			</LinearGradient>
			{profile && progress && (
				<View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
					<Text style={[styles.level, { color: colors.primary }]}>Nivel {progress.level}</Text>
					<Text style={[styles.xp, { color: colors.textDim }]}>XP {progress.current}/{progress.required}</Text>
					<View style={[styles.barBg, { backgroundColor: colors.border }]}> 
						<View style={[styles.barFill, { backgroundColor: colors.primary, width: `${(progress.current / progress.required) * 100}%` }]} />
					</View>
					<Text style={[styles.stat, { color: colors.text }]}>Tiempo total (últimos 10): {Math.round(totalTime / 60)} min</Text>
				</View>
			)}

			<View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
				<Text style={[styles.chartTitle, { color: colors.text }]}>Actividad 7 días</Text>
				<View style={styles.chartRow}>
					{days.map((d, idx) => (
						<View key={idx} style={styles.chartBar}> 
							<Bar index={idx} color={colors.primary} />
						</View>
					))}
				</View>
				<View style={styles.chartLabelsRow}>
					{days.map((d, idx) => (
						<Text key={idx} style={[styles.chartLabel, { color: colors.textDim }]}>{d.label}</Text>
					))}
				</View>
			</View>

			<Text style={[styles.subtitle, { color: colors.text }]}>Últimas sesiones</Text>
			<FlatList
				data={sessions}
				keyExtractor={i => i.id!}
				refreshing={loading}
				onRefresh={load}
				style={{ flexGrow: 0 }}
				contentContainerStyle={{ paddingBottom: 160 }}
				renderItem={({ item }) => (
					<View style={[styles.session, { borderBottomColor: colors.border }]}> 
						<Text style={[styles.sessionType, { color: colors.text }]}>{item.type}</Text>
						<Text style={[styles.sessionDur, { color: colors.textDim }]}>{formatDuration(item.durationSec)}</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={{ color: colors.textDim }}>No hay sesiones recientes.</Text>}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24 },
	header: { padding: 24, borderRadius: 28, marginBottom: 24 },
	headerTitle: { fontSize: 34, fontWeight: '800' },
	card: { padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1 },
	level: { fontSize: 20, fontWeight: '700' },
	xp: { marginBottom: 6 },
	barBg: { height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
	barFill: { height: 10, borderRadius: 6 },
	stat: { },
	chartCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 32 },
	chartTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
	chartRow: { flexDirection: 'row', height: 100, alignItems: 'flex-end', gap: 10 },
	chartBar: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' },
	chartBarFill: { width: '100%', borderRadius: 8 },
	chartLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
	chartLabel: { fontSize: 10 },
	subtitle: { fontWeight: '600', marginTop: 8, marginBottom: 4 },
	session: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
	sessionType: { fontSize: 14, fontWeight: '600' },
	sessionDur: { fontSize: 12 },
});
