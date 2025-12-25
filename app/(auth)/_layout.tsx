import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Member Auth */}
            <Stack.Screen name="login-member" />
            <Stack.Screen name="register-member" />

            {/* Admin Auth */}
            <Stack.Screen name="login-admin" />
            <Stack.Screen name="register-admin" />

            {/* Legacy - Keep for backward compatibility */}
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="success-login" />
            <Stack.Screen name="success-register" />
        </Stack>
    );
}
