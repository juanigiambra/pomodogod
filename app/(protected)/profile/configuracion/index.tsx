// Configuración nested under profile
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import { usePomodoroStore } from '@/store/pomodoroStore';
import { useUserStore } from '@/store/userStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfiguracionScreen() {
	const { uid, profile, actions } = useUserStore();
	const { colors, mode, toggle, useSystem, setUseSystem } = useAppTheme();
	const insets = useSafeAreaInsets();

	async function doSignOut() {
		await actions.signOut();
		Alert.alert('Sesión', 'Cerraste sesión.');
	}

	const pomodoro = usePomodoroStore();
	const [work, setWork] = useState(String(pomodoro.workDuration / 60));
	const [shortB, setShortB] = useState(String(pomodoro.shortBreakDuration / 60));
	const [longB, setLongB] = useState(String(pomodoro.longBreakDuration / 60));
	const [rounds, setRounds] = useState(String(pomodoro.roundsUntilLongBreak));

	function savePomodoro() {
		const w = parseInt(work, 10), s = parseInt(shortB, 10), l = parseInt(longB, 10), r = parseInt(rounds, 10);
		if ([w, s, l, r].some(n => isNaN(n) || n <= 0)) { Alert.alert('Error', 'Valores inválidos'); return; }
		pomodoro.actions.updateSettings({
			workDuration: w * 60,
			shortBreakDuration: s * 60,
			longBreakDuration: l * 60,
			roundsUntilLongBreak: r,
		});
		Alert.alert('Guardado', 'Configuración Pomodoro actualizada.');
	}

	return (
		<ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>      
			<LinearGradient colors={[colors.primary, '#ff8a5c']} style={styles.hero}> 
				<Text style={[styles.heroTitle, { color: colors.primaryText }]}>Configuración</Text>
				<Text style={[styles.heroSubtitle, { color: colors.primaryText }]}>Personalizá tu experiencia</Text>
			</LinearGradient>

			{uid && profile && (
				<Animated.View entering={FadeInUp.delay(50)} exiting={FadeOut} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Cuenta</Text>
					<Text style={[styles.info, { color: colors.textDim }]}>UID: {uid}</Text>
					<Text style={[styles.info, { color: colors.text }]}>Nivel {profile.level} · XP {profile.xp}</Text>
					<PrimaryButton label="Cerrar Sesión" onPress={doSignOut} variant="outline" />
				</Animated.View>
			)}
			{!uid && (
				<Animated.View entering={FadeInUp.delay(100)} exiting={FadeOut} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Cuenta</Text>
					<Text style={[styles.info, { color: colors.textDim }]}>No has iniciado sesión.</Text>
					<Link href="/(auth)/login" asChild>
						<PrimaryButton label="Ir a Login" onPress={() => {}} />
					</Link>
				</Animated.View>
			)}

			<Animated.View entering={FadeInUp.delay(150)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
				<Text style={[styles.sectionTitle, { color: colors.text }]}>Tema</Text>
				<View style={styles.switchRow}> 
					<View style={{ flex: 1 }}>
						<Text style={[styles.switchLabel, { color: colors.text }]}>Modo oscuro</Text>
						<Text style={[styles.switchHint, { color: colors.textDim }]}>Forzá claro / oscuro manualmente</Text>
					</View>
					<Switch value={mode === 'dark'} onValueChange={toggle} />
				</View>
				<View style={styles.switchRow}> 
					<View style={{ flex: 1 }}>
						<Text style={[styles.switchLabel, { color: colors.text }]}>Seguir sistema</Text>
						<Text style={[styles.switchHint, { color: colors.textDim }]}>Sincroniza con preferencia de iOS/Android</Text>
					</View>
						<Switch value={useSystem} onValueChange={() => setUseSystem(!useSystem)} />
				</View>
			</Animated.View>

			<Animated.View entering={FadeInUp.delay(200)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
				<Text style={[styles.sectionTitle, { color: colors.text }]}>Pomodoro</Text>
				<View style={styles.gridFields}> 
					<View style={styles.fieldBlock}> 
						<Text style={[styles.fieldLabel, { color: colors.textDim }]}>Trabajo (min)</Text>
						<TextInput value={work} onChangeText={setWork} keyboardType="number-pad" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]} />
					</View>
					<View style={styles.fieldBlock}> 
						<Text style={[styles.fieldLabel, { color: colors.textDim }]}>Desc. corto</Text>
						<TextInput value={shortB} onChangeText={setShortB} keyboardType="number-pad" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]} />
					</View>
					<View style={styles.fieldBlock}> 
						<Text style={[styles.fieldLabel, { color: colors.textDim }]}>Desc. largo</Text>
						<TextInput value={longB} onChangeText={setLongB} keyboardType="number-pad" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]} />
					</View>
					<View style={styles.fieldBlock}> 
						<Text style={[styles.fieldLabel, { color: colors.textDim }]}>Rondas</Text>
						<TextInput value={rounds} onChangeText={setRounds} keyboardType="number-pad" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]} />
					</View>
				</View>
				<PrimaryButton label="Guardar" onPress={savePomodoro} />
			</Animated.View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 24, paddingBottom: 140 },
	hero: { padding: 28, borderRadius: 32, marginBottom: 28 },
	heroTitle: { fontSize: 32, fontWeight: '800' },
	heroSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500' },
	card: { padding: 20, borderRadius: 24, marginBottom: 28, borderWidth: 1 },
	sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
	info: { marginBottom: 6, fontSize: 12 },
	switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
	switchLabel: { fontSize: 14, fontWeight: '600' },
	switchHint: { fontSize: 11, marginTop: 2 },
	gridFields: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
	fieldBlock: { width: '46%' },
	fieldLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
	input: { borderWidth: 1, borderRadius: 14, padding: 10, fontSize: 16 },
});