// Ajustes (solo cierre de sesión ahora) - español (AR)
import { PrimaryButton } from '@/components/PrimaryButton';
import { useUserStore } from '@/store/userStore';
import { Link } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { uid, profile, actions } = useUserStore();

  async function doSignOut() {
    await actions.signOut();
    Alert.alert('Sesión', 'Cerraste sesión.');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      {uid && profile && (
        <View style={styles.card}>
          <Text style={styles.info}>UID: {uid}</Text>
          <Text style={styles.info}>Nivel: {profile.level} | XP: {profile.xp}</Text>
          <PrimaryButton label="Cerrar Sesión" onPress={doSignOut} variant="outline" />
        </View>
      )}
      {!uid && (
        <View style={styles.card}>
          <Text style={styles.info}>No has iniciado sesión.</Text>
          <Link href="/(auth)/login" asChild>
            <PrimaryButton label="Ir a Login" onPress={() => {}} />
          </Link>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 10, marginBottom: 16 },
  info: { color: '#555', marginBottom: 6 },
});
