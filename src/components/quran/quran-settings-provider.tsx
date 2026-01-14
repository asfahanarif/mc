
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
  isAutoplayEnabled: boolean;
  setIsAutoplayEnabled: (enabled: boolean) => void;
  arabicScript: string;
  setArabicScript: (script: string) => void;
  indoPakFont: string;
  setIndoPakFont: (font: string) => void;
  resetSettings: () => void;
}

const QuranSettingsContext = createContext<QuranSettings | undefined>(undefined);

const STORAGE_KEY = 'quran-settings';

const defaultSettings = {
  arabicFontSize: 1.75, // rem
  translationFontSize: 1, // rem
  lineHeight: 1.6,
  selectedTranslations: ['en.sahih', 'ur.junagarhi'],
  showTranslation: true,
  zoomLevel: 1,
  arabicFont: "'Scheherazade New', serif",
  indoPakFont: "'Al Qalam', sans-serif",
  translationFont: "'Roboto', sans-serif",
  urduFont: "'Noto Nastaliq Urdu', serif",
  selectedReciter: 'ar.alafasy',
  isArabicBold: true,
  isTranslationBold: false,
  isUrduBold: false,
  scrollSpeed: 50,
  isAutoplayEnabled: true,
  arabicScript: 'quran-indopak',
};

export const QuranSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [arabicFontSize, setArabicFontSize] = useState(defaultSettings.arabicFontSize);
  const [translationFontSize, setTranslationFontSize] = useState(defaultSettings.translationFontSize);
  const [lineHeight, setLineHeight] = useState(defaultSettings.lineHeight);
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(defaultSettings.selectedTranslations);
  const [showTranslation, setShowTranslation] = useState(defaultSettings.showTranslation);
  const [zoomLevel, setZoomLevel] = useState(defaultSettings.zoomLevel);
  const [arabicFont, setArabicFont] = useState(defaultSettings.arabicFont);
  const [indoPakFont, setIndoPakFont] = useState(defaultSettings.indoPakFont);
  const [translationFont, setTranslationFont] = useState(defaultSettings.translationFont);
  const [urduFont, setUrduFont] = useState(defaultSettings.urduFont);
  const [selectedReciter, setSelectedReciter] = useState(defaultSettings.selectedReciter);
  const [isArabicBold, setIsArabicBold] = useState(defaultSettings.isArabicBold);
  const [isTranslationBold, setIsTranslationBold] = useState(defaultSettings.isTranslationBold);
  const [isUrduBold, setIsUrduBold] = useState(defaultSettings.isUrduBold);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(defaultSettings.scrollSpeed);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(defaultSettings.isAutoplayEnabled);
  const [arabicScript, setArabicScript] = useState(defaultSettings.arabicScript);
  
  const resetSettings = () => {
    setArabicFontSize(defaultSettings.arabicFontSize);
    setTranslationFontSize(defaultSettings.translationFontSize);
    setLineHeight(defaultSettings.lineHeight);
    setSelectedTranslations(defaultSettings.selectedTranslations);
    setShowTranslation(defaultSettings.showTranslation);
    setZoomLevel(defaultSettings.zoomLevel);
    setArabicFont(defaultSettings.arabicFont);
    setIndoPakFont(defaultSettings.indoPakFont);
    setTranslationFont(defaultSettings.translationFont);
    setUrduFont(defaultSettings.urduFont);
    setSelectedReciter(defaultSettings.selectedReciter);
    setIsArabicBold(defaultSettings.isArabicBold);
    setIsTranslationBold(defaultSettings.isTranslationBold);
    setIsUrduBold(defaultSettings.isUrduBold);
    setScrollSpeed(defaultSettings.scrollSpeed);
    setIsAutoplayEnabled(defaultSettings.isAutoplayEnabled);
    setArabicScript(defaultSettings.arabicScript);
  };

  // Load settings from localStorage on initial client-side render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setArabicFontSize(parsed.arabicFontSize || defaultSettings.arabicFontSize);
        setTranslationFontSize(parsed.translationFontSize || defaultSettings.translationFontSize);
        setLineHeight(parsed.lineHeight || defaultSettings.lineHeight);
        setSelectedTranslations(parsed.selectedTranslations || defaultSettings.selectedTranslations);
        setShowTranslation(parsed.showTranslation === false ? false : true);
        setZoomLevel(parsed.zoomLevel || defaultSettings.zoomLevel);
        setArabicFont(parsed.arabicFont || defaultSettings.arabicFont);
        setIndoPakFont(parsed.indoPakFont || defaultSettings.indoPakFont);
        setTranslationFont(parsed.translationFont || defaultSettings.translationFont);
        setUrduFont(parsed.urduFont || defaultSettings.urduFont);
        setSelectedReciter(parsed.selectedReciter || defaultSettings.selectedReciter);
        setIsArabicBold(parsed.isArabicBold !== undefined ? parsed.isArabicBold : defaultSettings.isArabicBold);
        setIsTranslationBold(parsed.isTranslationBold !== undefined ? parsed.isTranslationBold : defaultSettings.isTranslationBold);
        setIsUrduBold(parsed.isUrduBold !== undefined ? parsed.isUrduBold : defaultSettings.isUrduBold);
        setScrollSpeed(parsed.scrollSpeed || defaultSettings.scrollSpeed);
        setIsAutoplayEnabled(parsed.isAutoplayEnabled !== undefined ? parsed.isAutoplayEnabled : defaultSettings.isAutoplayEnabled);
        setArabicScript(parsed.arabicScript || defaultSettings.arabicScript);
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
        indoPakFont,
        translationFont,
        urduFont,
        selectedReciter,
        isArabicBold,
        isTranslationBold,
        isUrduBold,
        scrollSpeed,
        isAutoplayEnabled,
        arabicScript,
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
        console.error("Failed to save Quran settings to localStorage", error);
    }
  }, [
    arabicFontSize, translationFontSize, lineHeight, selectedTranslations, showTranslation, zoomLevel,
    arabicFont, indoPakFont, translationFont, urduFont, selectedReciter, isArabicBold, isTranslationBold, isUrduBold, scrollSpeed,
    isAutoplayEnabled, arabicScript,
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
    indoPakFont,
    setIndoPakFont,
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
    isAutoplayEnabled,
    setIsAutoplayEnabled,
    arabicScript,
    setArabicScript,
    resetSettings,
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
