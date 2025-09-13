// Pantalla Stats protegida - español (AR)
import { fetchRecentSessions } from '@/services/userService';
import { useUserStore } from '@/store/userStore';
import { Session } from '@/types';
import { formatDuration } from '@/utils/time';
import { xpProgress } from '@/utils/xp';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function StatsScreen() {
	const { profile, uid } = useUserStore();
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

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Stats</Text>
			{profile && progress && (
				<View style={styles.card}>
					<Text style={styles.level}>Nivel {progress.level}</Text>
					<Text style={styles.xp}>XP {progress.current}/{progress.required}</Text>
					<View style={styles.barBg}>
						<View style={[styles.barFill, { width: `${(progress.current / progress.required) * 100}%` }]} />
					</View>
					<Text style={styles.stat}>Tiempo total (últimos 10): {Math.round(totalTime / 60)} min</Text>
				</View>
			)}
			<Text style={styles.subtitle}>Últimas sesiones</Text>
			<FlatList
				data={sessions}
				keyExtractor={i => i.id!}
				refreshing={loading}
				onRefresh={load}
				renderItem={({ item }) => (
					<View style={styles.session}>
						<Text style={styles.sessionType}>{item.type}</Text>
						<Text style={styles.sessionDur}>{formatDuration(item.durationSec)}</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={styles.info}>No hay sesiones recientes.</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
	info: { color: '#666', marginBottom: 12 },
	card: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 16 },
	level: { fontSize: 20, fontWeight: '700', color: '#ff5a5f' },
	xp: { color: '#666', marginBottom: 6 },
	barBg: { height: 10, backgroundColor: '#ddd', borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
	barFill: { height: 10, backgroundColor: '#ff5a5f' },
	stat: { color: '#222' },
	subtitle: { fontWeight: '600', marginTop: 8, marginBottom: 4 },
	session: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomColor: '#eee', borderBottomWidth: 1 },
	sessionType: { color: '#222' },
	sessionDur: { color: '#666' },
});
