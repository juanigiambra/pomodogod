import { PrimaryButton } from '@/components/PrimaryButton';
import { useUserStore } from '@/store/userStore';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { actions, loading } = useUserStore();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  async function onLogin() {
    try {
      await actions.signIn(email.trim(), pass);
      Alert.alert('Sesión', 'Inicio correcto');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={styles.input}
      />
      <PrimaryButton label={loading ? '...' : 'Entrar'} onPress={onLogin} disabled={loading} />
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>¿No tenés cuenta?</Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity><Text style={styles.link}>Crear cuenta</Text></TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 8, marginBottom: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchText: { color: '#555', marginRight: 6 },
  link: { color: '#ff5a5f', fontWeight: '600' },
});
