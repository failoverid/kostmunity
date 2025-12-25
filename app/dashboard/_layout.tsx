import { Stack } from "expo-router";
import React from "react";

export default function DashboardLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="member" />
            <Stack.Screen name="admin" />
        </Stack>
    );
}
