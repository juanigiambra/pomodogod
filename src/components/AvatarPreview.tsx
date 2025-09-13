// Preview avatar simple - español (AR)
import { theme } from '@/styles/theme';
import { AvatarData } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

interface Props {
  avatar?: AvatarData;
  size?: number;
}

export const AvatarPreview: React.FC<Props> = ({ avatar, size = 120 }) => {
  const bgColor = avatar?.background ? '#b5e48c' : '#eee';
  const hairColor = avatar?.hair ? '#ef476f' : '#888';
  const outfitColor = avatar?.outfit ? '#118ab2' : '#666';
  const accColor = avatar?.accessory ? '#ffd166' : 'transparent';

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          rx={16}
          fill={bgColor}
          stroke="#ccc"
        />
        <Circle
          cx={size / 2}
          cy={size / 2 - 10}
          r={size / 4}
          fill="#ffe0bd"
          stroke="#d9b08c"
          strokeWidth={2}
        />
        <Rect
          x={size / 2 - size / 6}
          y={size / 2 + 10}
          width={(size / 6) * 2}
          height={size / 3}
          fill={outfitColor}
          rx={10}
        />
        <Circle
          cx={size / 2}
          cy={size / 2 - 35}
          r={size / 5}
          fill={hairColor}
          opacity={0.9}
        />
        {accColor !== 'transparent' && (
          <Circle
            cx={size / 2 + 20}
            cy={size / 2 - 10}
            r={12}
            fill={accColor}
            stroke="#333"
            strokeWidth={2}
          />
        )}
      </Svg>
      <Text style={styles.caption}>Avatar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  caption: {
    marginTop: 8,
    color: theme.colors.textSecondary,
  },
});
