import { AvatarPreview } from '@/components/AvatarPreview';
import ProgressBar from '@/components/ProgressBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useUserStore } from '@/store/userStore';
import { xpProgress } from '@/utils/xp';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { profile } = useUserStore();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  // Animación de progreso XP (barra de relleno manual)
  const xpSv = useSharedValue(0);
  useEffect(() => {
    if (profile) {
      const prog = xpProgress(profile.xp);
      const pct = prog.current / prog.required;
      xpSv.value = withTiming(pct, { duration: 800, easing: Easing.out(Easing.cubic) });
    }
  }, [profile, xpSv]);

  const prog = profile ? xpProgress(profile.xp) : null;
  const animatedFill = useAnimatedStyle(() => ({
    // Reanimated RN width: allow percentage string cast
    width: `${xpSv.value * 100}%` as any,
  }));

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>      
      <View style={styles.heroWrap}>
        <LinearGradient colors={[colors.primary, '#ff8a5c']} style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.primaryText }]}>Perfil</Text>
          {profile && (
            <View style={styles.avatarWrapper}>
              <AvatarPreview avatar={profile.avatar} />
              <Text style={[styles.levelLabel, { color: colors.primaryText }]}>Nivel {prog?.level}</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {profile ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Progreso XP</Text>
          <Text style={[styles.xpNumbers, { color: colors.textDim }]}>{prog?.current}/{prog?.required} XP</Text>
          <View style={[styles.xpBar, { backgroundColor: colors.border }]}> 
            <Animated.View style={[styles.xpFill, { backgroundColor: colors.primary }, animatedFill]} />
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={[styles.metaLabel, { color: colors.textDim }]}>Monedas</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{profile.coins}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={[styles.metaLabel, { color: colors.textDim }]}>XP Total</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{profile.xp}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={{ marginTop: 24, color: colors.textDim }}>Sin sesión</Text>
      )}

      <View style={styles.linksGrid}>
        <Link href="/(protected)/profile/avatar" asChild>
          <Pressable style={[styles.navCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.cardTitle, { color: colors.text }]}>Avatar</Text>
            <Text style={[styles.cardHint, { color: colors.textDim }]}>Personalizá tu estilo</Text>
          </Pressable>
        </Link>
        <Link href="/(protected)/profile/stats" asChild>
          <Pressable style={[styles.navCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.cardTitle, { color: colors.text }]}>Stats</Text>
            <Text style={[styles.cardHint, { color: colors.textDim }]}>Métricas y sesiones</Text>
          </Pressable>
        </Link>
        <Link href="/(protected)/profile/configuracion" asChild>
          <Pressable style={[styles.navCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.cardTitle, { color: colors.text }]}>Configuración</Text>
            <Text style={[styles.cardHint, { color: colors.textDim }]}>Temas y tiempos</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 120 },
  heroWrap: { marginBottom: 24 },
  hero: { padding: 24, borderRadius: 28, flexDirection: 'row', alignItems: 'center' },
  heroTitle: { fontSize: 34, fontWeight: '800', flex: 1 },
  avatarWrapper: { alignItems: 'center' },
  levelLabel: { marginTop: 6, fontSize: 14, fontWeight: '600' },
  card: { padding: 20, borderRadius: 24, marginTop: 8, borderWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  xpNumbers: { fontSize: 12, marginTop: 4 },
  xpBar: { height: 14, borderRadius: 10, overflow: 'hidden', marginTop: 10 },
  xpFill: { height: '100%', borderRadius: 10 },
  metaRow: { flexDirection: 'row', marginTop: 16, gap: 16 },
  metaBox: { flex: 1 },
  metaLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  linksGrid: { marginTop: 32, gap: 16 },
  navCard: { padding: 20, borderRadius: 24, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardHint: { fontSize: 12, marginTop: 4 },
});
