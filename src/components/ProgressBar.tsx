import { useAppTheme } from '@/hooks/useAppTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props { value: number; max: number; height?: number; }

export const ProgressBar: React.FC<Props> = ({ value, max, height = 10 }) => {
  const { colors } = useAppTheme();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={[styles.bg, { backgroundColor: colors.border, height, borderRadius: height / 2 }]}> 
      <View style={{ backgroundColor: colors.primary, width: `${pct}%`, flex: 1, borderRadius: height / 2 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  bg: { width: '100%', overflow: 'hidden' },
});

export default ProgressBar;
