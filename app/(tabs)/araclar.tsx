import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';
import { useTema } from '../../components/ThemeContext';

// --- HAZIR ZAMANLAYICILAR ---
const ZAMANLAYICILAR = [
  { id: 1, ad: 'Rafadan Yumurta', sure: 3 * 60, ikon: 'egg' }, // 3 dk
  { id: 2, ad: 'Katı Yumurta', sure: 7 * 60, ikon: 'egg-outline' }, // 7 dk
  { id: 3, ad: 'Makarna (Al Dente)', sure: 8 * 60, ikon: 'restaurant' }, // 8 dk
  { id: 4, ad: 'Kek Pişirme', sure: 35 * 60, ikon: 'cafe' }, // 35 dk
  { id: 5, ad: 'Çay Demleme', sure: 15 * 60, ikon: 'water' }, // 15 dk
];

// --- ÖLÇÜ BİRİMLERİ ---
const DONUSUMLER: { [key: string]: number } = {
  un: 110,    // 1 bardak un = 110g
  seker: 200, // 1 bardak şeker = 200g
  su: 200,    // 1 bardak su = 200ml
  yag: 180,   // 1 bardak yağ = 180g
};

export default function AraclarScreen() {
  const { tema, karanlikMod } = useTema();

  // ZAMANLAYICI STATE'LERİ
  const [kalanSure, setKalanSure] = useState(0);
  const [aktifTimer, setAktifTimer] = useState<any>(null);
  const [seciliTimerAd, setSeciliTimerAd] = useState('');

  // ÇEVİRİCİ STATE'LERİ
  const [bardakSayisi, setBardakSayisi] = useState('');
  const [seciliMalzeme, setSeciliMalzeme] = useState<'un' | 'seker' | 'su' | 'yag'>('un');

  // --- ZAMANLAYICI MANTIĞI ---
  useEffect(() => {
    if (kalanSure > 0 && aktifTimer) {
      // Süre sayıyor...
    } else if (kalanSure === 0 && aktifTimer) {
      // SÜRE BİTTİ!
      clearInterval(aktifTimer);
      setAktifTimer(null);
      Vibration.vibrate([500, 500, 500]); // Bip bip bip titreşim
      Alert.alert("⏰ Süre Doldu!", `${seciliTimerAd} hazır olabilir.`);
    }
  }, [kalanSure]);

  const sureyiBaslat = (saniye: number, ad: string) => {
    if (aktifTimer) clearInterval(aktifTimer);
    
    setSeciliTimerAd(ad);
    setKalanSure(saniye);

    const timer = setInterval(() => {
      setKalanSure((prev) => prev - 1);
    }, 1000);
    setAktifTimer(timer);
  };

  const sureyiDurdur = () => {
    if (aktifTimer) clearInterval(aktifTimer);
    setAktifTimer(null);
    setKalanSure(0);
  };

  const formatSure = (saniye: number) => {
    const dk = Math.floor(saniye / 60);
    const sn = saniye % 60;
    return `${dk < 10 ? '0' : ''}${dk}:${sn < 10 ? '0' : ''}${sn}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={karanlikMod ? "light-content" : "dark-content"} />
      
      {/* KLAVYE DÜZELTMESİ: KeyboardAvoidingView EKLEMESİ */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80} // Klavye payı
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* --- BÖLÜM 1: MUTFAK SAATİ --- */}
          <View style={[styles.kutu, { backgroundColor: tema.kart }]}>
            <Text style={[styles.baslik, { color: tema.yazi }]}>⏱️ Mutfak Saati</Text>
            
            <View style={styles.sayacAlani}>
              <Text style={styles.sayacYazi}>
                {kalanSure > 0 ? formatSure(kalanSure) : "00:00"}
              </Text>
              {kalanSure > 0 && (
                <TouchableOpacity onPress={sureyiDurdur} style={styles.iptalButonu}>
                  <Text style={styles.iptalYazi}>İptal Et</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.timerGrid}>
              {ZAMANLAYICILAR.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.timerButon, { borderColor: tema.border }]}
                  onPress={() => sureyiBaslat(item.sure, item.ad)}
                >
                  <Ionicons name={item.ikon as any} size={24} color="#FF6347" />
                  <Text style={[styles.timerYazi, { color: tema.yazi }]}>{item.ad}</Text>
                  <Text style={{ fontSize:10, color:tema.altMetin }}>{item.sure / 60} dk</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- BÖLÜM 2: ÖLÇÜ ÇEVİRİCİ --- */}
          <View style={[styles.kutu, { backgroundColor: tema.kart, marginTop: 20 }]}>
            <Text style={[styles.baslik, { color: tema.yazi }]}>⚖️ Ölçü Çevirici</Text>
            <Text style={[styles.aciklama, { color: tema.altMetin }]}>Su bardağı ölçüsünü grama çevir.</Text>

            <View style={styles.tabContainer}>
              {Object.keys(DONUSUMLER).map((key) => (
                <TouchableOpacity 
                  key={key}
                  style={[
                    styles.tabButon, 
                    seciliMalzeme === key && { backgroundColor: '#FF6347', borderColor: '#FF6347' }
                  ]}
                  onPress={() => setSeciliMalzeme(key as any)}
                >
                  <Text style={[styles.tabYazi, seciliMalzeme === key && { color: 'white' }]}>
                    {key === 'un' ? 'Un' : key === 'seker' ? 'Şeker' : key === 'su' ? 'Su/Süt' : 'Yağ'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.ceviriciRow}>
              <View style={styles.girisKutusu}>
                <TextInput 
                  style={[styles.input, { color: tema.yazi, borderColor: tema.border }]}
                  placeholder="1"
                  placeholderTextColor={tema.altMetin}
                  keyboardType="numeric"
                  value={bardakSayisi}
                  onChangeText={setBardakSayisi}
                  textAlign="center"
                />
                <Text style={{ color: tema.altMetin, marginTop: 5 }}>Bardak</Text>
              </View>

              <Ionicons name="arrow-forward" size={24} color={tema.altMetin} />

              <View style={styles.sonucKutusu}>
                <Text style={styles.sonucYazi}>
                  {bardakSayisi ? Math.round(parseFloat(bardakSayisi) * DONUSUMLER[seciliMalzeme]) : 0}
                </Text>
                <Text style={{ color: tema.altMetin, marginTop: 5 }}>
                  {seciliMalzeme === 'su' ? 'Mililitre (ml)' : 'Gram (g)'}
                </Text>
              </View>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  scrollContainer: { padding: 20, paddingBottom: 50 },
  
  kutu: { borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.1, elevation: 3 },
  baslik: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  aciklama: { fontSize: 14, marginBottom: 15 },

  // Sayaç Stilleri
  sayacAlani: { alignItems: 'center', marginBottom: 20 },
  sayacYazi: { fontSize: 48, fontWeight: 'bold', color: '#FF6347', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  iptalButonu: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#ffebee', borderRadius: 20 },
  iptalYazi: { color: '#FF3B30', fontWeight: '600' },

  timerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timerButon: { width: '31%', aspectRatio: 1, borderWidth: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  timerYazi: { fontSize: 12, fontWeight: '600', marginTop: 5, textAlign: 'center' },

  // Çevirici Stilleri
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tabButon: { flex: 1, alignItems: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginHorizontal: 2 },
  tabYazi: { fontSize: 12, fontWeight: '600', color: '#888' },

  ceviriciRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  girisKutusu: { alignItems: 'center', width: '35%' },
  sonucKutusu: { alignItems: 'center', width: '35%' },
  input: { width: '100%', height: 50, borderWidth: 1, borderRadius: 12, fontSize: 24, fontWeight: 'bold' },
  sonucYazi: { fontSize: 32, fontWeight: 'bold', color: '#FF6347' }
});