// Display del temporizador - español (AR)
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatDuration } from '@/utils/time';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CircularProgress } from './CircularProgress';

interface Props {
  secondsLeft: number;
  total: number;
  modeLabel: string;
}

export const TimerDisplay: React.FC<Props> = ({
  secondsLeft,
  total,
  modeLabel,
}) => {
  const progress = 1 - secondsLeft / total;
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <CircularProgress
        size={260}
        progress={progress}
        strokeWidth={16}
        progressColor={colors.primary}
        backgroundColor={colors.border}
      />
      <View style={styles.center}>
        <Text style={[styles.mode, { color: colors.textDim }]}>{modeLabel}</Text>
        <Text style={[styles.time, { color: colors.text }]}>{formatDuration(secondsLeft)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  mode: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  time: { fontSize: 54, fontVariant: ['tabular-nums'], fontWeight: '700' },
});
