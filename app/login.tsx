import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();

  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [email, setEmail] = useState('');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kayitModu, setKayitModu] = useState(false);

  const islemYap = async () => {
    setYukleniyor(true);

    try {
      /* ================= KAYIT OL ================= */
      if (kayitModu) {
        if (!email || !sifre || !kullaniciAdi) {
          Alert.alert('Hata', 'Tüm alanları doldurun.');
          return;
        }

        if (!email.includes('@')) {
          Alert.alert('Hata', 'Geçerli bir email giriniz.');
          return;
        }

        const userQuery = query(
          collection(db, 'users'),
          where('username', '==', kullaniciAdi)
        );
        const userSnap = await getDocs(userQuery);

        if (!userSnap.empty) {
          Alert.alert('Hata', 'Bu kullanıcı adı zaten kullanılıyor.');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          sifre
        );

        await updateProfile(userCredential.user, {
          displayName: kullaniciAdi,
        });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          username: kullaniciAdi,
          email: email,
          createdAt: new Date(),
        });

        Alert.alert(
          'Başarılı 🎉',
          'Hesabın oluşturuldu! Şimdi giriş yapabilirsin.'
        );

        setKullaniciAdi('');
        setEmail('');
        setSifre('');
        setKayitModu(false);
        return;
      }

      /* ================= GİRİŞ YAP ================= */
      else {
        if (!emailOrUser || !sifre) {
          Alert.alert('Hata', 'Bilgileri giriniz.');
          return;
        }

        let girisEmail = emailOrUser;

        if (!emailOrUser.includes('@')) {
          const q = query(
            collection(db, 'users'),
            where('username', '==', emailOrUser)
          );
          const snap = await getDocs(q);

          if (snap.empty) {
            Alert.alert('Hata', 'Kullanıcı bulunamadı.');
            return;
          }

          girisEmail = snap.docs[0].data().email;
        }

        await signInWithEmailAndPassword(auth, girisEmail, sifre);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      let mesaj = 'Bir hata oluştu';

      if (error.code === 'auth/email-already-in-use') mesaj = 'Bu email zaten kayıtlı';
      if (error.code === 'auth/invalid-email') mesaj = 'Geçersiz email';
      if (error.code === 'auth/wrong-password') mesaj = 'Şifre yanlış';
      if (error.code === 'auth/user-not-found') mesaj = 'Kullanıcı bulunamadı';
      if (error.code === 'auth/weak-password') mesaj = 'Şifre en az 6 karakter olmalı';

      Alert.alert('Hata', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrap}
      >
        <Text style={styles.title}>
          {kayitModu ? 'Kayıt Ol 🍽️' : 'Giriş Yap 🍕'}
        </Text>

        <View style={styles.card}>
          {kayitModu && (
            <>
              <TextInput
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#999"
                style={styles.input}
                value={kullaniciAdi}
                onChangeText={setKullaniciAdi}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </>
          )}

          {!kayitModu && (
            <TextInput
              placeholder="Email veya Kullanıcı Adı"
              placeholderTextColor="#999"
              style={styles.input}
              value={emailOrUser}
              onChangeText={setEmailOrUser}
              autoCapitalize="none"
            />
          )}

          <TextInput
            placeholder="Şifre"
            placeholderTextColor="#999"
            style={styles.input}
            value={sifre}
            onChangeText={setSifre}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={islemYap}>
            {yukleniyor ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {kayitModu ? 'Kayıt Ol' : 'Giriş Yap'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setKayitModu(!kayitModu)}>
          <Text style={styles.switch}>
            {kayitModu
              ? 'Zaten hesabın var mı? Giriş yap'
              : 'Hesabın yok mu? Kayıt ol'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E6', // yemek teması açık arka plan
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF6F3C', // turuncu
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFD0B0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#FF6F3C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  switch: {
    marginTop: 20,
    textAlign: 'center',
    color: '#FF6F3C',
    fontWeight: '600',
  },
});
