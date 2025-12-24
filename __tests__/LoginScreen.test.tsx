import { fireEvent, render, waitFor } from '@testing-library/react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React from 'react';
import { Alert } from 'react-native';
import LoginScreen from '../app/login';

/* ================= MOCKS ================= */

// ✅ Expo Router (Jest uyumlu)
jest.mock('expo-router', () => {
  const mockReplace = jest.fn();
  return {
    useRouter: () => ({
      replace: mockReplace,
    }),
    __mockReplace: mockReplace, // ⬅️ testte erişeceğiz
  };
});

// ✅ Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

// ✅ Firestore (ESM sorunu çözülür)
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      empty: true,
      docs: [],
    })
  ),
  setDoc: jest.fn(),
}));

// ✅ Firebase config
jest.mock('../firebaseConfig', () => ({
  auth: {},
  db: {},
}));

// ✅ Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

/* ================= TESTS ================= */

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Login ekranı render ediliyor', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Giriş Yap 🍕')).toBeTruthy();
  });

  it('Email ve Şifre inputları görünür', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email veya Kullanıcı Adı')).toBeTruthy();
    expect(getByPlaceholderText('Şifre')).toBeTruthy();
  });

  it('Başarılı girişte Firebase çağrılır', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Email veya Kullanıcı Adı'),
      'test@mail.com'
    );
    fireEvent.changeText(getByPlaceholderText('Şifre'), '123456');

    fireEvent.press(getByText('Giriş Yap'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });

  it('Başarılı girişte ana sayfaya yönlendirilir', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    const routerMock = require('expo-router');

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Email veya Kullanıcı Adı'),
      'test@mail.com'
    );
    fireEvent.changeText(getByPlaceholderText('Şifre'), '123456');

    fireEvent.press(getByText('Giriş Yap'));

    await waitFor(() => {
      expect(routerMock.__mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('Hatalı girişte Alert gösterilir', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
      code: 'auth/wrong-password',
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Email veya Kullanıcı Adı'),
      'wrong@mail.com'
    );
    fireEvent.changeText(getByPlaceholderText('Şifre'), '000000');

    fireEvent.press(getByText('Giriş Yap'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('Başarılı kayıt işleminde Firebase çağrılır', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123' },
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.press(getByText('Hesabın yok mu? Kayıt ol'));

    fireEvent.changeText(getByPlaceholderText('Kullanıcı Adı'), 'zafer');
    fireEvent.changeText(getByPlaceholderText('Email'), 'zafer@mail.com');
    fireEvent.changeText(getByPlaceholderText('Şifre'), '123456');

    fireEvent.press(getByText('Kayıt Ol'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    });
  });
});
