import { Stack } from 'expo-router';
import { FavoriProvider } from '../components/FavoriContext';
import { ThemeProvider } from '../components/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoriProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Giriş Ekranı (Bunu en üste koyduk ki öncelikli olsun) */}
          <Stack.Screen name="login" options={{ headerShown: false }} />

          {/* Ana Uygulama (Tabs) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Ayarlar (Varsa) */}
          <Stack.Screen 
            name="ayarlar" 
            options={{ 
              presentation: 'modal',
              headerShown: false 
            }} 
          />
        </Stack>
      </FavoriProvider>
    </ThemeProvider>
  );
}