import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                {/* Splash Screen - First entry point */}
                <Stack.Screen name="index" />

                {/* Splash Screen */}
                <Stack.Screen name="splash" />

                {/* Landing Page */}
                <Stack.Screen name="landing" />

                {/* Auth Group - Login & Register */}
                <Stack.Screen name="(auth)" />

                {/* Dashboard */}
                <Stack.Screen name="dashboard" />

                {/* Tabs */}
                <Stack.Screen name="(tabs)" />

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
        </AuthProvider>
    );
}