import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTema } from '../../components/ThemeContext';

const BASE_URL = "https://text.pollinations.ai/";

interface Mesaj {
  id: string;
  text: string;
  gonderen: 'kullanici' | 'ai';
  resim?: string;
}

export default function AIChatScreen() {
  const { tema, karanlikMod } = useTema();
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([
    { id: '1', text: 'Merhaba! Ben AI Şef. 👨‍🍳\nMalzemeleri yaz, sana hemen kısa bir tarif vereyim.', gonderen: 'ai' }
  ]);
  const [yazi, setYazi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  }, [mesajlar, yukleniyor]);

  const resimSec = async () => {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (izin.status !== 'granted') {
      Alert.alert("İzin Gerekli", "Fotoğraf seçmek için galeri izni vermelisin.");
      return;
    }

    let sonuc = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!sonuc.canceled) {
      const resimMesaji: Mesaj = {
        id: Date.now().toString(),
        text: '',
        gonderen: 'kullanici',
        resim: sonuc.assets[0].uri
      };
      setMesajlar(prev => [...prev, resimMesaji]);
      
      setTimeout(() => {
        const aiMesaj: Mesaj = { 
          id: Date.now().toString() + 'ai', 
          text: 'Harika bir fotoğraf! 📸\nAncak görsel analiz özelliğim şu an kapalı. Malzemeleri yazarsan yardımcı olabilirim! 😊', 
          gonderen: 'ai' 
        };
        setMesajlar(prev => [...prev, aiMesaj]);
      }, 1000);
    }
  };

  const gonder = async () => {
    if (yazi.trim() === '') return;

    const yeniMesaj: Mesaj = { id: Date.now().toString(), text: yazi, gonderen: 'kullanici' };
    setMesajlar(prev => [...prev, yeniMesaj]);
    setYazi('');
    setYukleniyor(true);

    try {
      const prompt = `
      GÖREV: Türk bir aşçı olarak verilen malzemelerle yapılabilecek EN İYİ yemeği öner.
      KURALLAR: Asla sohbet etme. Sadece yemeğin adını yaz ve altına tarifi yaz. Tarif en fazla 3-4 kısa madde olsun.
      Malzemeler: ${yeniMesaj.text}`;
      
      const randomSeed = Math.floor(Math.random() * 1000);
      const url = `${BASE_URL}${encodeURIComponent(prompt)}?seed=${randomSeed}&model=openai`;

      const response = await fetch(url);
      const aiCevabi = await response.text();

      const aiMesaj: Mesaj = { id: Date.now().toString() + 'ai', text: aiCevabi.trim(), gonderen: 'ai' };
      setMesajlar(prev => [...prev, aiMesaj]);

    } catch (error) {
      const hataMesaj: Mesaj = { id: Date.now().toString() + 'err', text: "Bağlantı hatası oluştu.", gonderen: 'ai' };
      setMesajlar(prev => [...prev, hataMesaj]);
    } finally {
      setYukleniyor(false);
    }
  };

  const mesajCiz = ({ item }: { item: Mesaj }) => {
    const ben = item.gonderen === 'kullanici';
    return (
      <View style={[styles.mesajSatiri, ben ? styles.sag : styles.sol]}>
        {!ben && <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png' }} style={styles.avatar} />}
        
        <View style={[
            styles.baloncuk, 
            ben ? styles.benimBaloncuk : [styles.aiBaloncuk, { backgroundColor: tema.kart, borderColor: tema.border }]
          ]}>
          
          {item.resim && (
            <Image source={{ uri: item.resim }} style={styles.gonderilenResim} />
          )}

          {item.text ? (
            <Text style={[
              styles.mesajYazi, 
              ben ? styles.benimYazi : { color: tema.yazi }
            ]}>{item.text}</Text>
          ) : null}
          
        </View>
      </View>
    );
  };

  const YaziyorBaloncugu = () => {
    if (!yukleniyor) return null;
    return (
      <View style={[styles.mesajSatiri, styles.sol, { marginBottom: 10 }]}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png' }} style={styles.avatar} />
        <View style={[
            styles.baloncuk, 
            { backgroundColor: tema.kart, borderColor: tema.border, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }
          ]}>
          <ActivityIndicator size="small" color="#FF6347" />
          <Text style={{ marginLeft: 10, color: tema.altMetin, fontSize: 12, fontStyle: 'italic' }}>
            Tarif hazırlanıyor...
          </Text>
        </View>
      </View>
    );
  };

  return (
    // SafeAreaView flex:1 önemli
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={karanlikMod ? "light-content" : "dark-content"} />
      
      {/* KLAVYE AYARI BURADA: 'height' Android için genelde çözümdür */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80} // Android için de pay bıraktık
      >
        <FlatList
          ref={flatListRef}
          data={mesajlar}
          renderItem={mesajCiz}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
          ListFooterComponent={<YaziyorBaloncugu />}
        />

        <View style={[styles.inputArea, { backgroundColor: tema.kart, borderTopColor: tema.border }]}>
          <TouchableOpacity onPress={resimSec} style={{ padding: 10 }}>
            <Ionicons name="camera" size={24} color="#FF6347" />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { backgroundColor: tema.arkaPlan, color: tema.yazi }]}
            placeholder="Malzemeleri yaz..."
            placeholderTextColor={tema.altMetin}
            value={yazi}
            onChangeText={setYazi}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={gonder}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
  chatContainer: { padding: 15, paddingBottom: 20 },
  mesajSatiri: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  sag: { justifyContent: 'flex-end' },
  sol: { justifyContent: 'flex-start' },
  avatar: { width: 35, height: 35, marginRight: 10, borderRadius: 20 },
  baloncuk: { maxWidth: '80%', padding: 12, borderRadius: 20 },
  benimBaloncuk: { backgroundColor: '#FF6347', borderBottomRightRadius: 2 },
  aiBaloncuk: { borderBottomLeftRadius: 2, borderWidth: 1 },
  mesajYazi: { fontSize: 15, lineHeight: 22 },
  benimYazi: { color: 'white' },
  gonderilenResim: { width: 200, height: 200, borderRadius: 10, marginBottom: 5 },
  inputArea: { flexDirection: 'row', padding: 10, alignItems: 'center', borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100, fontSize: 16, marginHorizontal: 5 },
  sendButton: { backgroundColor: '#FF6347', width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
});