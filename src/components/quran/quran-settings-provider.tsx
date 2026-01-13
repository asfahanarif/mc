
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// You can expand this with more settings like font choices, etc.
interface QuranSettings {
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  selectedTranslations: string[];
  setSelectedTranslations: (translations: string[]) => void;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  arabicFont: string;
  setArabicFont: (font: string) => void;
  translationFont: string;
  setTranslationFont: (font: string) => void;
}

const QuranSettingsContext = createContext<QuranSettings | undefined>(undefined);

export const QuranSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [arabicFontSize, setArabicFontSize] = useState(1.75); // rem
  const [translationFontSize, setTranslationFontSize] = useState(1); // rem
  const [lineHeight, setLineHeight] = useState(1.8);
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(['en.sahih']);
  const [showTranslation, setShowTranslation] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [arabicFont, setArabicFont] = useState("'Noto Naskh Arabic', serif");
  const [translationFont, setTranslationFont] = useState("Montserrat, sans-serif");
  
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));

  const value = {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    lineHeight,
    setLineHeight,
    selectedTranslations,
    setSelectedTranslations,
    showTranslation,
    setShowTranslation,
    zoomLevel,
    zoomIn,
    zoomOut,
    arabicFont,
    setArabicFont,
    translationFont,
    setTranslationFont,
  };

  return (
    <QuranSettingsContext.Provider value={value}>
      {children}
    </QuranSettingsContext.Provider>
  );
};

export const useQuranSettings = (): QuranSettings => {
  const context = useContext(QuranSettingsContext);
  if (!context) {
    throw new Error('useQuranSettings must be used within a QuranSettingsProvider');
  }
  return context;
};
