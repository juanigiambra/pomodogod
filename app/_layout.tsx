import Loader from '@/components/Loader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthListener } from '@/hooks/useAuthListener';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const { initializing } = useAuthListener();
  const { colors } = useAppTheme();

  if (initializing) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </View>
  );
}

