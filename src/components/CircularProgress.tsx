// Progreso circular animado - español (AR)
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps, Easing } from 'react-native-reanimated';

// Crear componente animado para Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  size: number;
  strokeWidth?: number;
  progress: number; // 0..1
  backgroundColor?: string;
  progressColor?: string;
  animate?: boolean;
  durationMs?: number;
  easing?: (value: number) => number;
}

export const CircularProgress: React.FC<Props> = ({
  size,
  strokeWidth = 10,
  progress,
  backgroundColor = '#eee',
  progressColor = '#ff5a5f',
  animate = true,
  durationMs = 600,
  easing = Easing.out(Easing.cubic),
}) => {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;

  const progressSv = useSharedValue(progress);

  useEffect(() => {
    if (animate) {
      // Si reinicia (salta hacia atrás) usar duración corta para no ser molesto
      const backwards = progress < progressSv.value;
      progressSv.value = withTiming(progress, { duration: backwards ? 300 : durationMs, easing });
    } else {
      progressSv.value = progress;
    }
  }, [progress, animate, durationMs, easing, progressSv]);

  const animatedProps = useAnimatedProps(() => {
    const offset = circ - progressSv.value * circ;
    return { strokeDashoffset: offset } as any;
  });

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circ} ${circ}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};
