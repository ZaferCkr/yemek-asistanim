import { render } from '@testing-library/react-native';
import React from 'react';
import LoginScreen from '../app/login';

/* ================= MOCKS ================= */

// expo-router mock
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// firebase auth mock
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

// firebase firestore mock
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true })),
  query: jest.fn(),
  setDoc: jest.fn(),
  where: jest.fn(),
}));

// firebase config mock
jest.mock('../firebaseConfig', () => ({
  auth: {},
  db: {},
}));

/* ================= TEST ================= */

describe('LoginScreen', () => {
  it('Login ekranı render ediliyor', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Giriş Yap 🍕')).toBeTruthy();
  });
});
