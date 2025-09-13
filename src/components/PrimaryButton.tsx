// Botón primario reutilizable - español (AR)
import { useAppTheme } from '@/hooks/useAppTheme';
import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  accessibilityLabel?: string;
}

export const PrimaryButton: React.FC<Props> = ({ label, onPress, disabled, loading, variant = 'solid', accessibilityLabel }) => {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => {
        const styleArray: any[] = [
          buttonStyles.base(colors.primary),
          variant === 'outline' && buttonStyles.outline(colors.primary),
          disabled && buttonStyles.disabled,
          pressed && !disabled && { opacity: 0.8 },
        ];
        return styleArray;
      }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.primaryText} />
      ) : (
        <Text
          style={[
            buttonStyles.text(colors.primaryText),
            variant === 'outline' && { color: colors.primary },
          ] as any}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const buttonStyles = {
  base: (bg: string) => ({
    backgroundColor: bg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  }),
  outline: (border: string) => ({
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: border,
  }),
  disabled: { opacity: 0.5 },
  text: (color: string) => ({
    color,
    fontWeight: '600',
    fontSize: 16,
  }),
};
