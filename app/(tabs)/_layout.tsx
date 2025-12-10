import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTema } from '../../components/ThemeContext';

export default function TabLayout() {
  const { karanlikMod, toggleTema, tema } = useTema();
  const [menuAcik, setMenuAcik] = useState(false);
  const router = useRouter();

  const SagUstMenu = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => setMenuAcik(true)} style={{ paddingRight: 15 }}>
        <Ionicons name="ellipsis-vertical" size={24} color={karanlikMod ? '#FFF' : '#333'} />
      </TouchableOpacity>

      <Modal visible={menuAcik} transparent={true} animationType="fade" onRequestClose={() => setMenuAcik(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuAcik(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuKutusu, { backgroundColor: tema.kart, borderColor: tema.border }]}>
                
                <TouchableOpacity style={styles.menuSatiri} onPress={() => { setMenuAcik(false); router.push('/favoriler'); }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="heart" size={20} color={tema.ikon} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: tema.yazi }}>Favorilerim</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={tema.altMetin} />
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: tema.border, marginVertical: 5 }} />

                <View style={styles.menuSatiri}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={karanlikMod ? "moon" : "sunny"} size={20} color={tema.ikon} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: tema.yazi }}>{karanlikMod ? "Koyu Mod" : "Açık Mod"}</Text>
                  </View>
                  <Switch value={karanlikMod} onValueChange={toggleTema} trackColor={{ false: "#767577", true: "#FF6347" }} thumbColor={"#f4f3f4"} />
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: tema.arkaPlan, borderBottomColor: tema.border, borderBottomWidth: 1 },
        headerTitleStyle: { color: tema.yazi, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: tema.arkaPlan, borderTopColor: tema.border, height: 60, paddingBottom: 5 },
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'center',
        headerRight: () => <SagUstMenu />, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menü',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="kalori"
        options={{
          title: 'Kalori',
          tabBarIcon: ({ color }) => <Ionicons name="flame" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="alisveris"
        options={{
          title: 'Sepet',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />

      {/* YENİ EKLENEN ARAÇLAR SEKMESİ */}
      <Tabs.Screen
        name="araclar"
        options={{
          title: 'Araçlar',
          tabBarIcon: ({ color }) => <Ionicons name="timer" size={24} color={color} />,
        }}
      />

      {/* SAĞLIK BUTONUNU GİZLİYORUZ (Kalabalık olmasın diye) */}
      <Tabs.Screen
        name="saglik"
        options={{
          href: null, // GİZLİ (İstersen açabilirsin)
          title: 'Sağlık',
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Şef',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} />,
        }}
      />

      <Tabs.Screen name="favoriler" options={{ href: null, title: 'Favorilerim' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  menuKutusu: { width: 220, marginTop: 50, marginRight: 10, borderRadius: 12, padding: 10, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  menuSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 5 }
});