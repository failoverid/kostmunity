import { Stack } from "expo-router";
import React from "react";

export default function ServicesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="feedback" />
            <Stack.Screen name="lost-found" />
            <Stack.Screen name="mitra" />
        </Stack>
    );
}
