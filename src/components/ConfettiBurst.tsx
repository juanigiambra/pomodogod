// Simple confetti burst - español (AR)
import { useAppTheme } from '@/hooks/useAppTheme';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ConfettiBurstProps {
  triggerKey: number; // change to retrigger animation
  size?: number;
  count?: number;
  duration?: number;
}

const PARTICLES = 12;

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ triggerKey, size = 8, count = PARTICLES, duration = 1200 }) => {
  const { colors } = useAppTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) });
  }, [triggerKey]);

  const particles = Array.from({ length: count });

  return (
    <>
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / count;
        const dist = 60 + (i % 3) * 16;
        const particleStyle = useAnimatedStyle(() => {
          const p = progress.value;
          const r = dist * p;
          const opacity = interpolate(p, [0, 0.7, 1], [1, 1, 0]);
          const scale = interpolate(p, [0, 1], [0.6, 1]);
          return {
            transform: [
              { translateX: r * Math.cos(angle) },
              { translateY: r * Math.sin(angle) },
              { rotate: `${angle + p * 3}rad` },
              { scale },
            ],
            opacity,
          };
        });
  const bg = i % 2 === 0 ? colors.primary : colors.primaryText;
        return <Animated.View key={i} style={[styles.particle, { width: size, height: size, backgroundColor: bg }, particleStyle]} />;
      })}
    </>
  );
};

const styles = StyleSheet.create({
  particle: { position: 'absolute', borderRadius: 20 },
});
