import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

export default function Index() {
  // Jika web, redirect ke homepage
  if (Platform.OS === 'web') {
    return <Redirect href="/home" />;
  }
  
  // Jika mobile, redirect ke splash
  return <Redirect href="/splash" />;
}
