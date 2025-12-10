import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavori } from '../../components/FavoriContext';
import { useTema } from '../../components/ThemeContext'; // TEMA BEYNİ EKLENDİ

interface Yemek {
  id: string;
  yemekAdi: string;
  kalori: string;
  sure: string;
  resim: any; 
  aciklama?: string;
  malzemeler: string[];
  tarif: string[];
  pufNoktasi?: string;
}

export default function FavorilerScreen() {
  const { favoriler, favorile } = useFavori();
  const { tema, karanlikMod } = useTema(); // RENKLERİ ÇAĞIRDIK
  
  const [secilenYemek, setSecilenYemek] = useState<Yemek | null>(null);
  const [modalAcik, setModalAcik] = useState(false);

  const detayAc = (yemek: Yemek) => {
    setSecilenYemek(yemek);
    setModalAcik(true);
  };

  const sil = (yemek: Yemek) => {
    Alert.alert("Favorilerden Çıkar", "Bu yemeği silmek istiyor musun?", [
      { text: "Vazgeç", style: "cancel" },
      { text: "Sil", style: 'destructive', onPress: () => favorile(yemek) }
    ]);
  };

  const kartCiz = ({ item }: { item: Yemek }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => detayAc(item)}>
      <View style={[styles.kart, { backgroundColor: tema.kart, shadowColor: "#000" }]}>
        <Image source={item.resim} style={styles.resim} resizeMode="cover" />
        
        <View style={styles.bilgi}>
          <Text style={[styles.baslik, { color: tema.yazi }]}>{item.yemekAdi}</Text>
          <Text style={[styles.detay, { color: tema.altMetin }]}>{item.kalori} • {item.sure}</Text>
        </View>
        
        <TouchableOpacity onPress={() => sil(item)} style={styles.silButonu}>
          <Ionicons name="trash-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={karanlikMod ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: tema.kart, borderBottomColor: tema.border }]}>
        <Text style={[styles.headerTitle, { color: tema.yazi }]}>❤️ Favorilerim</Text>
        <Text style={[styles.headerSubtitle, { color: tema.altMetin }]}>{favoriler.length} tarif kayıtlı.</Text>
      </View>

      {favoriler.length > 0 ? (
        <FlatList
          data={favoriler}
          renderItem={kartCiz}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.liste}
        />
      ) : (
        <View style={styles.bosDurum}>
          <Ionicons name="heart-dislike-outline" size={80} color={tema.altMetin} />
          <Text style={[styles.bosMetin, { color: tema.yazi }]}>Henüz favorin yok.</Text>
          <Text style={[styles.bosAltMetin, { color: tema.altMetin }]}>Günün menüsünden beğendiklerini ekle!</Text>
        </View>
      )}

      {/* DETAY MODALI (Karanlık Mod Uyumlu) */}
      <Modal animationType="slide" transparent={true} visible={modalAcik} onRequestClose={() => setModalAcik(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: tema.kart }]}>
            {secilenYemek && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={secilenYemek.resim} style={styles.modalImage} resizeMode="cover" />
                
                <TouchableOpacity style={[styles.kapatButonu, { backgroundColor: tema.kart }]} onPress={() => setModalAcik(false)}>
                  <Ionicons name="close" size={24} color={tema.ikon} />
                </TouchableOpacity>
                
                <View style={styles.modalTextContainer}>
                  <Text style={[styles.modalTitle, { color: tema.yazi }]}>{secilenYemek.yemekAdi}</Text>
                  <Text style={[styles.modalSubtitle, { color: tema.altMetin }]}>{secilenYemek.kalori} • {secilenYemek.sure}</Text>

                  {secilenYemek.pufNoktasi && (
                    <View style={[styles.pufNoktasiKutu, { backgroundColor: karanlikMod ? '#333' : '#FFF8E1', borderColor: karanlikMod ? '#444' : '#FFE082' }]}>
                      <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
                          <Ionicons name="bulb" size={20} color="#FFD700" />
                          <Text style={[styles.pufBaslik, { color: tema.yazi }]}> Şefin Sırrı:</Text>
                      </View>
                      <Text style={[styles.pufYazi, { color: tema.altMetin }]}>{secilenYemek.pufNoktasi}</Text>
                    </View>
                  )}

                  <View style={styles.bolum}>
                    <Text style={[styles.bolumBasligi, { color: tema.yazi }]}>🛒 Malzemeler</Text>
                    {secilenYemek.malzemeler.map((m, i) => (
                        <View key={i} style={styles.maddeSatiri}>
                            <Ionicons name="ellipse" size={8} color="#FF6347" style={{marginTop:6, marginRight:8}} />
                            <Text style={[styles.maddeIsareti, { color: tema.yazi }]}>{m}</Text>
                        </View>
                    ))}
                  </View>

                  <View style={styles.bolum}>
                    <Text style={[styles.bolumBasligi, { color: tema.yazi }]}>🔪 Hazırlanışı</Text>
                    {secilenYemek.tarif.map((t, i) => (
                        <View key={i} style={styles.tarifSatiri}>
                            <Text style={styles.adimNo}>{i+1}</Text>
                            <Text style={[styles.tarifAdimi, { color: tema.yazi }]}>{t}</Text>
                        </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { padding: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, marginTop: 5 },
  liste: { padding: 15 },
  kart: { flexDirection: 'row', borderRadius: 15, marginBottom: 15, padding: 10, alignItems: 'center', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  resim: { width: 70, height: 70, borderRadius: 10, marginRight: 15 },
  bilgi: { flex: 1 },
  baslik: { fontSize: 16, fontWeight: 'bold' },
  detay: { fontSize: 13, marginTop: 3 },
  silButonu: { padding: 10 },
  bosDurum: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  bosMetin: { fontSize: 18, marginTop: 15, fontWeight: 'bold' },
  bosAltMetin: { fontSize: 14, marginTop: 5 },
  
  // Modal Stilleri
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '90%', overflow: 'hidden' },
  modalImage: { width: '100%', height: 250 },
  kapatButonu: { position: 'absolute', top: 20, right: 20, width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 5 },
  modalTextContainer: { padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  modalSubtitle: { fontSize: 16, marginBottom: 20 },
  bolum: { marginBottom: 20 },
  bolumBasligi: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 2, borderBottomColor: '#FFD700', alignSelf: 'flex-start' },
  maddeSatiri: { flexDirection: 'row', marginBottom: 8, paddingRight: 10 },
  maddeIsareti: { fontSize: 15, lineHeight: 22, flex: 1 },
  tarifSatiri: { flexDirection: 'row', marginBottom: 15 },
  adimNo: { width: 28, height: 28, backgroundColor: '#FF6347', color: 'white', textAlign: 'center', lineHeight: 28, borderRadius: 14, fontWeight: 'bold', marginRight: 12, marginTop: 2 },
  tarifAdimi: { fontSize: 15, lineHeight: 22, flex: 1 },
  pufNoktasiKutu: { padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1 },
  pufBaslik: { fontWeight: 'bold', fontSize: 16 },
  pufYazi: { fontSize: 14 }
});