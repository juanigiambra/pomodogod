// Badge de monedas - español (AR)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

interface Props {
  coins: number;
}

export const CoinBadge: React.FC<Props> = ({ coins }) => {
  return (
    <View style={styles.container} accessibilityLabel={`${coins} monedas`}>
      <Text style={styles.coin}>🪙</Text>
      <Text style={styles.text}>{coins}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
    elevation: 2,
  },
  coin: { fontSize: 16 },
  text: { fontWeight: '600', color: theme.colors.text },
});
