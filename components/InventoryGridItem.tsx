import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { InventoryItem } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
  item: InventoryItem;
  cardSize: number;
  onEquip(item: InventoryItem): Promise<void> | void;
}

const InventoryGridItem = React.memo(function InventoryGridItem({ item, cardSize, onEquip }: Props) {
  const { colors } = useAppTheme();
  const pulse = useSharedValue(0);
  const isEquipped = item.equipped;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isEquipped ? 1 + pulse.value * 0.05 : 1 }],
    shadowOpacity: 0.08 + pulse.value * 0.15,
  }));

  const handlePress = useCallback(async () => {
    await onEquip(item);
    pulse.value = 0;
    pulse.value = withSequence(
      withTiming(1, { duration: 320, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 400 })
    );
  }, [item, onEquip, pulse]);

  return (
    <Animated.View style={[styles.wrap, { width: cardSize }, animStyle]}> 
      <Pressable onPress={handlePress} style={[styles.item, { backgroundColor: colors.card, borderColor: isEquipped ? colors.primary : colors.border }]}> 
        <Text style={[styles.itemText, { color: colors.text }]} numberOfLines={1}>{item.itemId}</Text>
        <Text style={[styles.itemCat, { color: colors.textDim }]}>{item.category}</Text>
        {isEquipped && <Text style={[styles.equippedTag, { color: colors.primary }]}>Equipado</Text>}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: {},
  item: { padding: 14, borderWidth: 2, borderRadius: 20, justifyContent: 'center', alignItems: 'flex-start', gap: 4, minHeight: 90 },
  itemText: { fontWeight: '600', fontSize: 14 },
  itemCat: { fontSize: 11 },
  equippedTag: { position: 'absolute', right: 10, top: 10, fontWeight: '700', fontSize: 10 },
});

export default InventoryGridItem;
