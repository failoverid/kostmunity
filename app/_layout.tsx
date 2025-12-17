import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                {/* Halaman utama */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Modal */}
                <Stack.Screen
                    name="modal"
                    options={{
                        presentation: 'modal',
                        title: 'Modal',
                    }}
                />

                {/* Onboarding (kalau ada) */}
                <Stack.Screen
                    name="onboarding"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            <StatusBar style="auto" />
        </ThemeProvider>
    );
}