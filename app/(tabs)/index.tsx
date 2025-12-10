import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavori } from '../../components/FavoriContext';
import { useTema } from '../../components/ThemeContext';

interface Yemek {
  id: string;
  yemekAdi: string;
  kalori: string;
  sure: string;
  aciklama: string;
  resim: any;
  malzemeler: string[];
  tarif: string[];
  pufNoktasi: string;
}

// --- GÜNCELLENMİŞ: TAM KIVAMINDA TARİFLER ---
const TUM_YEMEKLER: Yemek[] = [
  {
    id: '1',
    yemekAdi: 'Köy Menemeni',
    kalori: '320 kcal',
    sure: '20 dk',
    aciklama: 'Kahvaltıların vazgeçilmezi, ekmek banmalık.',
    resim: require('../../assets/yemekler/1.jpg'),
    malzemeler: [
      '3 adet büyük boy yumurta',
      '4 adet orta boy sulu domates',
      '3 adet sivri biber (ince kıyılmış)',
      '1.5 yemek kaşığı tereyağı',
      'İsteğe bağlı: Pul biber, karabiber, tuz'
    ],
    tarif: [
      '1. Tavada tereyağını eritin ve biberleri kokusu çıkana kadar soteleyin.',
      '2. Kabuklarını soyup küp doğradığınız domatesleri ekleyin. Tavanın kapağını kapatıp domatesler suyunu salıp çekene kadar pişirin.',
      '3. Yumurtaları ayrı bir kapta hafifçe çırpın ve sosun üzerine gezdirin.',
      '4. Çok karıştırmadan, beyazların pişmesini bekleyin ve baharatları ekleyip ocaktan alın.',
      '✨ Sıcak ekmekle servis yapın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Domatesler suyunu tamamen çekmeden yumurtayı kırmayın, lezzeti orada gizli.'
  },
  {
    id: '2',
    yemekAdi: 'Fırın Köfte Patates',
    kalori: '450 kcal',
    sure: '45 dk',
    aciklama: 'Fırında pişen klasik anne lezzeti.',
    resim: require('../../assets/yemekler/2.jpg'),
    malzemeler: [
      '500g orta yağlı kıyma',
      '4 adet orta boy patates',
      '1 adet rendelenmiş soğan',
      '2 dilim bayat ekmek içi (ıslatılmış)',
      '1 tatlı kaşığı salça (sos için)',
      'Kimyon, kekik, karabiber'
    ],
    tarif: [
      '1. Kıymayı, soğanı, ekmek içini ve baharatları en az 10 dakika boyunca iyice yoğurun.',
      '2. Harçtan ceviz büyüklüğünde parçalar koparıp şekil verin.',
      '3. Patatesleri elma dilim doğrayıp köftelerle birlikte fırın tepsisine dizin.',
      '4. Salçayı sıcak suda açıp tepsinin üzerine gezdirin. 200 derecede patatesler kızarana kadar pişirin.',
      '✨ Yanına pirinç pilavı çok yakışır. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Köfte harcına bir çimdik karbonat eklerseniz köfteleriniz daha puf olur.'
  },
  {
    id: '3',
    yemekAdi: 'Süzme Mercimek',
    kalori: '180 kcal',
    sure: '30 dk',
    aciklama: 'Limon sıkıp içmelik sarı çorba.',
    resim: require('../../assets/yemekler/3.jpg'),
    malzemeler: [
      '1.5 su bardağı kırmızı mercimek',
      '1 adet patates (kıvam için)',
      '1 adet havuç',
      '1 adet kuru soğan',
      '6 su bardağı sıcak su veya et suyu',
      'Sos için: Tereyağı, nane, pul biber'
    ],
    tarif: [
      '1. İri doğranmış soğan, patates ve havucu az yağda 2-3 dakika kavurun.',
      '2. Yıkanmış mercimeği ve sıcak suyu ekleyip sebzeler yumuşayana kadar haşlayın.',
      '3. Çorbayı pürüzsüz olana kadar blenderdan geçirin.',
      '4. Küçük bir tavada tereyağını kızdırıp nane ve pul biber yakın, çorbanın üzerine dökün.',
      '✨ Limon sıkmayı unutmayın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Çorbanın renginin sapsarı olması için haşlarken çay kaşığı ucuyla zerdeçal atabilirsiniz.'
  },
  {
    id: '4',
    yemekAdi: 'Sebzeli Tavuk Sote',
    kalori: '290 kcal',
    sure: '25 dk',
    aciklama: 'Protein deposu pratik akşam yemeği.',
    resim: require('../../assets/yemekler/4.jpg'),
    malzemeler: [
      '600g tavuk göğsü (kuşbaşı)',
      '2 adet yeşil biber',
      '1 adet kırmızı kapya biber',
      '2 adet domates',
      '1 diş sarımsak',
      'Kekik, pul biber, tuz'
    ],
    tarif: [
      '1. Tavayı iyice ısıtın ve tavukları yüksek ateşte suyunu salıp çekene kadar mühürleyin.',
      '2. Yemeklik doğranmış soğan ve biberleri ekleyip sotelemeye devam edin.',
      '3. Küp doğranmış domatesleri ve sarımsağı ekleyip domatesler eriyene kadar pişirin.',
      '4. En son tuzunu ve bolca kekiği ekleyip ocaktan alın.',
      '✨ Lokum gibi oldu! Afiyet olsun. 😋'
    ],
    pufNoktasi: 'Tavukların sertleşmemesi için tuzu en son, ocaktan alırken atın.'
  },
  {
    id: '5',
    yemekAdi: 'İrmik Helvası',
    kalori: '350 kcal',
    sure: '20 dk',
    aciklama: 'Tam kıvamında, dondurmalı veya sade.',
    resim: require('../../assets/yemekler/5.jpg'),
    malzemeler: [
      '1.5 su bardağı irmik',
      '3 yemek kaşığı tereyağı',
      '1.5 su bardağı toz şeker',
      '1.5 su bardağı süt (veya su)',
      'İsteğe bağlı: Çam fıstığı'
    ],
    tarif: [
      '1. Tereyağını eritin, fıstıkları ve irmiği ekleyip rengi koyulaşana kadar sabırla kavurun.',
      '2. Süt ve şekeri ayrı bir kapta karıştırın (kaynatmaya gerek yok).',
      '3. Şerbeti kavrulan irmiğin üzerine dikkatlice dökün ve hızlıca karıştırın.',
      '4. Kısık ateşte suyunu çekene kadar pişirip demlenmeye bırakın.',
      '✨ Sıcak servis yapın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Şerbeti soğuk dökerseniz helva lapa olmaz, tane tane dökülür.'
  },
  {
    id: '6',
    yemekAdi: 'Zeytinyağlı Fasulye',
    kalori: '150 kcal',
    sure: '40 dk',
    aciklama: 'Hafif ve lezzetli yaz yemeği.',
    resim: require('../../assets/yemekler/6.jpg'),
    malzemeler: [
      '500g taze fasulye',
      '3 adet rendelenmiş domates',
      '1 adet büyük soğan',
      'Yarım çay bardağı zeytinyağı',
      '1 tatlı kaşığı toz şeker'
    ],
    tarif: [
      '1. Soğanı zeytinyağında pembeleşene kadar kavurun.',
      '2. Ayıklanmış fasulyeleri ekleyip renkleri koyu yeşile dönene kadar çevirin.',
      '3. Domatesleri ve şekeri ekleyin. Hiç su koymadan, kısık ateşte kendi suyuyla pişmeye bırakın.',
      '✨ Ilık veya soğuk servis yapın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Fasulyeyi pişirirken tencere kapağını sık sık açmayın, rengi canlı kalsın.'
  },
  {
    id: '7',
    yemekAdi: 'Karnıyarık',
    kalori: '380 kcal',
    sure: '50 dk',
    aciklama: 'Patlıcan ve kıymanın muhteşem uyumu.',
    resim: require('../../assets/yemekler/7.jpg'),
    malzemeler: [
      '4 adet orta boy patlıcan',
      '250g kıyma',
      '1 adet soğan, 1 adet biber, 1 adet domates',
      '1 tatlı kaşığı salça',
      'Kızartmak için sıvı yağ'
    ],
    tarif: [
      '1. Patlıcanları alacalı soyup kızartın ve kağıt havluya alın.',
      '2. Ayrı bir tavada kıymalı, soğanlı, domatesli iç harcı hazırlayın.',
      '3. Patlıcanların ortasını açıp harcı doldurun. Üzerine birer dilim domates biber koyun.',
      '4. Salçalı su yapıp tepsiye dökün ve fırında 20dk pişirin.',
      '✨ Pilavla harika gider. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Patlıcanları kızartmadan önce tuzlu suda 15dk bekletirseniz yağ çekmez.'
  },
  {
    id: '8',
    yemekAdi: 'Kabak Mücver',
    kalori: '140 kcal',
    sure: '25 dk',
    aciklama: 'Çıtır çıtır, peynirli lezzet.',
    resim: require('../../assets/yemekler/8.jpg'),
    malzemeler: [
      '3 adet kabak',
      '2 adet yumurta',
      'Bir tutam dereotu ve taze soğan',
      '100g beyaz peynir',
      '3-4 yemek kaşığı un'
    ],
    tarif: [
      '1. Kabakları rendeleyin ve suyunu avucunuzla iyice sıkın (Çok önemli!).',
      '2. Tüm malzemeleri bir kapta karıştırıp koyu bir harç elde edin.',
      '3. Tavada az yağı kızdırın, kaşıkla döküp önlü arkalı kızartın.',
      '✨ Sarımsaklı yoğurtla servis yapın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Kabakların suyunu sıkmazsanız mücveriniz hamur olur.'
  },
  {
    id: '9',
    yemekAdi: 'Hünkar Beğendi',
    kalori: '500 kcal',
    sure: '60 dk',
    aciklama: 'Saray mutfağından günümüze.',
    resim: require('../../assets/yemekler/9.jpg'),
    malzemeler: [
      '500g kuşbaşı et',
      '4 adet bostan patlıcanı',
      '2 yemek kaşığı un',
      '1.5 su bardağı süt',
      '1 kase rendelenmiş kaşar'
    ],
    tarif: [
      '1. Etleri suyunu çekip yumuşayana kadar pişirin.',
      '2. Patlıcanları közleyip ezin. Tavada unu tereyağında kavurun.',
      '3. Köz patlıcanları una ekleyin, sütü yavaşça döküp kıvam aldırın. En son kaşarı ekleyin.',
      '4. Tabağa önce beğendiyi, üzerine eti koyarak servis yapın.',
      '✨ Saraylara layık oldu! Afiyet olsun. 😋'
    ],
    pufNoktasi: 'Beğendi sosuna biraz muskat rendesi eklerseniz lezzeti katlanır.'
  },
  {
    id: '10',
    yemekAdi: 'Fırın Sütlaç',
    kalori: '280 kcal',
    sure: '45 dk',
    aciklama: 'Üzeri nar gibi kızarmış sütlü tatlı.',
    resim: require('../../assets/yemekler/10.jpg'),
    malzemeler: [
      '1 litre süt',
      '1 su bardağı toz şeker',
      '1 çay bardağı pirinç',
      '2 yemek kaşığı nişasta',
      '1 paket vanilya'
    ],
    tarif: [
      '1. Pirinçleri yumuşayana kadar haşlayın. Sütü ve şekeri ekleyin.',
      '2. Nişastayı az sütle açıp tencereye dökün, kıvam alana kadar karıştırın.',
      '3. Güveç kaplarına paylaştırıp fırın tepsisine dizin. Tepsiye biraz soğuk su koyun.',
      '4. Fırının sadece üst ızgarasını açıp üzeri kızarana kadar pişirin.',
      '✨ Soğuk servis yapın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Tepsiye su koymazsanız sütlaçlar taşabilir ve kuruyabilir.'
  },
  {
    id: '11',
    yemekAdi: 'Ezogelin Çorbası',
    kalori: '170 kcal',
    sure: '35 dk',
    aciklama: 'Naneli, baharatlı, tam kıvamında.',
    resim: require('../../assets/yemekler/11.jpg'),
    malzemeler: [
      '1 su bardağı kırmızı mercimek',
      '1 yemek kaşığı pirinç ve bulgur',
      '1 adet soğan',
      '1 yemek kaşığı salça',
      'Kuru nane, pul biber'
    ],
    tarif: [
      '1. Soğanı ve salçayı yağda kavurun.',
      '2. Yıkanmış bakliyatları ve sıcak suyu ekleyip düdüklüde veya tencerede pişirin.',
      '3. Ayrı bir tavada bol naneli yağ yakıp çorbanın üzerine dökün.',
      '✨ Limonla servis yapın. Afiyet olsun! 😋'
    ],
    pufNoktasi: 'Ezogelin çorbası blenderdan geçirilmez, hafif taneli kalması makbuldür.'
  },
  {
    id: '12',
    yemekAdi: 'Kayseri Mantısı',
    kalori: '400 kcal',
    sure: '25 dk',
    aciklama: 'Sarımsaklı yoğurt ve salçalı sos ile.',
    resim: require('../../assets/yemekler/12.jpg'),
    malzemeler: [
      '1 paket mantı',
      '1 kase yoğurt',
      '2 diş sarımsak',
      '2 yemek kaşığı tereyağı',
      '1 tatlı kaşığı salça',
      'Sumak, nane'
    ],
    tarif: [
      '1. Mantıları tuzlu kaynar suda haşlayıp süzün.',
      '2. Sarımsaklı yoğurdu hazırlayıp mantının üzerine dökün.',
      '3. Tereyağında salçayı ve baharatları yakıp en üste gezdirin.',
      '✨ Efsane lezzet hazır! Afiyet olsun. 😋'
    ],
    pufNoktasi: 'Mantı haşlama suyuna bir kaşık sıvı yağ koyarsanız birbirine yapışmaz.'
  }
];

export default function MenuScreen() {
  const { favorile, favoriMi } = useFavori();
  const { tema, karanlikMod } = useTema();
  
  const [secilenYemek, setSecilenYemek] = useState<Yemek | null>(null);
  const [modalAcik, setModalAcik] = useState(false);
  const [gunlukYemekler, setGunlukYemekler] = useState<Yemek[]>([]);
  const [tarihBasligi, setTarihBasligi] = useState('');

  useEffect(() => {
    const bugun = new Date();
    const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    setTarihBasligi(`${bugun.getDate()} ${aylar[bugun.getMonth()]} ${bugun.getFullYear()}`);

    const baslangicIndex = (bugun.getDate() * 3) % TUM_YEMEKLER.length;
    let secilenler = [];
    for (let i = 0; i < 3; i++) {
        secilenler.push(TUM_YEMEKLER[(baslangicIndex + i) % TUM_YEMEKLER.length]);
    }
    setGunlukYemekler(secilenler);
  }, []);

  const detayAc = (yemek: Yemek) => {
    setSecilenYemek(yemek);
    setModalAcik(true);
  };

  const yemekKartiCiz = ({ item }: { item: Yemek }) => {
    const isFav = favoriMi(item.id);
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => detayAc(item)}>
        <View style={[styles.kart, { backgroundColor: tema.kart, shadowColor: "#000" }]}>
          <Image source={item.resim} style={styles.yemekResmi} resizeMode="cover" />
          
          <TouchableOpacity style={styles.kalpButonu} onPress={() => favorile(item)}>
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "#FF6347" : "white"} />
          </TouchableOpacity>

          <View style={styles.yaziAlani}>
            <View style={styles.baslikSatiri}>
                <Text style={[styles.yemekAdi, { color: tema.yazi }]} numberOfLines={1}>{item.yemekAdi}</Text>
                <Text style={styles.kaloriBadge}>{item.kalori}</Text>
            </View>
            <Text style={[styles.aciklama, { color: tema.altMetin }]} numberOfLines={1}>{item.aciklama}</Text>
            <View style={styles.altSatir}>
                <Ionicons name="time-outline" size={16} color={tema.altMetin} />
                <Text style={[styles.sure, { color: tema.altMetin }]}>{item.sure}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.arkaPlan }]}>
      <StatusBar barStyle={karanlikMod ? "light-content" : "dark-content"} />
      <FlatList
        data={gunlukYemekler}
        renderItem={yemekKartiCiz}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
                  
                  <View style={[styles.pufNoktasiKutu, { backgroundColor: karanlikMod ? '#333' : '#FFF8E1', borderColor: karanlikMod ? '#444' : '#FFE082' }]}>
                    <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
                        <Ionicons name="bulb" size={20} color="#FFD700" />
                        <Text style={[styles.pufBaslik, { color: tema.yazi }]}> Şefin Sırrı:</Text>
                    </View>
                    <Text style={[styles.pufYazi, { color: tema.altMetin }]}>{secilenYemek.pufNoktasi}</Text>
                  </View>

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
  container: { flex: 1 },
  listContainer: { padding: 20, paddingBottom: 50 },
  kart: { backgroundColor: 'white', borderRadius: 20, marginBottom: 25, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
  yemekResmi: { width: '100%', height: 220, backgroundColor: '#eee' },
  kalpButonu: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 50 },
  yaziAlani: { padding: 20 },
  baslikSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  yemekAdi: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  kaloriBadge: { backgroundColor: '#FFF0ED', color: '#FF6347', fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, fontSize: 12 },
  aciklama: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  altSatir: { flexDirection: 'row', alignItems: 'center' },
  sure: { fontSize: 13, marginLeft: 5, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '92%', overflow: 'hidden' },
  modalImage: { width: '100%', height: 300 },
  kapatButonu: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.2, elevation:3 },
  modalTextContainer: { padding: 25, paddingBottom: 50 },
  modalTitle: { fontSize: 28, fontWeight: '800', marginBottom: 10, textAlign:'center' },
  bolum: { marginBottom: 25 },
  bolumBasligi: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#FF6347', paddingLeft: 10 },
  maddeSatiri: { flexDirection: 'row', marginBottom: 8, paddingRight: 10 },
  maddeIsareti: { fontSize: 16, lineHeight: 24, flex: 1 },
  tarifSatiri: { flexDirection: 'row', marginBottom: 15 },
  adimNo: { width: 28, height: 28, backgroundColor: '#FF6347', color: 'white', textAlign: 'center', lineHeight: 28, borderRadius: 14, fontWeight: 'bold', marginRight: 12, marginTop: 2 },
  tarifAdimi: { fontSize: 16, lineHeight: 26, flex: 1 },
  pufNoktasiKutu: { padding: 15, borderRadius: 15, marginBottom: 25, borderWidth: 1 },
  pufBaslik: { fontWeight: 'bold', fontSize: 16 },
  pufYazi: { fontSize: 15, lineHeight: 22 }
});