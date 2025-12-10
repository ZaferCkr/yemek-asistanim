import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native'; // Telefonun kendi ayarını algılamak için

// Renk Paletleri
export const temalar = {
  acik: {
    arkaPlan: '#F5F5F5',
    yazi: '#333333',
    kart: '#FFFFFF',
    ikon: '#333333',
    altMetin: '#666666',
    border: '#eeeeee'
  },
  koyu: {
    arkaPlan: '#121212',
    yazi: '#FFFFFF',
    kart: '#1E1E1E',
    ikon: '#FFFFFF',
    altMetin: '#AAAAAA',
    border: '#333333'
  }
};

const ThemeContext = createContext<any>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const sistemTemasi = useColorScheme(); // Telefonun ayarı neyse o (Dark/Light)
  const [karanlikMod, setKaranlikMod] = useState(sistemTemasi === 'dark');

  const tema = karanlikMod ? temalar.koyu : temalar.acik;

  const toggleTema = () => {
    setKaranlikMod(!karanlikMod);
  };

  return (
    <ThemeContext.Provider value={{ karanlikMod, toggleTema, tema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTema = () => useContext(ThemeContext);