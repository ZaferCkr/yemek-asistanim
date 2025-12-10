import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "API_KEY_BURAYA",
  authDomain: "yemekasistani-934b7.firebaseapp.com",
  projectId: "yemekasistani-934b7",
  storageBucket: "yemekasistani-934b7.firebasestorage.app",
  messagingSenderId: "282429714140",
  appId: "1:282429714140:web:7ed03e34f4cb3c5b558e19"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
