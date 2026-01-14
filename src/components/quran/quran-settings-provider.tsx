
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  urduFont: string;
  setUrduFont: (font: string) => void;
  selectedReciter: string;
  setSelectedReciter: (reciter: string) => void;
  isArabicBold: boolean;
  setIsArabicBold: (isBold: boolean) => void;
  isTranslationBold: boolean;
  setIsTranslationBold: (isBold: boolean) => void;
  isUrduBold: boolean;
  setIsUrduBold: (isBold: boolean) => void;
  isAutoScrolling: boolean;
  setIsAutoScrolling: (isScrolling: boolean) => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
}

const QuranSettingsContext = createContext<QuranSettings | undefined>(undefined);

const STORAGE_KEY = 'quran-settings';

export const QuranSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [arabicFontSize, setArabicFontSize] = useState(1.75); // rem
  const [translationFontSize, setTranslationFontSize] = useState(1); // rem
  const [lineHeight, setLineHeight] = useState(1.8);
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(['en.sahih', 'en.hilali', 'ur.junagarhi']);
  const [showTranslation, setShowTranslation] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [arabicFont, setArabicFont] = useState("'Amiri', serif");
  const [translationFont, setTranslationFont] = useState("Montserrat, sans-serif");
  const [urduFont, setUrduFont] = useState("'Noto Nastaliq Urdu', serif");
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [isArabicBold, setIsArabicBold] = useState(false);
  const [isTranslationBold, setIsTranslationBold] = useState(false);
  const [isUrduBold, setIsUrduBold] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(50); // From 1 to 100
  
  // Load settings from localStorage on initial client-side render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setArabicFontSize(parsed.arabicFontSize || 1.75);
        setTranslationFontSize(parsed.translationFontSize || 1);
        setLineHeight(parsed.lineHeight || 1.8);
        setSelectedTranslations(parsed.selectedTranslations || ['en.sahih', 'en.hilali', 'ur.junagarhi']);
        setShowTranslation(parsed.showTranslation === false ? false : true);
        setZoomLevel(parsed.zoomLevel || 1);
        setArabicFont(parsed.arabicFont || "'Amiri', serif");
        setTranslationFont(parsed.translationFont || "Montserrat, sans-serif");
        setUrduFont(parsed.urduFont || "'Noto Nastaliq Urdu', serif");
        setSelectedReciter(parsed.selectedReciter || 'ar.alafasy');
        setIsArabicBold(parsed.isArabicBold || false);
        setIsTranslationBold(parsed.isTranslationBold || false);
        setIsUrduBold(parsed.isUrduBold || false);
        setScrollSpeed(parsed.scrollSpeed || 50);
      }
    } catch (error) {
        console.error("Failed to load Quran settings from localStorage", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settingsToSave = {
        arabicFontSize,
        translationFontSize,
        lineHeight,
        selectedTranslations,
        showTranslation,
        zoomLevel,
        arabicFont,
        translationFont,
        urduFont,
        selectedReciter,
        isArabicBold,
        isTranslationBold,
        isUrduBold,
        scrollSpeed,
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
        console.error("Failed to save Quran settings to localStorage", error);
    }
  }, [
    arabicFontSize, translationFontSize, lineHeight, selectedTranslations, showTranslation, zoomLevel,
    arabicFont, translationFont, urduFont, selectedReciter, isArabicBold, isTranslationBold, isUrduBold, scrollSpeed
  ]);


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
    urduFont,
    setUrduFont,
    selectedReciter,
    setSelectedReciter,
    isArabicBold,
    setIsArabicBold,
    isTranslationBold,
    setIsTranslationBold,
    isUrduBold,
    setIsUrduBold,
    isAutoScrolling,
    setIsAutoScrolling,
    scrollSpeed,
    setScrollSpeed,
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
