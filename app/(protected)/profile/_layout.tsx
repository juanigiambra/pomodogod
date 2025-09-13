import { useAppTheme } from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Layout stack para subsecciones de perfil con gesto de volver (swipe) habilitado
export default function ProfileStackLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="avatar/index" />
      <Stack.Screen name="stats/index" />
      <Stack.Screen
        name="configuracion/index"
        options={{
          headerShown: true,
          header: () => <ConfigHeader />,
        }}
      />
    </Stack>
  );
}

function ConfigHeader() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[
      styles.headerContainer,
      {
        paddingTop: insets.top + 4, // safe area + small offset
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      },
    ]}> 
      <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityLabel="Volver">
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Configuración</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { padding: 6, borderRadius: 22 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' },
});
