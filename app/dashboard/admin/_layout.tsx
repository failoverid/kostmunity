import { Stack } from "expo-router";
import React from "react";

export default function AdminLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="billing" />
            <Stack.Screen name="feedback" />
            <Stack.Screen name="lost-found" />
            <Stack.Screen name="members" />
            <Stack.Screen name="services" />
        </Stack>
    );
}
