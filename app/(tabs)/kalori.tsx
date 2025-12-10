import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTema } from '../../components/ThemeContext';

const AI_URL = "https://text.pollinations.ai/";

const YEREL_DB = [
  { k: ['yumurta'], ad: '🥚 Haşlanmış Yumurta', kal: 75 },
  { k: ['ekmek'], ad: '🍞 1 Dilim Ekmek', kal: 70 },
  { k: ['lahmacun'], ad: '🍕 Lahmacun', kal: 450 },
  { k: ['muz'], ad: '🍌 Muz', kal: 100 },
];

export default function KaloriScreen() {
  const { tema } = useTema();

  const [toplamKalori, setToplamKalori] = useState(0);
  const [bugunYenenler, setBugunYenenler] = useState<{id: string, ad: string, kalori: number, miktar: string, birim: string}[]>([]);
  
  const [arananUrun, setArananUrun] = useState('');
  const [miktar, setMiktar] = useState('');
  const [seciliBirim, setSeciliBirim] = useState<'adet' | 'gram'>('adet'); 
  
  const [yukleniyor, setYukleniyor] = useState(false);
  const [durumMesaji, setDurumMesaji] = useState('Hesapla ve Ekle 🔎');

  // BİRİM DEĞİŞTİRİNCE KUTUYU TEMİZLE
  const birimDegistir = (yeniBirim: 'adet' | 'gram') => {
    setSeciliBirim(yeniBirim);
    setMiktar('');
  };

  const akilliArama = async () => {
    Keyboard.dismiss();
    const aranan = arananUrun.trim().toLowerCase();
    
    // Miktar boşsa varsayılan ata
    const girilenMiktar = parseFloat(miktar) || (seciliBirim === 'adet' ? 1 : 100); 

    if (aranan === '') {
      Alert.alert("Eksik Bilgi", "Lütfen bir ürün adı yazın.");
      return;
    }

    setYukleniyor(true);
    setDurumMesaji("Hesaplanıyor...");

    if (seciliBirim === 'adet') {
      const yerelSonuc = YEREL_DB.find(item => item.k.some(key => key.includes(aranan) || aranan.includes(key)));
      if (yerelSonuc) {
        ekleListeye(yerelSonuc.ad, yerelSonuc.kal, girilenMiktar, 'Hızlı');
        setYukleniyor(false);
        setDurumMesaji("Hesapla ve Ekle 🔎");
        return;
      }
    }

    try {
      let prompt = "";
      
      if (seciliBirim === 'gram') {
        prompt = `GÖREV: "${arananUrun}" yiyeceğinin 100 gramı ortalama kaç kaloridir?
        KURALLAR: Sadece tek bir sayı ver (Örn: 300). Yazı yazma.`;
      } else {
        prompt = `GÖREV: "${arananUrun}" yiyeceğinin 1 porsiyonu (veya 1 adedi) ortalama kaç kaloridir?
        KURALLAR: Sadece tek bir sayı ver (Örn: 300). Yazı yazma.`;
      }
      
      const url = `${AI_URL}${encodeURIComponent(prompt)}`;
      const response = await fetch(url);
      const aiCevabi = await response.text();
      
      const bulunanSayi = aiCevabi.match(/\d+/);
      const bazKalori = bulunanSayi ? parseInt(bulunanSayi[0]) : 0;

      if (bazKalori > 0) {
        ekleListeye(arananUrun, bazKalori, girilenMiktar, 'Yapay Zeka');
      } else {
        Alert.alert("Bulunamadı", "Bunu hesaplayamadım. Daha net bir isim yazar mısın?");
      }

    } catch (error) {
      Alert.alert("Hata", "İnternet bağlantısında sorun var.");
    } finally {
      setYukleniyor(false);
      setDurumMesaji("Hesapla ve Ekle 🔎");
    }
  };

  const ekleListeye = (isim: string, bazKalori: number, miktar: number, kaynak: string) => {
    let toplamDeger = 0;

    if (seciliBirim === 'gram') {
      toplamDeger = Math.round((bazKalori / 100) * miktar);
    } else {
      toplamDeger = Math.round(bazKalori * miktar);
    }

    const yeniYemek = {
      id: Date.now().toString(),
      ad: isim,
      kalori: toplamDeger,
      miktar: miktar.toString(),
      birim: seciliBirim
    };

    setBugunYenenler(prev => [yeniYemek, ...prev]);
    setToplamKalori(prev => prev + toplamDeger);
    setArananUrun('');
    setMiktar('');
  };

  const sil = (id: string, kalori: number) => {
    setBugunYenenler(prev => prev.filter(item => item.id !== id));
    setToplamKalori(prev => prev - kalori);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={tema.arkaPlan === '#121212' ? "light-content" : "dark-content"} />
      
      <View style={styles.icerik}>
        {/* ÖZET KARTI */}
        <View style={[styles.ozetKarti, { backgroundColor: tema.kart }]}>
          <Text style={[styles.baslik, { color: tema.altMetin }]}>Bugünkü Enerjin</Text>
          <Text style={styles.kaloriSayisi}>{toplamKalori}</Text>
          <Text style={styles.birim}>kcal</Text>
        </View>

        {/* GİRİŞ ALANI */}
        <View style={[styles.girisAlani, { backgroundColor: tema.kart }]}>
          
          <View style={styles.birimSecici}>
            <TouchableOpacity 
              style={[styles.birimButon, seciliBirim === 'adet' && { backgroundColor: '#FF6347', borderColor: '#FF6347' }]}
              onPress={() => birimDegistir('adet')}
            >
              <Text style={[styles.birimYazi, seciliBirim === 'adet' && { color: 'white' }]}>Adet / Porsiyon</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.birimButon, seciliBirim === 'gram' && { backgroundColor: '#FF6347', borderColor: '#FF6347' }]}
              onPress={() => birimDegistir('gram')}
            >
              <Text style={[styles.birimYazi, seciliBirim === 'gram' && { color: 'white' }]}>Gram (g)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSatiri}>
            <TextInput 
              style={[styles.input, { flex: 1, color: tema.yazi, borderColor: tema.border }]} 
              placeholder={seciliBirim === 'gram' ? "Örn: Mantı..." : "Örn: Lahmacun..."}
              placeholderTextColor={tema.altMetin}
              value={arananUrun}
              onChangeText={setArananUrun}
            />
            {/* MİKTAR KUTUSU GENİŞLETİLDİ VE SABİT BOYUT VERİLDİ */}
            <TextInput 
              style={[styles.input, { width: 100, marginLeft: 10, color: tema.yazi, borderColor: tema.border, textAlign:'center' }]} 
              placeholder={seciliBirim === 'gram' ? "Gr" : "Adet"}
              placeholderTextColor={tema.altMetin}
              keyboardType="numeric"
              value={miktar}
              onChangeText={setMiktar}
            />
          </View>

          <TouchableOpacity style={styles.ekleButonu} onPress={akilliArama} disabled={yukleniyor}>
            {yukleniyor ? <ActivityIndicator color="white" /> : <Text style={styles.ekleYazi}>{durumMesaji}</Text>}
          </TouchableOpacity>
        </View>

        <Text style={[styles.altBaslik, { color: tema.yazi, marginTop: 20 }]}>Bugün Yediklerim</Text>
        
        <FlatList
          data={bugunYenenler}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.listeElemani, { backgroundColor: tema.kart }]}>
              <View style={{flex:1}}>
                <Text style={[styles.listeYazi, { color: tema.yazi }]}>{item.ad}</Text>
                <Text style={{fontSize:12, color:tema.altMetin}}>
                  {item.miktar} {item.birim === 'gram' ? 'gram' : 'adet'}
                </Text>
              </View>
              <View style={{alignItems:'flex-end', marginRight:10}}>
                 <Text style={styles.listeKalori}>{item.kalori}</Text>
                 <Text style={{fontSize:10, color:tema.altMetin}}>kcal</Text>
              </View>
              <TouchableOpacity onPress={() => sil(item.id, item.kalori)}>
                <Ionicons name="trash-outline" size={20} color="#FF6347" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{color:tema.altMetin, textAlign:'center', marginTop:20}}>Henüz bir şey eklemedin.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  icerik: { flex: 1, padding: 20 },
  ozetKarti: { padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 20, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1 },
  baslik: { fontSize: 16, marginBottom: 5 },
  kaloriSayisi: { fontSize: 50, fontWeight: 'bold', color: '#FF6347' },
  birim: { fontSize: 16, color: '#FF6347' },
  girisAlani: { padding: 15, borderRadius: 15, elevation: 2 },
  birimSecici: { flexDirection: 'row', marginBottom: 15 },
  birimButon: { flex: 1, padding: 8, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginRight: 5 },
  birimYazi: { fontWeight: '600', color: '#888' },
  altBaslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  inputSatiri: { flexDirection: 'row' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  ekleButonu: { backgroundColor: '#FF6347', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  ekleYazi: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listeElemani: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 8, elevation: 1 },
  listeYazi: { fontSize: 16, fontWeight: '500' },
  listeKalori: { fontWeight: 'bold', color: '#FF6347', fontSize: 18 },
});