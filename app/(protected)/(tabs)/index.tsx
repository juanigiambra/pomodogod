// Pantalla Timer - español (AR)
import { TimerDisplay } from '@/components/TimerDisplay';
import { useAppTheme } from '@/hooks/useAppTheme';
import { awardOnPomodoroComplete } from '@/services/userService';
import { usePomodoroStore } from '@/store/pomodoroStore';
import { useThemeStore } from '@/store/themeStore';
import { useUserStore } from '@/store/userStore';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import React, { useCallback, useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldSetBadge: false,
		shouldPlaySound: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}) as any,
});

async function ensureNotificationPermission() {
	const { status } = await Notifications.getPermissionsAsync();
	if (status !== 'granted') {
		await Notifications.requestPermissionsAsync();
	}
}

export default function TimerScreen() {
	const { mode, secondsLeft, workDuration, shortBreakDuration, longBreakDuration, isRunning, actions } = usePomodoroStore();
	const { profile } = useUserStore();
	const { colors } = useAppTheme();
	const isDark = useThemeStore.getState().mode === 'dark';
	const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insets = useSafeAreaInsets();

	const total = mode === 'work' ? workDuration : mode === 'shortBreak' ? shortBreakDuration : longBreakDuration;
	const modeLabel = mode === 'work' ? 'Trabajo' : mode === 'shortBreak' ? 'Descanso Corto' : 'Descanso Largo';

	useEffect(() => { ensureNotificationPermission(); }, []);

	useEffect(() => {
		if (isRunning) {
			if (tickRef.current) clearInterval(tickRef.current);
			tickRef.current = setInterval(() => actions.tick(), 1000);
		} else if (tickRef.current) {
			clearInterval(tickRef.current);
			tickRef.current = null;
		}
		return () => { if (tickRef.current) clearInterval(tickRef.current); };
	}, [isRunning, actions]);

	const handleCompletion = useCallback(async () => {
		await Notifications.scheduleNotificationAsync({
			content: { title: '¡Ciclo completo!', body: mode === 'work' ? 'Terminó el Pomodoro 🎉' : 'Descanso listo, volvamos.' },
			trigger: null,
		});
		if (mode === 'work' && profile) {
			try {
				const end = new Date();
				const start = new Date(end.getTime() - workDuration * 1000);
				const result = await awardOnPomodoroComplete(profile.uid, { startedAt: start, endedAt: end, durationSec: workDuration, type: 'work', streakDays: profile.streakDays + 1 });
				Alert.alert('Recompensa', `¡+${result?.gainedXp} XP y +5 monedas!`);
			} catch (e: any) { console.log(e); }
		} else if (mode === 'work' && !profile) {
			Alert.alert('Iniciar sesión', 'Iniciá sesión para ganar XP y monedas por tus Pomodoros.');
		}
	}, [mode, profile, workDuration]);

	const originalComplete = actions.completeCycle;
	const completeCycle = () => originalComplete(handleCompletion);

	return (
		<View style={{ flex: 1 }}>
				<LinearGradient colors={isDark ? ['#0b0f17', '#141e30'] : ['#ffffff', '#f2f5f9']} style={{ flex: 1, paddingTop: insets.top }}>
				<ScrollView contentContainerStyle={[styles.container]}>        
					<Text style={[styles.title, { color: colors.text }]}>Pomodoro</Text>
					<TimerDisplay secondsLeft={secondsLeft} total={total} modeLabel={modeLabel} />
					<View style={styles.modeSwitch}>
						{(['work', 'shortBreak', 'longBreak'] as const).map((m) => (
							<Pressable
								key={m}
								accessibilityLabel={`Modo ${m}`}
								onPress={() => actions.switchMode(m)}
								style={[styles.modeBtn, { backgroundColor: colors.card }, mode === m && { backgroundColor: colors.primary }]}
							>
								<Text style={[styles.modeText, { color: colors.text }, mode === m && { color: colors.primaryText, fontWeight: '700' }]}>
									{m === 'work' ? 'Trabajo' : m === 'shortBreak' ? 'Desc. Corto' : 'Desc. Largo'}
								</Text>
							</Pressable>
						))}
					</View>
					<Text style={[styles.hint, { color: colors.textDim }]}>
						{profile ? `Nivel ${profile.level} | XP ${profile.xp} | Monedas ${profile.coins}` : 'Sin sesión: progreso local solamente.'}
					</Text>
				</ScrollView>
				<View style={styles.fabContainer} pointerEvents="box-none">
					{!isRunning && (
						<Animated.View entering={ZoomIn} exiting={ZoomOut}>
							<Pressable onPress={actions.start} style={[styles.fab, { backgroundColor: colors.primary }]}> 
								<Text style={[styles.fabLabel, { color: colors.primaryText }]}>Iniciar</Text>
							</Pressable>
						</Animated.View>
					)}
					{isRunning && (
						<Animated.View entering={ZoomIn} exiting={ZoomOut}>
							<Pressable onPress={actions.pause} style={[styles.fab, { backgroundColor: colors.danger || colors.primary }]}> 
								<Text style={[styles.fabLabel, { color: colors.primaryText }]}>Pausar</Text>
							</Pressable>
						</Animated.View>
					)}
					<Animated.View entering={FadeIn} exiting={FadeOut} style={styles.resetWrap}>
						<Pressable onPress={actions.reset} style={[styles.resetBtn, { backgroundColor: colors.card, borderColor: colors.border }]}> 
							<Text style={[styles.resetLabel, { color: colors.textDim }]}>Reiniciar</Text>
						</Pressable>
					</Animated.View>
				</View>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 24, alignItems: 'center', flexGrow: 1 },
	title: { fontSize: 32, fontWeight: '700', marginTop: 8 },
	modeSwitch: { flexDirection: 'row', gap: 10, marginTop: 4 },
	modeBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20 },
	modeText: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
	hint: { marginTop: 18, fontSize: 12 },
	fabContainer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
	fab: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 40, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
	fabLabel: { fontSize: 18, fontWeight: '700' },
	resetWrap: { position: 'absolute', right: 28, bottom: 4 },
	resetBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 30, borderWidth: 1 },
	resetLabel: { fontSize: 12, fontWeight: '600' },
});
