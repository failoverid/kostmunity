import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                {/* Home */}
                <Stack.Screen name="index" />

                {/* Tabs */}
                <Stack.Screen name="(tabs)" />

                {/* Auth Group */}
                <Stack.Screen name="(auth)" />

                {/* Dashboard */}
                <Stack.Screen name="dashboard" />

                {/* Modal */}
                <Stack.Screen
                    name="modal"
                    options={{
                        presentation: 'modal',
                        title: 'Modal',
                        headerShown: true,
                    }}
                />

                {/* Test Auth */}
                <Stack.Screen
                    name="test-auth"
                    options={{
                        title: 'Firebase Auth Test',
                        headerShown: true,
                    }}
                />
            </Stack>

            <StatusBar style="auto" />
        </ThemeProvider>
    );
}