import CustomTabBar from '@/components/CustomTabBar';
import { useAuthListener } from '@/hooks/useAuthListener';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  useAuthListener();
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} /> }>
      <Tabs.Screen name="index" options={{ title: 'Timer' }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
