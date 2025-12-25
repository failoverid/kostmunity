import { Stack } from 'expo-router';

export default function RegisterMemberLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
