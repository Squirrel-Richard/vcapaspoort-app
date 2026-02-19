import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Colors } from '@/constants/Colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // Request notification permissions
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bg.deep }}>
      <StatusBar style="light" backgroundColor={Colors.bg.deep} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg.deep },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="medewerker/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="scanner/index" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
