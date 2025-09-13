import { useUserStore } from '@/store/userStore';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  const { uid } = useUserStore();
  if (uid) {
    return <Redirect href="/(protected)/(tabs)" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
