import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Kalıcı hafıza
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTema } from '../../components/ThemeContext';

interface Urun {
  id: string;
  ad: string;
  alindi: boolean;
}

export default function AlisverisScreen() {
  const { tema, karanlikMod } = useTema();
  const [liste, setListe] = useState<Urun[]>([]);
  const [yeniUrun, setYeniUrun] = useState('');

  // 1. UYGULAMA AÇILINCA LİSTEYİ HAFIZADAN ÇEK
  useEffect(() => {
    const yukle = async () => {
      try {
        const kayitliListe = await AsyncStorage.getItem('alisveris_listesi');
        if (kayitliListe) setListe(JSON.parse(kayitliListe));
      } catch (e) { console.error(e); }
    };
    yukle();
  }, []);

  // 2. LİSTEYİ GÜNCELLE VE KAYDET
  const listeyiGuncelle = async (yeniListe: Urun[]) => {
    setListe(yeniListe);
    try {
      await AsyncStorage.setItem('alisveris_listesi', JSON.stringify(yeniListe));
    } catch (e) { console.error(e); }
  };

  const ekle = () => {
    if (yeniUrun.trim() === '') return;
    const urun: Urun = { id: Date.now().toString(), ad: yeniUrun, alindi: false };
    listeyiGuncelle([urun, ...liste]); // En başa ekle
    setYeniUrun('');
    Keyboard.dismiss();
  };

  const isaretle = (id: string) => {
    const yeniListe = liste.map(item => 
      item.id === id ? { ...item, alindi: !item.alindi } : item
    );
    // Alınanları alta gönder, alınmayanları üste çek (Sıralama)
    yeniListe.sort((a, b) => Number(a.alindi) - Number(b.alindi));
    listeyiGuncelle(yeniListe);
  };

  const sil = (id: string) => {
    const yeniListe = liste.filter(item => item.id !== id);
    listeyiGuncelle(yeniListe);
  };

  const hepsiniTemizle = () => {
    Alert.alert("Listeyi Temizle", "Tüm listeyi silmek istediğine emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => listeyiGuncelle([]) }
    ]);
  };

  const renderItem = ({ item }: { item: Urun }) => (
    <View style={[styles.satir, { backgroundColor: tema.kart, opacity: item.alindi ? 0.6 : 1 }]}>
      <TouchableOpacity style={styles.tikAlani} onPress={() => isaretle(item.id)}>
        <Ionicons 
          name={item.alindi ? "checkbox" : "square-outline"} 
          size={24} 
          color={item.alindi ? "#4CAF50" : tema.altMetin} 
        />
        <Text style={[
          styles.urunAdi, 
          { color: tema.yazi, textDecorationLine: item.alindi ? 'line-through' : 'none' }
        ]}>
          {item.ad}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => sil(item.id)} style={styles.silButonu}>
        <Ionicons name="trash-outline" size={20} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={karanlikMod ? "light-content" : "dark-content"} />
      
      <View style={styles.icerik}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.baslik, { color: tema.yazi }]}>🛒 Alışveriş Listesi</Text>
          {liste.length > 0 && (
            <TouchableOpacity onPress={hepsiniTemizle}>
              <Text style={styles.temizleYazi}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* GİRİŞ ALANI */}
        <View style={[styles.inputContainer, { backgroundColor: tema.kart }]}>
          <TextInput
            style={[styles.input, { color: tema.yazi }]}
            placeholder="Ne lazım? (Örn: Süt, Ekmek)"
            placeholderTextColor={tema.altMetin}
            value={yeniUrun}
            onChangeText={setYeniUrun}
            onSubmitEditing={ekle}
          />
          <TouchableOpacity onPress={ekle} style={styles.ekleButon}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* LİSTE */}
        <FlatList
          data={liste}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listeContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.bosDurum}>
              <Ionicons name="cart-outline" size={60} color={tema.altMetin} />
              <Text style={{ color: tema.altMetin, marginTop: 10 }}>Listen bomboş!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  icerik: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  baslik: { fontSize: 24, fontWeight: 'bold' },
  temizleYazi: { color: '#FF6347', fontWeight: 'bold' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 5, marginBottom: 20, elevation: 2, shadowOpacity: 0.1, shadowOffset: {width:0, height:2} },
  input: { flex: 1, height: 50, fontSize: 16 },
  ekleButon: { backgroundColor: '#FF6347', borderRadius: 25, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  
  listeContainer: { paddingBottom: 20 },
  satir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  tikAlani: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  urunAdi: { fontSize: 16, marginLeft: 12, fontWeight: '500' },
  silButonu: { padding: 5 },
  
  bosDurum: { alignItems: 'center', marginTop: 50, opacity: 0.5 }
});