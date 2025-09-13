import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const ICONS: Record<string, string> = {
  index: 'timer-outline',
  shop: 'cart-outline',
  profile: 'person-circle-outline',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useAppTheme();
  // Filtramos sólo las rutas permitidas explícitamente
  const allowed = ['index', 'shop', 'profile'];
  const visibleRoutes = state.routes.filter(r => allowed.includes(r.name));
  const indicatorX = useSharedValue(0);
  const itemWidth = 1 / visibleRoutes.length;

  useEffect(() => {
    // Necesitamos el índice relativo dentro de visibleRoutes
    const relativeIndex = visibleRoutes.findIndex(r => r.key === state.routes[state.index].key);
    if (relativeIndex >= 0) {
      indicatorX.value = withTiming(relativeIndex * itemWidth, { duration: 300 });
    }
  }, [state.index, itemWidth, indicatorX, visibleRoutes]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorX.value * 100}%`,
    width: `${itemWidth * 100}%`,
  }));

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
      <View style={[styles.container, { backgroundColor: colors.card, shadowColor: '#000' }]}> 
        <Animated.View style={[styles.indicator, { backgroundColor: colors.primary }, indicatorStyle]} />
        {visibleRoutes.map((route) => {
          const absoluteIndex = state.routes.findIndex(r => r.key === route.key);
          const focused = state.index === absoluteIndex;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };
          const label = descriptors[route.key]?.options.title || route.name;
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item} accessibilityRole="button" accessibilityLabel={label}>
              <Ionicons name={(ICONS as any)[route.name] || 'ellipse-outline'} size={24} color={focused ? colors.primaryText : colors.textDim} />
              <Text style={[styles.label, { color: focused ? colors.primaryText : colors.textDim }]} numberOfLines={1}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingBottom: Platform.select({ ios: 24, default: 12 }), paddingTop: 4 },
  container: { flexDirection: 'row', marginHorizontal: spacing.lg, borderRadius: radius.xl, overflow: 'hidden', position: 'relative' },
  indicator: { position: 'absolute', top: 0, bottom: 0, borderRadius: radius.xl, opacity: 0.18 },
  item: { flex: 1, paddingVertical: 10, alignItems: 'center', gap: 4 },
  label: { fontSize: 11, fontWeight: '600' },
});

export default CustomTabBar;
