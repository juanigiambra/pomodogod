import { useAuthListener } from '@/hooks/useAuthListener';
import { useUserStore } from '@/store/userStore';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function ProtectedLayout() {
  useAuthListener();
  const { uid } = useUserStore();
  if (!uid) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Slot />;
}
