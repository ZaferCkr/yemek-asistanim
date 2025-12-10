import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
// doc (fonksiyon) çakışmasın diye dikkat ediyoruz
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';

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

interface FavoriContextType {
  favoriler: Yemek[];
  favorile: (yemek: Yemek) => void;
  favoriMi: (id: string) => boolean;
}

const RESIMLER: { [key: string]: any } = {
  '1': require('../assets/yemekler/1.jpg'),
  '2': require('../assets/yemekler/2.jpg'),
  '3': require('../assets/yemekler/3.jpg'),
  '4': require('../assets/yemekler/4.jpg'),
  '5': require('../assets/yemekler/5.jpg'),
  '6': require('../assets/yemekler/6.jpg'),
  '7': require('../assets/yemekler/7.jpg'),
  '8': require('../assets/yemekler/8.jpg'),
  '9': require('../assets/yemekler/9.jpg'),
  '10': require('../assets/yemekler/10.jpg'),
  '11': require('../assets/yemekler/11.jpg'),
  '12': require('../assets/yemekler/12.jpg'),
};

const FavoriContext = createContext<FavoriContextType | undefined>(undefined);

export const FavoriProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoriler, setFavoriler] = useState<Yemek[]>([]);

  useEffect(() => {
    const ref = collection(db, "favoriler");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const gelenVeri: Yemek[] = [];
      
      // DÜZELTME BURADA: 'doc' yerine 'belge' ismini kullandık ki karışmasın
      snapshot.forEach((belge) => {
        const veri = belge.data() as Yemek;
        // Eğer resim numarası listede varsa onu kullan, yoksa boş geç
        if (RESIMLER[veri.id]) {
            veri.resim = RESIMLER[veri.id];
        }
        gelenVeri.push(veri);
      });
      
      setFavoriler(gelenVeri);
    });

    return () => unsubscribe();
  }, []);

  const favorile = async (yemek: Yemek) => {
    const varMi = favoriler.find((item) => item.id === yemek.id);

    try {
      if (varMi) {
        // Silme işlemi
        await deleteDoc(doc(db, "favoriler", yemek.id));
      } else {
        // Ekleme işlemi
        // Resim dosyasını (require...) veritabanına gönderemeyiz, ayırıyoruz.
        const { resim, ...kaydedilecekVeri } = yemek; 
        
        await setDoc(doc(db, "favoriler", yemek.id), kaydedilecekVeri);
      }
    } catch (e) {
      console.error("Firebase Hatası:", e);
      alert("İnternet bağlantınızı kontrol edin!");
    }
  };

  const favoriMi = (id: string) => {
    return favoriler.some((item) => item.id === id);
  };

  return (
    <FavoriContext.Provider value={{ favoriler, favorile, favoriMi }}>
      {children}
    </FavoriContext.Provider>
  );
};

export const useFavori = () => {
  const context = useContext(FavoriContext);
  if (!context) throw new Error("useFavori must be used within a FavoriProvider");
  return context;
};