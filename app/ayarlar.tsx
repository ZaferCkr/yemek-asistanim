import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTema } from '../components/ThemeContext'; // Tema beyni

export default function AyarlarScreen() {
  const router = useRouter();
  const { karanlikMod, toggleTema, tema } = useTema();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={karanlikMod ? "light-content" : "dark-content"} />
      
      {/* Başlık */}
      <View style={[styles.header, { borderBottomColor: tema.border }]}>
        <Text style={[styles.title, { color: tema.yazi }]}>Ayarlar</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={tema.ikon} />
        </TouchableOpacity>
      </View>

      {/* Ayar Seçenekleri */}
      <View style={styles.content}>
        
        {/* Karanlık Mod Anahtarı */}
        <View style={[styles.ayarKutusu, { backgroundColor: tema.kart }]}>
          <View style={styles.satir}>
            <View style={styles.ikonYazi}>
              <Ionicons name="moon" size={24} color={tema.ikon} style={{marginRight: 10}} />
              <Text style={[styles.ayarYazi, { color: tema.yazi }]}>Karanlık Mod</Text>
            </View>
            <Switch 
              value={karanlikMod} 
              onValueChange={toggleTema}
              trackColor={{ false: "#767577", true: "#FF6347" }}
            />
          </View>
        </View>

        {/* Diğer (Görsel) Ayarlar */}
        <View style={[styles.ayarKutusu, { backgroundColor: tema.kart, marginTop: 20 }]}>
          <TouchableOpacity style={styles.satir}>
            <View style={styles.ikonYazi}>
              <Ionicons name="information-circle" size={24} color={tema.ikon} style={{marginRight: 10}} />
              <Text style={[styles.ayarYazi, { color: tema.yazi }]}>Hakkımızda</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={tema.altMetin} />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 20 },
  ayarKutusu: { borderRadius: 15, padding: 15, elevation: 2, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity:0.1 },
  satir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  ikonYazi: { flexDirection: 'row', alignItems: 'center' },
  ayarYazi: { fontSize: 18, fontWeight: '500' }
});